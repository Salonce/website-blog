// lesson-edit-page.component.ts

import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { LessonService } from '../../services/lesson-service/lesson-service';
import { Lesson } from '../../models/lesson';
import { ContentBlock, TextBlock } from '../../models/content-block';
import { ContentBlockService } from '../../services/content-block-service/content-block-service';

@Component({
  selector: 'app-lesson-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lesson-edit-page.html',
  styleUrl: './lesson-edit-page.css'
})
export class LessonEditPage implements OnInit, OnDestroy {
  // Route params
  courseId!: number;
  lessonId!: number;

  // Core data
  lesson = signal<Lesson | null>(null);
  contentBlocks = signal<ContentBlock[]>([]);

  // UI state
  isLoading = signal(false);
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  // Add block form
  showAddBlockForm = signal(false);
  newBlockContent = signal('');

  // Computed
  hasBlocks = computed(() => this.contentBlocks().length > 0);
  nextPosition = computed(() => this.contentBlocks().length + 1);

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: LessonService,
    private contentBlockService: ContentBlockService
  ) {}

  ngOnInit(): void {
    // Get route params
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    const lessonIdParam = this.route.snapshot.paramMap.get('lessonId');

    if (!courseIdParam || !lessonIdParam) {
      this.error.set('Invalid lesson or course ID');
      return;
    }

    this.courseId = +courseIdParam;
    this.lessonId = +lessonIdParam;

    this.loadLesson();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load lesson data from API
   */
  loadLesson(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.lessonService.getLessonById(this.lessonId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: lesson => {
          this.lesson.set(lesson);
          // Sort blocks by position
          const sortedBlocks = [...lesson.contentBlocks].sort((a, b) => a.position - b.position);
          this.contentBlocks.set(sortedBlocks);
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Failed to load lesson:', err);
          this.error.set(err.message || 'Failed to load lesson');
          this.isLoading.set(false);
        }
      });
  }

  /**
   * Handle textarea input
   */
  onContentInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.newBlockContent.set(target.value);
  }

  /**
   * Toggle add block form visibility
   */
  toggleAddBlockForm(): void {
    this.showAddBlockForm.update(v => !v);
    if (!this.showAddBlockForm()) {
      this.newBlockContent.set('');
    }
  }

  /**
   * Add a new text block
   */
  addTextBlock(): void {
    const content = this.newBlockContent().trim();
    
    if (!content) {
      this.error.set('Content cannot be empty');
      return;
    }

    if (this.isSubmitting()) {
      return; // Prevent double submission
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    // Create the block request
    const blockRequest = {
      type: 'TEXT',
      data: { content: content }
    };

    this.contentBlockService.addContentBlock(this.lessonId, blockRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: createdBlock => {
          // Add the new block to the list
          // Note: You may need to convert the response to ContentBlock if needed
          this.contentBlocks.update(blocks => [...blocks, createdBlock as any]);
          
          // Reset form state
          this.isSubmitting.set(false);
          this.showAddBlockForm.set(false);
          this.newBlockContent.set('');
        },
        error: err => {
          console.error('Failed to add block:', err);
          this.error.set(err.message || 'Failed to add block');
          this.isSubmitting.set(false);
        }
      });
  }

  /**
   * Remove a content block
   */
  removeBlock(blockId: number): void {
    if (!confirm('Are you sure you want to delete this block?')) {
      return;
    }

    // Store previous state for rollback
    const previousBlocks = this.contentBlocks();
    
    // Optimistic update
    this.contentBlocks.update(blocks => blocks.filter(b => b.id !== blockId));

    this.contentBlockService.removeContentBlock(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Success - block already removed optimistically
          console.log('Block deleted successfully');
        },
        error: err => {
          console.error('Failed to delete block:', err);
          this.error.set(err.message || 'Failed to delete block');
          // Rollback optimistic update
          this.contentBlocks.set(previousBlocks);
        }
      });
  }

  /**
   * Navigate back to lessons list
   */
  backToLessons(): void {
    this.router.navigate(['/dashboard/courses', this.courseId, 'lessons']);
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error.set(null);
  }

  /**
   * Type guard helper for template
   */
  getTextBlockContent(block: ContentBlock): string {
    if (this.isTextBlock(block)) {
      return block.content;
    }
    return '';
  }

  /**
   * Type guard: check if block is TextBlock
   */
  private isTextBlock(block: ContentBlock): block is TextBlock {
    return block.type === 'TEXT';
  }
}