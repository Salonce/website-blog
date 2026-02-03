import { Component, signal } from '@angular/core';
import { LessonMetadataResponse } from '../../dtos/lesson-metadata-response';
import { CourseResponse } from '../../dtos/course-response';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../services/course-service/course-service';
import { LessonService } from '../../services/lesson-service/lesson-service';
import { LessonCreateRequest } from '../../dtos/lesson-create-request';
import { LessonUpdateRequest } from '../../dtos/lesson-update-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-lessons-management-page',
  standalone: true,
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

  // Inline editing
  editingLessonId = signal<number | null>(null);
  editingLessonValue = signal('');
  editingField = signal<'title' | 'slug' | null>(null);

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

  /**
   * Start editing a lesson field (title or slug)
   */
  startEditLesson(lesson: LessonMetadataResponse, field: 'title' | 'slug') {
    this.editingLessonId.set(lesson.id);
    this.editingField.set(field);
    this.editingLessonValue.set(field === 'title' ? lesson.title : lesson.slug);
  }

  /**
   * Cancel editing
   */
  cancelEditLesson() {
    this.editingLessonId.set(null);
    this.editingField.set(null);
    this.editingLessonValue.set('');
  }

  /**
   * Save edited lesson field
   */
  saveEditLesson(lessonId: number) {
    const newValue = this.editingLessonValue().trim();
    const field = this.editingField();
    
    if (!newValue) {
      this.error.set(`Lesson ${field} cannot be empty`);
      return;
    }

    // Find the original lesson
    const originalLesson = this.lessons().find(l => l.id === lessonId);
    if (!originalLesson) return;

    // Check if value actually changed
    const originalValue = field === 'title' ? originalLesson.title : originalLesson.slug;
    if (originalValue === newValue) {
      this.cancelEditLesson();
      return;
    }

    // Warning for slug changes
    if (field === 'slug') {
      const courseSlug = this.course()?.slug || 'course';
      const confirmMsg = `⚠️ WARNING: Changing the slug will change the lesson URL!\n\nOld: /courses/${courseSlug}/${originalLesson.slug}\nNew: /courses/${courseSlug}/${newValue}\n\nThis will break existing links. Continue?`;
      if (!confirm(confirmMsg)) {
        this.cancelEditLesson();
        return;
      }
    }

    // Build update request
    const updateRequest: LessonUpdateRequest = field === 'title' 
      ? { title: newValue }
      : { slug: newValue };

    this.lessonService.updateLesson(lessonId, updateRequest).subscribe({
      next: (updatedLesson) => {
        // Update the lesson in the list
        this.lessons.update(list => 
          list.map(l => l.id === lessonId 
            ? { ...l, title: updatedLesson.title, slug: updatedLesson.slug }
            : l
          )
        );
        this.cancelEditLesson();
      },
      error: (err) => {
        this.error.set(`Failed to update lesson ${field}`);
        console.error(err);
      }
    });
  }

  /**
   * Handle Enter/Escape key press in edit input
   */
  onEditKeyPress(event: KeyboardEvent, lessonId: number) {
    if (event.key === 'Enter') {
      this.saveEditLesson(lessonId);
    } else if (event.key === 'Escape') {
      this.cancelEditLesson();
    }
  }

  /**
   * Check if a specific field of a lesson is being edited
   */
  isEditingLessonField(lessonId: number, field: 'title' | 'slug'): boolean {
    return this.editingLessonId() === lessonId && this.editingField() === field;
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