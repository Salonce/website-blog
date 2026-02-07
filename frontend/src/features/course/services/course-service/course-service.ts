import { Injectable } from '@angular/core';
import { environment } from '../../../../app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CourseMetadataResponse } from '../../dtos/course-metadata-response';
import { CourseCreateRequest } from '../../dtos/course-create-request';
import { CourseResponse } from '../../dtos/course-response';
import { CourseUpdateRequest } from '../../dtos/course-update-request';
import { ReorderRequest } from '../../dtos/reorder-request';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http : HttpClient) {}

  private readonly apiUrl = environment.apiUrl;

  getCoursesMetadata(): Observable<CourseMetadataResponse[]>{
    return this.http.get<CourseMetadataResponse[]>(`${this.apiUrl}/courses`, {
      withCredentials: true
    }).pipe(
      catchError(err => {
        console.error('Failed to get courses', err);
        return throwError(() => new Error('Could not get courses'));
      })
    );
  }

  getCourseById(id: number): Observable<CourseResponse>{
    return this.http.get<CourseResponse>(`${this.apiUrl}/courses/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(err => {
        console.error('Failed to get course', err);
        return throwError(() => new Error('Could not get courses'));
      })
    );
  }

  updateCourse(id: number, CourseUpdateRequest: CourseUpdateRequest) : Observable<CourseResponse> {
    return this.http.patch<CourseResponse>(`${this.apiUrl}/courses/${id}`, CourseUpdateRequest, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to update course', err);
        return throwError(() => new Error('Could not update course'));
      })
    );
  }

  postCourse(CourseCreateRequest: CourseCreateRequest) : Observable<CourseResponse> {
    return this.http.post<CourseResponse>(`${this.apiUrl}/courses`, CourseCreateRequest, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to post course', err);
        return throwError(() => new Error('Could not post course'));
      })
    );
  }

  reorderCourses(ids: number[]): Observable<void> {
    const request: ReorderRequest = { ids };
    return this.http.put<void>(`${this.apiUrl}/courses/positions`, request);
  }

  

  // getCourseBySlug(slug : string) : Observable<Course> {
  // }

  // patchCourse(id: number, article: NewCourse) : Observable<NewCourse> {
  //   return this.http.patch<NewArticle>(this.apiUrl + `/articles/${id}`, article, {withCredentials : true}).pipe(
  //     catchError(err => {
  //       console.error('Failed to post article', err);
  //       return throwError(() => new Error('Could not fetch article'));
  //     })
  //   );
  // }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${id}`, { withCredentials: true }).pipe(
      catchError(err => {
        console.error('Failed to delete course', err);
        return throwError(() => new Error('Could not delete article'));
      })
    );
  }
  
}
