import { Component, OnInit } from '@angular/core';
import { LessonService } from '../../services/lesson-service/lesson-service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Lesson } from '../../models/lesson';
import { ContentBlock, TextBlock } from '../../models/content-block';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

@Component({
  selector: 'app-lesson-read-page',
  imports: [CommonModule],
  templateUrl: './lesson-read-page.html',
  styleUrl: './lesson-read-page.css'
})
export class LessonReadPage implements OnInit {
  
  courseSlug!: string;
  lessonSlug!: string;
  lesson!: Lesson;

  constructor(
    private lessonService: LessonService, 
    private route: ActivatedRoute, 
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.route.parent!.params,
      this.route.params
    ]).subscribe(([parentParams, currentParams]) => {
      this.courseSlug = parentParams['courseSlug'];
      this.lessonSlug = currentParams['lessonSlug'];

      console.log('Current course slug:', this.courseSlug);
      console.log('Current lesson slug:', this.lessonSlug);
      
      this.loadArticle();
    });
  }

  loadArticle() {
    this.lessonService.getLessonBySlugs(this.courseSlug, this.lessonSlug).subscribe({
      next: (lesson: Lesson) => {
        this.lesson = lesson;
      },
      error: (err) => {
        console.error('Failed to load lesson:', err);
      }
    });
  }

  isTextBlock(block: ContentBlock): block is TextBlock {
    return block.type === 'TEXT';
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}