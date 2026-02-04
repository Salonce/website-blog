import { Injectable } from '@angular/core';
import { environment } from '../../../../app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ContentBlockResponse } from '../../dtos/content-block-response';
import { ContentBlockCreateRequest } from '../../dtos/content-block-create-request';
import { ContentBlockUpdateRequest } from '../../dtos/content-block-update-request';

@Injectable({
  providedIn: 'root'
})
export class ContentBlockService {
  
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addContentBlock(lessonId: number, contentBlock: ContentBlockCreateRequest): Observable<ContentBlockCreateRequest> {
    return this.http.post<ContentBlockCreateRequest>(`${this.apiUrl}/lessons/${lessonId}/contentblocks`, contentBlock, { withCredentials: true })
    .pipe(
      catchError(err => {
        console.error('Failed to create content block', err);
        return throwError(() => new Error('Could not create content block'));
      })
    );
  }

  updateContentBlock(blockId: number, contentBlock: ContentBlockUpdateRequest): Observable<ContentBlockResponse> {
    return this.http.patch<ContentBlockResponse>(`${this.apiUrl}/contentblocks/${blockId}`, contentBlock, { withCredentials: true }
    ).pipe(
      catchError(err => {
        console.error('Failed to update content block', err);
        return throwError(() => new Error('Could not update content block'));
      })
    );
  }

  removeContentBlock(blockId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contentblocks/${blockId}`, { withCredentials: true })
    .pipe(
      catchError(err => {
        console.error('Failed to delete content block', err);
        return throwError(() => new Error('Could not delete content block'));
      })
    );
  }

  // getContentBlocksMetadataForLesson(lessonId: number): Observable<ContentBlockResponse[]> {
  //   return this.http.get<ContentBlockResponse[]>(`${this.apiUrl}/lessons/${lessonId}/contentblocks`, { withCredentials: true })
  //   .pipe(
  //     catchError(err => {
  //       console.error('Failed to fetch content blocks', err);
  //       return throwError(() => new Error('Could not fetch content blocks'));
  //     })
  //   );
  // }

  getContentBlockById(contentBlockId: number): Observable<ContentBlockResponse> {
    return this.http.get<ContentBlockResponse>(
      `${this.apiUrl}/content-blocks/${contentBlockId}`,
      { withCredentials: true }
    ).pipe(
      catchError(err => {
        console.error('Failed to fetch content block', err);
        return throwError(() => new Error('Could not fetch content block'));
      })
    );
  }
}
