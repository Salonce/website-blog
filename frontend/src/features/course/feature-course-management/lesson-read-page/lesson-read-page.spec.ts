import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonReadPage } from './lesson-read-page';

describe('LessonReadPage', () => {
  let component: LessonReadPage;
  let fixture: ComponentFixture<LessonReadPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonReadPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonReadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
