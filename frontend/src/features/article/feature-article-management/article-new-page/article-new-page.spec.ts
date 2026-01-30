import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNewPage } from './article-new-page';

describe('ArticleNewPage', () => {
  let component: ArticleNewPage;
  let fixture: ComponentFixture<ArticleNewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleNewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
