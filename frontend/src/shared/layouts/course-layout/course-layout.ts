import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarCourses } from '../../../features/course/components/navbar-courses/navbar-courses';
import { NavbarLessons } from '../../components/navbar-lessons/navbar-lessons';

@Component({
  selector: 'app-course-layout',
  imports: [RouterOutlet, Navbar, NavbarCourses, NavbarLessons],
  templateUrl: './course-layout.html',
  styleUrl: './course-layout.css'
})
export class CourseLayout {

}
