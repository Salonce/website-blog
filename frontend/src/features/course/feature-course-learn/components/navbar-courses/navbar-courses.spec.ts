import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCourses } from './navbar-courses';

describe('NavbarCourses', () => {
  let component: NavbarCourses;
  let fixture: ComponentFixture<NavbarCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarCourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarCourses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
