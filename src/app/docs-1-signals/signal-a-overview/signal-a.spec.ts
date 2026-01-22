import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalA } from './signal-a';

describe('SignalA', () => {
  let component: SignalA;
  let fixture: ComponentFixture<SignalA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalA);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
