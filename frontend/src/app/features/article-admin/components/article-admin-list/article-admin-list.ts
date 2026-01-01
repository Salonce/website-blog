import { Component, Input } from '@angular/core';
import { Article } from '../../../../core/models/article';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../../../core/article-service/article-service';
@Component({
  selector: 'app-article-admin-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './article-admin-list.html',
  styleUrl: './article-admin-list.css'
})
export class ArticleAdminList {
  constructor(private sanitizer: DomSanitizer, private articleService: ArticleService){}

  @Input() articles : Article[] = [];

  getPreview(content: string, sentences: number = 3): string {
    // naive example: split by sentences
    const match = content.match(/.*?[.!?](\s|$)/g);
    if (!match) return content;
    const preview = match.slice(0, sentences).join(' ');
    return preview; // keep HTML tags intact
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  deleteArticle(id: number) {
    this.articleService.deleteArticle(id).subscribe({
      next: () => {
        console.log('Article deleted successfully');
        this.articles = this.articles.filter(a => a.id !== id);
      },
      error: err => console.error('Failed to delete article:', err)
    });
  }
}
