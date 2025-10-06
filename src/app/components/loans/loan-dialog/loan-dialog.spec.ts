import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDialog } from './loan-dialog';

describe('LoanDialog', () => {
  let component: LoanDialog;
  let fixture: ComponentFixture<LoanDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
