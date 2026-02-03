import { Injectable } from '@angular/core';
import { environment } from '../../../../app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CourseMetadataResponse } from '../../dtos/course-metadata-response';
import { CourseCreateRequest } from '../../dtos/course-create-request';
import { CourseResponse } from '../../dtos/course-response';

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
        console.error('Failed to fetch courses', err);
        return throwError(() => new Error('Could not fetch courses'));
      })
    );
  }

  getCourseById(id: number): Observable<CourseResponse>{
    return this.http.get<CourseResponse>(`${this.apiUrl}/courses/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(err => {
        console.error('Failed to fetch courses', err);
        return throwError(() => new Error('Could not fetch courses'));
      })
    );
  }



  postCourse(course: CourseCreateRequest) : Observable<CourseCreateRequest> {
    return this.http.post<CourseCreateRequest>(`${this.apiUrl}/courses`, course, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to post course', err);
        return throwError(() => new Error('Could not fetch course'));
      })
    );
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
