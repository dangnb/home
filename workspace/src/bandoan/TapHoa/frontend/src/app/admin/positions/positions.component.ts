import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Position, PositionService } from '../../services/position.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {
  positions = signal<Position[]>([]);
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  
  showModal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  editingPosition: Partial<Position> = {};

  constructor(
    private positionService: PositionService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadPositions();
  }

  loadPositions() {
    this.isLoading.set(true);
    this.positionService.getAll().subscribe({
      next: (data) => {
        this.positions.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.alertService.error('Không thể tải danh sách chức vụ');
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.editingPosition = { name: '', description: '' };
    this.showModal.set(true);
  }

  openEditModal(item: Position) {
    this.isEditMode.set(true);
    this.editingPosition = { ...item };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  savePosition() {
    if (!this.editingPosition.name) return;

    this.isSubmitting.set(true);
    if (this.isEditMode()) {
      this.positionService.update(this.editingPosition.id!, this.editingPosition as Position).subscribe({
        next: () => {
          this.alertService.success('Cập nhật chức vụ thành công');
          this.loadPositions();
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.alertService.error('Có lỗi xảy ra khi cập nhật');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.positionService.create(this.editingPosition as Position).subscribe({
        next: () => {
          this.alertService.success('Thêm chức vụ thành công');
          this.loadPositions();
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.alertService.error('Có lỗi xảy ra khi thêm mới');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  deletePosition(id: string) {
    this.alertService.confirm(
      'Bạn có chắc muốn xóa?',
      'Chức vụ này sẽ bị xóa khỏi hệ thống'
    ).then((result) => {
      if (result.isConfirmed) {
        this.positionService.delete(id).subscribe({
          next: () => {
            this.alertService.success('Xóa thành công');
            this.loadPositions();
          },
          error: () => {
            this.alertService.error('Không thể xóa chức vụ này');
          }
        });
      }
    });
  }
}
