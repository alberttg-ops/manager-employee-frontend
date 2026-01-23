import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthGatePage } from './auth-gate.page';

describe('AuthGatePage', () => {
  let component: AuthGatePage;
  let fixture: ComponentFixture<AuthGatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthGatePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthGatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
