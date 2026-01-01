import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleAdminListPage } from './article-admin-list-page';

describe('ArticleAdminListPage', () => {
  let component: ArticleAdminListPage;
  let fixture: ComponentFixture<ArticleAdminListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleAdminListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleAdminListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
