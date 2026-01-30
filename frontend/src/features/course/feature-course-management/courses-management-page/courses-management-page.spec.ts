import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesManagementPage } from './courses-management-page';

describe('CoursesManagementPage', () => {
  let component: CoursesManagementPage;
  let fixture: ComponentFixture<CoursesManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesManagementPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
