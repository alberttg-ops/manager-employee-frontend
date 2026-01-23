import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailsPage } from './employee-details,page';

describe('EmployeeDetails', () => {
  let component: EmployeeDetailsPage;
  let fixture: ComponentFixture<EmployeeDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
