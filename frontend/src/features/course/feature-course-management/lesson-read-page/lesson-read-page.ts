import { Component } from '@angular/core';
import { LessonService } from '../../services/lesson-service/lesson-service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Lesson } from '../../models/lesson';

@Component({
  selector: 'app-lesson-read-page',
  imports: [],
  templateUrl: './lesson-read-page.html',
  styleUrl: './lesson-read-page.css'
})
export class LessonReadPage {
  
  courseSlug!: string;
  lessonSlug!: string;
  lesson!: Lesson;

  constructor(private lessonService: LessonService, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseSlug = params['courseSlug'];
      this.lessonSlug = params['lessonSlug'];
      console.log('Current course slug:', this.courseSlug);
      console.log('Current lesson slug:', this.lessonSlug);
      this.loadArticle(this.courseSlug);
    });
  }

  loadArticle(slug: string) {
    this.lessonService.getLessonBySlugs(this.courseSlug, this.lessonSlug).subscribe({
      next: (lesson: Lesson) => {
        this.lesson = lesson;
      },
      error: (err) => {
        console.error('Failed to load lesson:', err);
      }
    });
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
