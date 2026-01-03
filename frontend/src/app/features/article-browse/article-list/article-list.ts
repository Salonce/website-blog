import { Component, Input } from '@angular/core';
import { Article } from '../../../core/models/article';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-article-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css'
})
export class ArticleList {

  constructor(private sanitizer: DomSanitizer){}

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
}
