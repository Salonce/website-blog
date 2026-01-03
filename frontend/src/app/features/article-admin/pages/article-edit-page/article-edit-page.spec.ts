import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleEditPage } from './article-edit-page';

describe('ArticleEditPage', () => {
  let component: ArticleEditPage;
  let fixture: ComponentFixture<ArticleEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
