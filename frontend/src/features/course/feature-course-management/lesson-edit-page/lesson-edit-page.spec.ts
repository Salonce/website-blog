import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonEditPage } from './lesson-edit-page';

describe('LessonEditPage', () => {
  let component: LessonEditPage;
  let fixture: ComponentFixture<LessonEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
