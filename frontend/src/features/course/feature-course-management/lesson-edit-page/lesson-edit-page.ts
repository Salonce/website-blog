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
import { ContentBlockUpdateRequest } from '../../dtos/content-block-update-request';
import { ContentBlockMapper } from '../../content-block-mapper';
import { QuillEditor } from '../../../../shared/components/quill-editor/quill-editor';

@Component({
  selector: 'app-lesson-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, QuillEditor],
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

  // Edit block state
  editingBlockId = signal<number | null>(null);
  editingBlockContent = signal('');

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

  loadLesson(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.lessonService.getLessonById(this.lessonId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: lesson => {
          this.lesson.set(lesson);
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
   * Handle Quill content change for new block
   */
  onQuillContentChange(content: string): void {
    this.newBlockContent.set(content);
  }

  /**
   * Handle Quill content change for editing block
   */
  onEditQuillContentChange(content: string): void {
    this.editingBlockContent.set(content);
  }

  toggleAddBlockForm(): void {
    this.showAddBlockForm.update(v => !v);
    if (!this.showAddBlockForm()) {
      this.newBlockContent.set('');
    }
  }

  addTextBlock(): void {
    const content = this.newBlockContent().trim();
    
    // Check if content is empty or just contains empty Quill tags
    if (!content || content === '<p><br></p>' || content === '<p></p>') {
      this.error.set('Content cannot be empty');
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    const blockRequest = {
      type: 'TEXT',
      data: { content: content }
    };

    this.contentBlockService.addContentBlock(this.lessonId, blockRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          // Map response to ContentBlock
          const createdBlock = ContentBlockMapper.fromResponse(response);
          this.contentBlocks.update(blocks => [...blocks, createdBlock]);
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
   * Start editing a block
   */
  startEditBlock(block: ContentBlock): void {
    if (this.isTextBlock(block)) {
      this.editingBlockId.set(block.id);
      this.editingBlockContent.set(block.content);
    }
  }

  /**
   * Cancel editing
   */
  cancelEditBlock(): void {
    this.editingBlockId.set(null);
    this.editingBlockContent.set('');
  }

  /**
   * Save edited block
   */
  saveEditBlock(blockId: number): void {
    const content = this.editingBlockContent().trim();
    
    if (!content || content === '<p><br></p>' || content === '<p></p>') {
      this.error.set('Content cannot be empty');
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    // Create the update request
    const updateRequest: ContentBlockUpdateRequest = {
      type: 'TEXT',
      data: { content: content }
    };

    this.contentBlockService.updateContentBlock(blockId, updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Map response to ContentBlock
          const updatedBlock = ContentBlockMapper.fromResponse(response);
          
          // Update the block in the list
          this.contentBlocks.update(blocks => 
            blocks.map(b => b.id === blockId ? updatedBlock : b)
          );
          
          this.isSubmitting.set(false);
          this.editingBlockId.set(null);
          this.editingBlockContent.set('');
        },
        error: err => {
          console.error('Failed to update block:', err);
          this.error.set(err.message || 'Failed to update block');
          this.isSubmitting.set(false);
        }
      });
  }

  /**
   * Check if currently editing a specific block
   */
  isEditingBlock(blockId: number): boolean {
    return this.editingBlockId() === blockId;
  }

  removeBlock(blockId: number): void {
    if (!confirm('Are you sure you want to delete this block?')) {
      return;
    }

    const previousBlocks = this.contentBlocks();
    this.contentBlocks.update(blocks => blocks.filter(b => b.id !== blockId));

    this.contentBlockService.removeContentBlock(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Block deleted successfully');
        },
        error: err => {
          console.error('Failed to delete block:', err);
          this.error.set(err.message || 'Failed to delete block');
          this.contentBlocks.set(previousBlocks);
        }
      });
  }

  backToLessons(): void {
    this.router.navigate(['/dashboard/courses', this.courseId, 'lessons']);
  }

  clearError(): void {
    this.error.set(null);
  }

  getTextBlockContent(block: ContentBlock): string {
    if (this.isTextBlock(block)) {
      return block.content;
    }
    return '';
  }

  private isTextBlock(block: ContentBlock): block is TextBlock {
    return block.type === 'TEXT';
  }
}