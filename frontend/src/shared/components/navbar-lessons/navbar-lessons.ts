import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LessonMetadata } from '../../../features/course/models/lesson-metadata';
import { of } from 'rxjs/internal/observable/of';
import { LessonService } from '../../../features/lesson/services/lesson-service';

@Component({
  selector: 'app-navbar-lessons',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-lessons.html',
  styleUrl: './navbar-lessons.css'
})
export class NavbarLessons implements OnInit {
  @Input() courseSlug!: string; // Receive the selected course slug

  lessons$: Observable<LessonMetadata[]> = of([]);

  constructor(private lessonService: LessonService) {}

  ngOnInit(): void {
    if (this.courseSlug) {
      this.lessons$ = this.lessonService.getLessonsMetadataForCourse(this.courseSlug);
    }
  }
}
