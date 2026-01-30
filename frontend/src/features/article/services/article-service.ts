import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NewArticle } from '../models/new-article';
import { Page } from '../../../shared/ui/pagination/models/page';
import { Article } from '../models/article';
import { environment } from '../../../app/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ArticleService {

  constructor(private http : HttpClient) {}

      private readonly apiUrl = environment.apiUrl;

  getArticles(page: number = 0, size: number = 10): Observable<Page<Article>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,DESC');

    return this.http.get<Page<Article>>(this.apiUrl + '/articles', { 
        params, 
        withCredentials: true 
      }).pipe(
        catchError(err => {
          console.error('Failed to fetch articles', err);
          return throwError(() => new Error('Could not fetch articles'));
        })
      );
  }

  getArticleBySlug(slug : string) : Observable<Article> {
    return this.http.get<Article>(this.apiUrl + `/articles/slug/${slug}`, {withCredentials: true}).pipe(
      catchError(err => {
        console.error('Failed to fetch article', err);
        return throwError(() => new Error('Could not fetch article'));
      })
    );
  }

  getArticleById(id : number) : Observable<NewArticle> {
    return this.http.get<NewArticle>(this.apiUrl + `/articles/${id}`, {withCredentials: true}).pipe(
      catchError(err => {
        console.error('Failed to fetch article', err);
        return throwError(() => new Error('Could not fetch article'));
      })
    );
  }

  postArticle(article: NewArticle) : Observable<NewArticle> {
    return this.http.post<NewArticle>(this.apiUrl + `/articles`, article, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to post article', err);
        return throwError(() => new Error('Could not fetch article'));
      })
    );
  }

  patchArticle(id: number, article: NewArticle) : Observable<NewArticle> {
    return this.http.patch<NewArticle>(this.apiUrl + `/articles/${id}`, article, {withCredentials : true}).pipe(
      catchError(err => {
        console.error('Failed to post article', err);
        return throwError(() => new Error('Could not fetch article'));
      })
    );
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/articles/${id}`, { withCredentials: true }).pipe(
      catchError(err => {
        console.error('Failed to delete article', err);
        return throwError(() => new Error('Could not delete article'));
      })
    );
  }
}
