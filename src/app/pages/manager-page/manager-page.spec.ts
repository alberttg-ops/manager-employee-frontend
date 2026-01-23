import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPage } from './manager-page';

describe('ManagerPage', () => {
  let component: ManagerPage;
  let fixture: ComponentFixture<ManagerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
