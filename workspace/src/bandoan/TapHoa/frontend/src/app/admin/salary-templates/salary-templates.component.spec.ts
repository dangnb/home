import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTemplatesComponent } from './salary-templates.component';

describe('SalaryTemplatesComponent', () => {
  let component: SalaryTemplatesComponent;
  let fixture: ComponentFixture<SalaryTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
