import { Injectable } from '@angular/core';
import { LessonCreateRequest } from '../../dtos/lesson-create-request';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { LessonMetadataResponse } from '../../dtos/lesson-metadata-response';
import { Lesson } from '../../models/lesson';
import { LessonResponse } from '../../dtos/lesson-response';
import { map, retry } from 'rxjs';
import { LessonMapper } from '../../lesson-mapper';
import { LessonUpdateRequest } from '../../dtos/lesson-update-request';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http : HttpClient) {}

  private readonly apiUrl = environment.apiUrl;



  getLessonById(id: number): Observable<Lesson>{
    return this.http.get<LessonResponse>(`${this.apiUrl}/lessons/${id}`, {
      withCredentials: true
    }).pipe(
      map(dto => LessonMapper.fromDto(dto)),
      retry(1),
      catchError(err => {
        console.error('Failed to get lesson', err);
        return throwError(() => new Error('Could not get lesson'));
      })
    );
  }

  getLessonBySlugs(courseSlug: string, lessonSlug: string): Observable<Lesson>{
    return this.http.get<LessonResponse>(`${this.apiUrl}/courses/slug/${courseSlug}/lessons/slug/${lessonSlug}`, {
      withCredentials: true
    }).pipe(
      map(dto => LessonMapper.fromDto(dto)),
      retry(1),
      catchError(err => {
        console.error('Failed to get lesson', err);
        return throwError(() => new Error('Could not get lesson'));
      })
    );
  }

  postLesson(courseId: number, lesson: LessonCreateRequest) : Observable<LessonCreateRequest> {
    return this.http.post<LessonCreateRequest>(`${this.apiUrl}/courses/${courseId}/lessons`, lesson, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to post lesson', err);
        return throwError(() => new Error('Could not post a lesson'));
      })
    );
  }

  updateLesson(id: number, lessonUpdateRequest: LessonUpdateRequest) : Observable<LessonResponse> {
    return this.http.patch<LessonResponse>(`${this.apiUrl}/lessons/${id}`, lessonUpdateRequest, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to update lesson', err);
        return throwError(() => new Error('Could not update lesson'));
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
        console.error('Failed to get lessons', err);
        return throwError(() => new Error('Could not get lessons'));
      })
    );
  }

    getLessonsMetadataForCourseById(courseId: number): Observable<LessonMetadataResponse[]>{
    return this.http.get<LessonMetadataResponse[]>(`${this.apiUrl}/courses/${courseId}/lessons`, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to get lessons', err);
        return throwError(() => new Error('Could not get lessons'));
      })
    );
  }
  
}
