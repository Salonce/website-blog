import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseLessonsManagementPage } from './course-lessons-management-page';

describe('CourseLessonsManagementPage', () => {
  let component: CourseLessonsManagementPage;
  let fixture: ComponentFixture<CourseLessonsManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseLessonsManagementPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseLessonsManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
