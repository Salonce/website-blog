import { Component } from '@angular/core';
import { AuthService } from '../../../../core/auth-service/auth-service';
import { Observable } from 'rxjs/internal/Observable';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Principal } from '../../../../core/models/principal';
import { CourseService } from '../../services/service-course/course-service';
import { CourseMetadata } from '../../models/course-metadata';

@Component({
  selector: 'app-navbar-courses',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-courses.html',
  styleUrl: './navbar-courses.css'
})
export class NavbarCourses {
  isOpen = false;
  
  principal$: Observable<Principal | null>;
  coursesMetadata$: Observable<CourseMetadata[]>;

  constructor(private authService: AuthService, private courseService: CourseService){
    this.principal$ = this.authService.principal$;
    this.coursesMetadata$ = this.courseService.getCourses();
  }

  onLogout() : void {
    this.authService.logout();
  }
}
