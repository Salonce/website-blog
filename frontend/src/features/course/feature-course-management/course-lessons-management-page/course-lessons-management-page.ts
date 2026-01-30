import { Component, signal } from '@angular/core';
import { LessonMetadata } from '../../models/lesson-metadata';
import { Course } from '../../models/course';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../services/course-service/course-service';
import { LessonService } from '../../services/lesson-service/lesson-service';
import { NewLesson } from '../../models/new-lesson';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-lessons-management-page',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-lessons-management-page.html',
  styleUrl: './course-lessons-management-page.css'
})
export class CourseLessonsManagementPage {
courseId!: number;
  course = signal<Course | null>(null);
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
      title
    };

    this.lessonService.postLesson(this.courseId, newLesson).subscribe({
      next: () => {
        this.loadCourse();
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

    this.lessonService.removeLesson(this.courseId, lessonId).subscribe({
      next: () => {
        this.lessons.update(list => list.filter(l => l.id !== lessonId));
      },
      error: (err) => {
        this.error.set('Failed to delete lesson');
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
