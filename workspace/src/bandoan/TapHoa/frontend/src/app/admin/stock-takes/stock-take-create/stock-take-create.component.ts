import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StockTakeService } from '../../../core/services/stock-take.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-stock-take-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './stock-take-create.component.html',
  styleUrls: ['./stock-take-create.component.scss']
})
export class StockTakeCreateComponent implements OnInit {
  createForm: FormGroup;
  categories: Category[] = [];
  isSubmitting = false;

  private fb = inject(FormBuilder);
  private stockTakeService = inject(StockTakeService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  constructor() {
    this.createForm = this.fb.group({
      documentNo: ['', Validators.required],
      notes: [''],
      categoryId: [null]
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => this.categories = data,
      error: (err: any) => console.error('Error fetching categories', err)
    });

    // Auto-generate document no
    const date = new Date();
    const docNo = `PKK-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    this.createForm.patchValue({ documentNo: docNo });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.createForm.value;
    
    const command = {
      documentNo: formValue.documentNo,
      notes: formValue.notes,
      categoryId: formValue.categoryId ? formValue.categoryId : undefined
    };

    this.stockTakeService.createStockTake(command).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        // Navigate to the detail page to start counting
        this.router.navigate(['/admin/stock-takes', res.id]);
      },
      error: (err: any) => {
        console.error('Error creating stock take', err);
        this.isSubmitting = false;
      }
    });
  }
}
