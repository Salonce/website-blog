import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarCourses } from '../../../../features/course/feature-course-learn/components/navbar-courses/navbar-courses';
import { TopNavbar } from '../../../components/top-navbar/top-navbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, TopNavbar, NavbarCourses],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
