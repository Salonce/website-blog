import { Component, signal } from '@angular/core';
import { LessonMetadataResponse } from '../../dtos/lesson-metadata-response';
import { CourseResponse } from '../../dtos/course-response';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../services/course-service/course-service';
import { LessonService } from '../../services/lesson-service/lesson-service';
import { LessonCreateRequest } from '../../dtos/lesson-create-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-lessons-management-page',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-lessons-management-page.html',
  styleUrls: ['./course-lessons-management-page.css']
})
export class CourseLessonsManagementPage {
  courseId!: number;
  course = signal<CourseResponse | null>(null);
  lessons = signal<LessonMetadataResponse[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Add lesson form
  showAddForm = signal(false);
  newLessonTitle = signal('');
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
    this.loadLessons();
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

  loadLessons() {
    this.isLoading.set(true);
    this.lessonService.getLessonsMetadataForCourseById(this.courseId).subscribe({
      next: (lessons: LessonMetadataResponse[]) => {
        this.lessons.set(lessons);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.error.set('Failed to load lessons');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  toggleAddForm() {
    this.showAddForm.update(v => !v);
    if (!this.showAddForm()) {
      this.newLessonTitle.set('');
    }
  }

  addLesson() {
    const title = this.newLessonTitle().trim();
    if (!title) return;

    this.isSubmitting.set(true);
    const newLesson: LessonCreateRequest = { title };

    this.lessonService.postLesson(this.courseId, newLesson).subscribe({
      next: () => {
        this.loadLessons();
        this.newLessonTitle.set('');
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
    this.router.navigate(['/dashboard/courses', this.courseId, 'lessons', lessonId]);
  }

  deleteLesson(lessonId: number, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    this.lessonService.removeLesson(lessonId).subscribe({
      next: () => this.lessons.update(list => list.filter(l => l.id !== lessonId)),
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
