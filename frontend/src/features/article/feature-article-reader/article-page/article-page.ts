import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article-service';
import { Article } from '../../models/article';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-article-page',
  imports: [],
  templateUrl: './article-page.html',
  styleUrl: './article-page.css'
})


export class ArticlePage implements OnInit {

  slug!: string;
  article!: Article;

  constructor(private articleService: ArticleService, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      console.log('Current slug:', this.slug);
      this.loadArticle(this.slug);
    });
  }

  loadArticle(slug: string) {
    this.articleService.getArticleBySlug(slug).subscribe({
      next: (article: Article) => {
        this.article = article;
      },
      error: (err) => {
        console.error('Failed to load article:', err);
      }
    });
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}