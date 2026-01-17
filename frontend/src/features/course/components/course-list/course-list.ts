import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CourseMetadata } from '../../models/course-metadata';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList {
  @Input() courses: CourseMetadata[] = [];
  @Input() isLoading = false;
  
  @Output() manageLessons = new EventEmitter<number>();
  @Output() deleteCourse = new EventEmitter<{ id: number; name: string }>();
}
