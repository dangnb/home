import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StoreLayoutComponent } from './store-layout.component';
import { provideHttpClient } from '@angular/common/http';

describe('StoreLayoutComponent', () => {
  let component: StoreLayoutComponent;
  let fixture: ComponentFixture<StoreLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreLayoutComponent],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
