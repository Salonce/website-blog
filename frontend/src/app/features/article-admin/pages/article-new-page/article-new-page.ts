import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../../../core/article-service/article-service';
import { NewArticle } from '../../../../core/models/new-article';
import { QuillModule } from 'ngx-quill';
import { QuillEditor } from '../../components/quill-editor/quill-editor';

@Component({
  selector: 'app-article-new-page',
  imports: [QuillModule, FormsModule, QuillEditor],
  templateUrl: './article-new-page.html',
  styleUrl: './article-new-page.css'
})
export class ArticleNewPage {

  constructor(private articleService : ArticleService){}

  article : NewArticle = {
    title: '',
    content: ''
  };

  onSubmit() {
    console.log('Article object:', this.article);
    console.log('Content value:', this.article.content);
    this.articleService.postArticle(this.article).subscribe(res => {
      console.log('New Article:', res);
    });
  }

}