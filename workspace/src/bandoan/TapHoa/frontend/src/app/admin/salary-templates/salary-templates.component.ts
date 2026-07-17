import { Component, OnInit, signal, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryTemplateService } from '../../services/salary-template.service';
import { SalaryTemplate } from '../../models/salary-template.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-salary-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-templates.component.html',
  styleUrls: ['./salary-templates.component.scss']
})
export class SalaryTemplatesComponent implements OnInit {
  private salaryTemplateService = inject(SalaryTemplateService);
  private alertService = inject(AlertService);

  templates = signal<SalaryTemplate[]>([]);
  isLoading = signal(true);

  showModal = signal(false);
  isEditMode = signal(false);
  isSubmitting = signal(false);

  editingTemplate: any = { name: '', formula: '', notes: '', isActive: true };

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates() {
    this.isLoading.set(true);
    this.salaryTemplateService.getTemplates().subscribe({
      next: (data) => {
        this.templates.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.alertService.error(err.error?.message || 'Lỗi tải dữ liệu');
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.editingTemplate = { name: '', formula: '', notes: '', isActive: true };
    this.showModal.set(true);
  }

  openEditModal(template: SalaryTemplate) {
    this.isEditMode.set(true);
    this.editingTemplate = { ...template };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.isSubmitting.set(false);
  }

  saveTemplate() {
    if (!this.editingTemplate.name || !this.editingTemplate.formula) {
      this.alertService.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    this.isSubmitting.set(true);

    if (this.isEditMode()) {
      this.salaryTemplateService.updateTemplate(this.editingTemplate.id, this.editingTemplate).subscribe({
        next: () => {
          this.alertService.success('Cập nhật mẫu lương thành công');
          this.closeModal();
          this.loadTemplates();
        },
        error: (err: any) => {
          this.alertService.error(err.error?.message || 'Lỗi cập nhật');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.salaryTemplateService.createTemplate(this.editingTemplate).subscribe({
        next: () => {
          this.alertService.success('Thêm mẫu lương thành công');
          this.closeModal();
          this.loadTemplates();
        },
        error: (err: any) => {
          this.alertService.error(err.error?.message || 'Lỗi thêm mới');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  deleteTemplate(id: string) {
    this.alertService.confirm('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa mẫu lương này?').then((result: any) => {
      if (result.isConfirmed) {
        this.salaryTemplateService.deleteTemplate(id).subscribe({
          next: () => {
            this.alertService.success('Xóa thành công');
            this.loadTemplates();
          },
          error: (err: any) => {
            this.alertService.error(err.error?.message || 'Lỗi khi xóa');
          }
        });
      }
    });
  }
}
