import { Injectable } from '@angular/core';
import { NewLesson } from '../../models/new-lesson';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { LessonMetadata } from '../../models/lesson-metadata';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http : HttpClient) {}

  private readonly apiUrl = environment.apiUrl;


  postLesson(courseId: number, lesson: NewLesson) : Observable<NewLesson> {
    return this.http.post<NewLesson>(`${this.apiUrl}/courses/${courseId}/lessons`, lesson, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to post lesson', err);
        return throwError(() => new Error('Could not fetch lesson'));
      })
    );
  }

  removeLesson(courseId: number, lessonId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}/lessons/${lessonId}`, { withCredentials: true }).pipe(
      catchError(err => {
        console.error('Failed to delete lesson', err);
        return throwError(() => new Error('Could not delete lesson'));
      })
    );
  }

  getLessonsMetadataForCourse(courseSlug: string): Observable<LessonMetadata[]>{
    return this.http.get<LessonMetadata[]>(`${this.apiUrl}/courses/slug/${courseSlug}/lessons`, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to post lesson', err);
        return throwError(() => new Error('Could not fetch lesson'));
      })
    );
  }
}
