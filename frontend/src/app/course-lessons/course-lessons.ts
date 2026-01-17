import { Component, signal } from '@angular/core';
import { CourseMetadata } from '../../features/course/models/course-metadata';
import { LessonMetadata } from '../../features/course/models/lesson-metadata';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../features/course/services/course-service/course-service';
import { LessonService } from '../../features/lesson/services/lesson-service';
import { NewLesson } from '../../features/course/models/new-lesson';

@Component({
  selector: 'app-course-lessons',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-lessons.html',
  styleUrl: './course-lessons.css'
})
export class CourseLessons {
  courseId!: number;
  course = signal<CourseMetadata | null>(null);
  lessons = signal<LessonMetadata[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Add lesson form
  showAddForm = signal(false);
  newLessonTitle = signal('');
  newLessonContent = signal('');
  isSubmitting = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private lessonService: LessonService
  ) {}

  ngOnInit() {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCourse();
  }

  loadCourse() {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => this.course.set(course),
      error: (err) => {
        this.error.set('Failed to load course');
        console.error(err);
      }
    });
  }

  toggleAddForm() {
    this.showAddForm.update(v => !v);
    if (!this.showAddForm()) {
      this.newLessonTitle.set('');
      this.newLessonContent.set('');
    }
  }

  addLesson() {
    const title = this.newLessonTitle().trim();
    const content = this.newLessonContent().trim();
    
    if (!title) return;

    this.isSubmitting.set(true);
    const newLesson: NewLesson = { 
      courseId: this.courseId,
      name: string
    };

    this.lessonService.createLesson(newLesson).subscribe({
      next: () => {
        this.loadLessons();
        this.newLessonTitle.set('');
        this.newLessonContent.set('');
        this.showAddForm.set(false);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.error.set('Failed to add lesson');
        this.isSubmitting.set(false);
        console.error(err);
      }
    });
  }

  editLesson(lessonId: number) {
    // Navigate to lesson editor or open modal
    this.router.navigate(['/dashboard/courses', this.courseId, 'lessons', lessonId, 'edit']);
  }

  deleteLesson(lessonId: number, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    this.lessonService.deleteLesson(lessonId).subscribe({
      next: () => {
        this.lessons.update(list => list.filter(l => l.id !== lessonId));
      },
      error: (err) => {
        this.error.set('Failed to delete lesson');
        console.error(err);
      }
    });
  }

  moveUp(lessonId: number) {
    this.lessonService.reorderLesson(lessonId, 'up').subscribe({
      next: () => this.loadLessons(),
      error: (err) => {
        this.error.set('Failed to reorder lesson');
        console.error(err);
      }
    });
  }

  moveDown(lessonId: number) {
    this.lessonService.reorderLesson(lessonId, 'down').subscribe({
      next: () => this.loadLessons(),
      error: (err) => {
        this.error.set('Failed to reorder lesson');
        console.error(err);
      }
    });
  }

  backToCourses() {
    this.router.navigate(['/dashboard/courses-management']);
  }

  clearError() {
    this.error.set(null);
  }
}
