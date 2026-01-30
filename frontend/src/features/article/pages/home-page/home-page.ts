import { Component } from '@angular/core';
import { ArticleService } from '../../services/article-service';
import { Observable } from 'rxjs/internal/Observable';
import { Page } from '../../../../shared/ui/pagination/models/page';
import { Article } from '../../models/article';
import { AsyncPipe } from '@angular/common';
import { ArticleList } from '../../components/article-list/article-list';
import { Pagination } from '../../../../shared/ui/pagination/pagination';
@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, ArticleList, Pagination],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  
  $articlesPage: Observable<Page<Article>>;

  constructor(private articleService : ArticleService){
    this.$articlesPage = articleService.getArticles();
  }

  loadPage(pageNumber: number) {
    this.$articlesPage = this.articleService.getArticles(pageNumber);
  }
}
