import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLessons } from './navbar-lessons';

describe('NavbarLessons', () => {
  let component: NavbarLessons;
  let fixture: ComponentFixture<NavbarLessons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarLessons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarLessons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
