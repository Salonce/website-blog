import { Component, OnInit, signal } from '@angular/core';
import { ArticleService } from '../../../../core/article-service/article-service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewArticle } from '../../../../core/models/new-article';
import { QuillEditor } from '../../components/quill-editor/quill-editor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-edit-page',
  imports: [QuillEditor, FormsModule, CommonModule],
  templateUrl: './article-edit-page.html',
  styleUrl: './article-edit-page.css'
})
export class ArticleEditPage implements OnInit {

  article: NewArticle | null = null;
  id!: number;

  // Signals for modals
  showConfirmation = signal<boolean>(false);
  showSuccess = signal<boolean>(false);
  showError = signal<boolean>(false);
  isUpdating = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(private articleService: ArticleService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.loadArticle(this.id);
    });
  }

  loadArticle(id: number) {
    this.articleService.getArticleById(id).subscribe({
      next: (article: NewArticle) => this.article = article,
      error: (err) => {
        console.error('Failed to load article:', err);
        this.errorMessage.set('Failed to load article');
        this.showError.set(true);
      }
    });
  }

  // Form submit
  onSubmit() {
    if (!this.article) return;
    this.showConfirmation.set(true);
  }

  cancelUpdate() {
    this.showConfirmation.set(false);
  }

  confirmUpdate() {
    if (!this.article) return;

    this.isUpdating.set(true);

    this.articleService.patchArticle(this.id, this.article).subscribe({
      next: res => {
        this.isUpdating.set(false);
        this.showConfirmation.set(false);
        this.showSuccess.set(true);
      },
      error: err => {
        this.isUpdating.set(false);
        this.showConfirmation.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to update the article.');
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