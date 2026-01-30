import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article-service';
import { NewArticle } from '../../models/new-article';
import { QuillModule } from 'ngx-quill';
import { QuillEditor } from '../../../../shared/components/quill-editor/quill-editor';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-new-page',
  imports: [QuillModule, FormsModule, QuillEditor, CommonModule],
  templateUrl: './article-new-page.html',
  styleUrl: './article-new-page.css'
})
export class ArticleNewPage {

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  article: NewArticle = {
    title: '',
    content: ''
  };

  showConfirmation = signal<boolean>(false);
  showSuccess = signal<boolean>(false);
  showError = signal<boolean>(false);
  isPublishing = signal<boolean>(false);
  errorMessage = signal<string>('');

  onSubmit() {
    this.showConfirmation.set(true);
  }

  cancelPublish() {
    this.showConfirmation.set(false);
  }

  confirmPublish() {
    console.log('Article object:', this.article);
    console.log('Content value:', this.article.content);
    
    this.isPublishing.set(true);
    
    this.articleService.postArticle(this.article).subscribe({
      next: (res) => {
        console.log('New Article:', res);
        this.isPublishing.set(false);
        this.showConfirmation.set(false);
        this.showSuccess.set(true);
      },
      error: (err) => {
        console.error('Failed to publish article:', err);
        this.errorMessage.set(err.error?.message || 'An unexpected error occurred while publishing the article.');
        this.isPublishing.set(false);
        this.showConfirmation.set(false);
        this.showError.set(true);
      }
    });
  }

  stayOnPage() {
    this.showSuccess.set(false);
  }

  goToArticles() {
    this.showSuccess.set(false);
    this.router.navigate(['/home']);
  }

  closeError() {
    this.showError.set(false);
  }
}