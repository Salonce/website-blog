import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleAdminList } from './article-admin-list';

describe('ArticleAdminList', () => {
  let component: ArticleAdminList;
  let fixture: ComponentFixture<ArticleAdminList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleAdminList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleAdminList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
