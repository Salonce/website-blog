// courses-management-page.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CourseService } from '../../services/course-service/course-service';
import { CourseMetadataResponse } from '../../dtos/course-metadata-response';
import { CourseCreateRequest } from '../../dtos/course-create-request';
import { CourseUpdateRequest } from '../../dtos/course-update-request';

@Component({
  selector: 'app-courses-management-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DragDropModule],
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
  editingField = signal<'name' | 'slug' | null>(null);

  // Reordering
  hasUnsavedOrder = signal(false);
  isSavingOrder = signal(false);

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
        this.hasUnsavedOrder.set(false); // Reset after loading
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
        this.loadCourses(); // Reload to update positions
      },
      error: (err) => {
        this.error.set('Failed to delete course');
        console.error(err);
      }
    });
  }

  /**
   * Handle drag and drop reordering
   */
  onDropCourse(event: CdkDragDrop<CourseMetadataResponse[]>) {
    if (event.previousIndex === event.currentIndex) {
      return; // No change
    }

    // Update local array
    const coursesList = [...this.courses()];
    moveItemInArray(coursesList, event.previousIndex, event.currentIndex);
    
    // Update position numbers visually
    coursesList.forEach((course, index) => {
      course.position = index + 1;
    });

    this.courses.set(coursesList);
    this.hasUnsavedOrder.set(true); // Mark as having unsaved changes
  }

  /**
   * Save the new order to backend
   */
  saveOrder() {
    if (!this.hasUnsavedOrder()) {
      return;
    }

    this.isSavingOrder.set(true);
    const orderedIds = this.courses().map(c => c.id);

    this.courseService.reorderCourses(orderedIds).subscribe({
      next: () => {
        this.hasUnsavedOrder.set(false);
        this.isSavingOrder.set(false);
        this.error.set(null);
        // Show success message briefly
        this.showSuccessMessage();
      },
      error: (err) => {
        this.error.set('Failed to save new order');
        this.isSavingOrder.set(false);
        console.error('Error saving order:', err);
        // Reload to restore correct order from server
        this.loadCourses();
      }
    });
  }

  /**
   * Cancel reordering and reload original order
   */
  cancelReorder() {
    if (!confirm('Discard changes to course order?')) {
      return;
    }
    this.loadCourses();
  }

  /**
   * Show temporary success message
   */
  private showSuccessMessage() {
    // You could implement a toast/notification here
    console.log('Order saved successfully');
  }

  /**
   * Start editing a course field (name or slug)
   */
  startEditCourse(course: CourseMetadataResponse, field: 'name' | 'slug') {
    this.editingCourseId.set(course.id);
    this.editingField.set(field);
    this.editingCourseName.set(field === 'name' ? course.name : course.slug);
  }

  /**
   * Cancel editing
   */
  cancelEditCourse() {
    this.editingCourseId.set(null);
    this.editingField.set(null);
    this.editingCourseName.set('');
  }

  /**
   * Save edited course field
   */
  saveEditCourse(courseId: number) {
    const newValue = this.editingCourseName().trim();
    const field = this.editingField();
    
    if (!newValue) {
      this.error.set(`Course ${field} cannot be empty`);
      return;
    }

    // Find the original course
    const originalCourse = this.courses().find(c => c.id === courseId);
    if (!originalCourse) return;

    // Check if value actually changed
    const originalValue = field === 'name' ? originalCourse.name : originalCourse.slug;
    if (originalValue === newValue) {
      this.cancelEditCourse();
      return;
    }

    // Warning for slug changes (since they affect URLs)
    if (field === 'slug') {
      const confirmMsg = `⚠️ WARNING: Changing the slug will change the course URL!\n\nOld: /courses/${originalCourse.slug}\nNew: /courses/${newValue}\n\nThis will break existing links. Continue?`;
      if (!confirm(confirmMsg)) {
        this.cancelEditCourse();
        return;
      }
    }

    // Build update request based on which field is being edited
    const updateRequest: CourseUpdateRequest = field === 'name' 
      ? { name: newValue }
      : { slug: newValue };

    this.courseService.updateCourse(courseId, updateRequest).subscribe({
      next: (updatedCourse) => {
        // Update the course in the list
        this.courses.update(list => 
          list.map(c => c.id === courseId 
            ? { ...c, name: updatedCourse.name, slug: updatedCourse.slug }
            : c
          )
        );
        this.cancelEditCourse();
      },
      error: (err) => {
        this.error.set(`Failed to update course ${field}`);
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
   * Check if a specific field of a course is being edited
   */
  isEditingCourseField(courseId: number, field: 'name' | 'slug'): boolean {
    return this.editingCourseId() === courseId && this.editingField() === field;
  }

  manageLessons(courseId: number) {
    this.router.navigate(['/dashboard/courses', courseId, 'lessons']);
  }

  clearError() {
    this.error.set(null);
  }
}