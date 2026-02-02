import { Injectable } from '@angular/core';
import { LessonCreateRequest } from '../../models/lesson-create-request';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { LessonMetadataResponse } from '../../models/lesson-metadata-response';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http : HttpClient) {}

  private readonly apiUrl = environment.apiUrl;


  postLesson(courseId: number, lesson: LessonCreateRequest) : Observable<LessonCreateRequest> {
    return this.http.post<LessonCreateRequest>(`${this.apiUrl}/courses/${courseId}/lessons`, lesson, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to post lesson', err);
        return throwError(() => new Error('Could not fetch lesson'));
      })
    );
  }

  removeLesson(lessonId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lessons/${lessonId}`, { withCredentials: true }).pipe(
      catchError(err => {
        console.error('Failed to delete lesson', err);
        return throwError(() => new Error('Could not delete lesson'));
      })
    );
  }

  getLessonsMetadataForCourseBySlug(courseSlug: string): Observable<LessonMetadataResponse[]>{
    return this.http.get<LessonMetadataResponse[]>(`${this.apiUrl}/courses/slug/${courseSlug}/lessons`, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to post lesson', err);
        return throwError(() => new Error('Could not fetch lesson'));
      })
    );
  }

    getLessonsMetadataForCourseById(courseId: number): Observable<LessonMetadataResponse[]>{
    return this.http.get<LessonMetadataResponse[]>(`${this.apiUrl}/courses/${courseId}/lessons`, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to post lesson', err);
        return throwError(() => new Error('Could not fetch lesson'));
      })
    );
  }
  
}
