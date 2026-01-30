import { Injectable } from '@angular/core';
import { environment } from '../../../../app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CourseMetadata } from '../../models/course-metadata';
import { NewCourse } from '../../models/new-course';
import { Course } from '../../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http : HttpClient) {}

  private readonly apiUrl = environment.apiUrl;

  getCoursesMetadata(): Observable<CourseMetadata[]>{
    return this.http.get<CourseMetadata[]>(`${this.apiUrl}/courses`, {
      withCredentials: true
    }).pipe(
      catchError(err => {
        console.error('Failed to fetch courses', err);
        return throwError(() => new Error('Could not fetch courses'));
      })
    );
  }

  getCourseById(id: number): Observable<Course>{
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(err => {
        console.error('Failed to fetch courses', err);
        return throwError(() => new Error('Could not fetch courses'));
      })
    );
  }



  postCourse(course: NewCourse) : Observable<NewCourse> {
    return this.http.post<NewCourse>(`${this.apiUrl}/courses`, course, {withCredentials : true}).pipe(
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
