import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CourseService } from '../../services/course-service/course-service';
import { CourseMetadataResponse } from '../../dtos/course-metadata-response';
import { CourseCreateRequest } from '../../dtos/course-create-request';
import { CourseUpdateRequest } from '../../dtos/course-update-request';

@Component({
  selector: 'app-courses-management-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './courses-management-page.html',
  styleUrl: './courses-management-page.css'
})
export class CoursesManagementPage implements OnInit {

  courses = signal<CourseMetadataResponse[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Add course form
  showAddForm = signal(false);
  newCourseName = signal('');
  isSubmitting = signal(false);

  // Inline editing
  editingCourseId = signal<number | null>(null);
  editingCourseName = signal('');

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.courseService.getCoursesMetadata().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load courses');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  toggleAddForm() {
    this.showAddForm.update(v => !v);
    if (!this.showAddForm()) {
      this.newCourseName.set('');
    }
  }

  addCourse() {
    const name = this.newCourseName().trim();
    
    if (!name) {
      return;
    }

    this.isSubmitting.set(true);
    const newCourse: CourseCreateRequest = { name };

    this.courseService.postCourse(newCourse).subscribe({
      next: () => {
        this.loadCourses();
        this.newCourseName.set('');
        this.showAddForm.set(false);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.error.set('Failed to add course');
        this.isSubmitting.set(false);
        console.error(err);
      }
    });
  }

  deleteCourse(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.courses.update(list => list.filter(c => c.id !== id));
      },
      error: (err) => {
        this.error.set('Failed to delete course');
        console.error(err);
      }
    });
  }

  /**
   * Start editing a course name
   */
  startEditCourse(course: CourseMetadataResponse) {
    this.editingCourseId.set(course.id);
    this.editingCourseName.set(course.name);
  }

  /**
   * Cancel editing
   */
  cancelEditCourse() {
    this.editingCourseId.set(null);
    this.editingCourseName.set('');
  }

  /**
   * Save edited course name
   */
  saveEditCourse(courseId: number) {
    const newName = this.editingCourseName().trim();
    
    if (!newName) {
      this.error.set('Course name cannot be empty');
      return;
    }

    // Find the original course to check if name actually changed
    const originalCourse = this.courses().find(c => c.id === courseId);
    if (originalCourse && originalCourse.name === newName) {
      // No change, just cancel editing
      this.cancelEditCourse();
      return;
    }

    const updateRequest: CourseUpdateRequest = { name: newName };

    this.courseService.updateCourse(courseId, updateRequest).subscribe({
      next: (updatedCourse) => {
        // Update the course in the list
        this.courses.update(list => 
          list.map(c => c.id === courseId ? { ...c, name: updatedCourse.name } : c)
        );
        this.cancelEditCourse();
      },
      error: (err) => {
        this.error.set('Failed to update course name');
        console.error(err);
      }
    });
  }

  /**
   * Handle Enter key press in edit input
   */
  onEditKeyPress(event: KeyboardEvent, courseId: number) {
    if (event.key === 'Enter') {
      this.saveEditCourse(courseId);
    } else if (event.key === 'Escape') {
      this.cancelEditCourse();
    }
  }

  /**
   * Check if a course is currently being edited
   */
  isEditingCourse(courseId: number): boolean {
    return this.editingCourseId() === courseId;
  }

  manageLessons(courseId: number) {
    this.router.navigate(['/dashboard/courses', courseId, 'lessons']);
  }

  clearError() {
    this.error.set(null);
  }
}