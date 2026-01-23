import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackPage } from './callback.page';

describe('Callback', () => {
  let component: CallbackPage;
  let fixture: ComponentFixture<CallbackPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallbackPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallbackPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
