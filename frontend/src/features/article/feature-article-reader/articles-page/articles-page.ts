import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ArticleService } from '../../services/article-service';
import { Article } from '../../models/article';
import { Page } from '../../../../shared/ui/pagination/models/page';
import { AsyncPipe } from '@angular/common';
import { ArticleList } from './article-list/article-list';
import { Pagination } from '../../../../shared/ui/pagination/pagination';

@Component({
  selector: 'app-articles-page',
  imports: [AsyncPipe, ArticleList, Pagination],
  templateUrl: './articles-page.html',
  styleUrl: './articles-page.css'
})
export class ArticlesPage {
  $articlesPage: Observable<Page<Article>>;

  constructor(private articleService : ArticleService){
    this.$articlesPage = articleService.getArticles();
  }

  loadPage(pageNumber: number) {
    this.$articlesPage = this.articleService.getArticles(pageNumber);
  }
}
