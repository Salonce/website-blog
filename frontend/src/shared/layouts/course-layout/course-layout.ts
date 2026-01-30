import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarCourses } from '../../../features/course/components/navbar-courses/navbar-courses';
import { NavbarLessons } from '../../../features/lesson/components/navbar-lessons/navbar-lessons';
import { TopNavbar } from '../../components/top-navbar/top-navbar';

@Component({
  selector: 'app-course-layout',
  imports: [RouterOutlet, TopNavbar, NavbarCourses, NavbarLessons],
  templateUrl: './course-layout.html',
  styleUrl: './course-layout.css'
})
export class CourseLayout {

}
