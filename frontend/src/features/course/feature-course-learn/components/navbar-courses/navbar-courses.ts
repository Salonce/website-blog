import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../services/course-service/course-service';
import { CourseMetadata } from '../../../models/course-metadata';

@Component({
  selector: 'app-navbar-courses',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-courses.html',
  styleUrl: './navbar-courses.css'
})
export class NavbarCourses {
  isOpen = false;
  
  coursesMetadata$: Observable<CourseMetadata[]>;

  constructor(private courseService: CourseService){
    this.coursesMetadata$ = this.courseService.getCoursesMetadata();
  }
}
