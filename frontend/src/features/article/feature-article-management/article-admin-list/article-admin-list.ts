import { Component, Input, signal } from '@angular/core';
import { Article } from '../../models/article';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article-service';
@Component({
  selector: 'app-article-admin-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './article-admin-list.html',
  styleUrl: './article-admin-list.css'
})
export class ArticleAdminList {
  constructor(
    private sanitizer: DomSanitizer, 
    private articleService: ArticleService
  ) {}

  @Input() articles: Article[] = [];
  
  articleToDelete = signal<number | null>(null);

  getPreview(content: string, sentences: number = 3): string {
    const match = content.match(/.*?[.!?](\s|$)/g);
    if (!match) return content;
    const preview = match.slice(0, sentences).join(' ');
    return preview;
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  confirmDelete(id: number) {
    this.articleToDelete.set(id);
  }

  cancelDelete() {
    this.articleToDelete.set(null);
  }

  deleteArticle(id: number) {
    this.articleService.deleteArticle(id).subscribe({
      next: () => {
        console.log('Article deleted successfully');
        this.articles = this.articles.filter(a => a.id !== id);
        this.articleToDelete.set(null);
      },
      error: err => {
        console.error('Failed to delete article:', err);
        this.articleToDelete.set(null);
      }
    });
  }
}