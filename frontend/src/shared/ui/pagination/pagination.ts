import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination {

  @Input() totalPages: number = 0;
  @Input() currentPage: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  goToPage(page: number) { 
    if (page !== this.currentPage) this.pageChange.emit(page); 
  }

  prev() { if (this.currentPage > 0) this.pageChange.emit(this.currentPage - 1); }
  next() { if (this.currentPage < this.totalPages - 1) this.pageChange.emit(this.currentPage + 1); }

}
