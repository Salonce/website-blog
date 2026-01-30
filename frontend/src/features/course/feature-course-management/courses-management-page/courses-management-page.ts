import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CourseService } from '../../services/course-service/course-service';
import { CourseMetadata } from '../../models/course-metadata';
import { NewCourse } from '../../models/new-course';

@Component({
  selector: 'app-courses-management-page',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './courses-management-page.html',
  styleUrl: './courses-management-page.css'
})
export class CoursesManagementPage implements OnInit {

  courses = signal<CourseMetadata[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Add course form
  showAddForm = signal(false);
  newCourseName = signal('');
  isSubmitting = signal(false);

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
    const newCourse: NewCourse = { name };

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

  manageLessons(courseId: number) {
    this.router.navigate(['/dashboard/courses', courseId, 'lessons']);
  }

  clearError() {
    this.error.set(null);
  }
}
