import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LessonService } from '../../../services/lesson-service/lesson-service';
import { LessonMetadata } from '../../../models/lesson-metadata';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-lessons',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-lessons.html',
  styleUrl: './navbar-lessons.css'
})
export class NavbarLessons implements OnInit {
  // Reactive state
  courseSlug = signal<string | null>(null);
  lessons = signal<LessonMetadata[]>([]);

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) {}

  ngOnInit() {
  console.log('NavbarLessons initialized');
  
  this.route.paramMap.subscribe(params => {
    console.log('All route params:', params);
    console.log('Keys:', params.keys);
    
    const slug = params.get('courseSlug'); // Try 'courseSlug' (camelCase)
    console.log('Course slug:', slug);
    
    if (slug) {
      this.courseSlug.set(slug);

      this.lessonService.getLessonsMetadataForCourse(slug).subscribe(lessons => {
        console.log('Lessons received:', lessons);
        this.lessons.set(lessons);
      });
    } else {
      console.warn('No course slug found in route params');
    }
  });
}
}