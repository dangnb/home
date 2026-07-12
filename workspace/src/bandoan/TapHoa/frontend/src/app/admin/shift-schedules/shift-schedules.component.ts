import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShiftScheduleService, EmployeeShiftDto, CreateEmployeeShiftCommand } from '../../services/shift-schedule.service';
import { AlertService } from '../../services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { TranslatePipe } from '@ngx-translate/core';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  shifts: EmployeeShiftDto[];
}

@Component({
  selector: 'app-shift-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, TranslatePipe],
  templateUrl: './shift-schedules.component.html',
  styleUrls: ['./shift-schedules.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ShiftSchedulesComponent implements OnInit {
  private scheduleService = inject(ShiftScheduleService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  schedules: EmployeeShiftDto[] = [];
  isLoading = false;

  // Calendar State
  currentMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Filter
  startDate: string = '';
  endDate: string = '';
  selectedUsername: string = '';

  // Form State
  isModalOpen = false;
  isSubmitting = false;
  users: any[] = [];
  
  form: CreateEmployeeShiftCommand = {
    username: '',
    shiftDate: '',
    shiftType: 'Ca Sáng',
    startTime: '07:00',
    endTime: '12:00',
    notes: ''
  };

  shiftTypes = ['Ca Sáng', 'Ca Chiều', 'Ca Tối', 'Full-time'];

  ngOnInit() {
    this.currentMonth = new Date();
    this.loadUsers();
    this.refreshMonth();
  }

  loadUsers() {
    this.users = [
      { username: 'admin', fullName: 'System Admin' },
      { username: 'dat.dao', fullName: 'Đào Tiến Đạt' },
      { username: 'thungan1', fullName: 'Nhân viên Thu ngân' }
    ];
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }

  refreshMonth() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Find first day of the calendar grid (Monday)
    const firstDayOfMonth = new Date(year, month, 1);
    let dayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon
    let diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const gridStartDate = new Date(year, month, 1 - diffToMonday);
    
    // Grid has 42 days (6 weeks)
    const gridEndDate = new Date(gridStartDate);
    gridEndDate.setDate(gridStartDate.getDate() + 41);
    
    this.startDate = this.formatDate(gridStartDate);
    this.endDate = this.formatDate(gridEndDate);
    
    this.loadSchedules();
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.refreshMonth();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.refreshMonth();
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const today = new Date();
    
    const firstDayOfMonth = new Date(year, month, 1);
    let dayOfWeek = firstDayOfMonth.getDay();
    let diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const gridStartDate = new Date(year, month, 1 - diffToMonday);
    
    this.calendarDays = [];
    
    for (let i = 0; i < 42; i++) {
      const currentGridDate = new Date(gridStartDate);
      currentGridDate.setDate(gridStartDate.getDate() + i);
      
      const dateStr = this.formatDate(currentGridDate);
      const dayShifts = this.schedules.filter(s => s.shiftDate.split('T')[0] === dateStr);
      
      this.calendarDays.push({
        date: currentGridDate,
        isCurrentMonth: currentGridDate.getMonth() === month,
        isToday: this.formatDate(currentGridDate) === this.formatDate(today),
        isWeekend: currentGridDate.getDay() === 0 || currentGridDate.getDay() === 6,
        shifts: dayShifts
      });
    }
  }

  loadSchedules() {
    this.isLoading = true;
    this.cdr.markForCheck();
    
    this.scheduleService.getSchedules(this.startDate, this.endDate, this.selectedUsername).subscribe({
      next: (res) => {
        this.schedules = res;
        this.generateCalendar();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.alertService.error('Không thể tải danh sách ca làm việc');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onFilterChange() {
    this.loadSchedules();
  }

  openAddModal(dateStr?: string) {
    this.form = {
      username: this.selectedUsername || '',
      shiftDate: dateStr || this.formatDate(new Date()),
      shiftType: 'Ca Sáng',
      startTime: '08:00',
      endTime: '12:00',
      notes: ''
    };
    this.isModalOpen = true;
    this.cdr.markForCheck();
  }

  // --- DRAG AND DROP LOGIC ---
  draggedShiftId: string | null = null;

  onDragStart(event: DragEvent, shiftId: string) {
    this.draggedShiftId = shiftId;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', shiftId);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Necessary to allow dropping
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, targetDate: Date) {
    event.preventDefault();
    const shiftId = this.draggedShiftId || (event.dataTransfer ? event.dataTransfer.getData('text/plain') : null);
    
    if (shiftId) {
      const draggedShift = this.schedules.find(s => s.id === shiftId);
      if (!draggedShift) return;

      const todayStr = this.formatDate(new Date());
      const targetDateStr = this.formatDate(targetDate);
      const shiftDateStr = draggedShift.shiftDate.split('T')[0];

      if (targetDateStr < todayStr) {
        this.alertService.warning('Không thể chuyển ca về ngày trong quá khứ');
        return;
      }
      if (shiftDateStr < todayStr) {
        this.alertService.warning('Không thể di chuyển ca làm việc ở quá khứ');
        return;
      }
      if (targetDateStr === shiftDateStr) return;

      const hasCollision = this.schedules.some(s => 
        s.shiftDate.split('T')[0] === targetDateStr &&
        s.username === draggedShift.username &&
        s.shiftType === draggedShift.shiftType
      );

      if (hasCollision) {
        this.alertService.warning(`Nhân viên ${draggedShift.username} đã có ${draggedShift.shiftType} vào ngày này`);
        return;
      }

      this.alertService.confirm('Di chuyển ca', `Bạn muốn chuyển ${draggedShift.shiftType} của ${draggedShift.username} sang ngày ${targetDate.toLocaleDateString('vi-VN')}?`)
        .then((result) => {
          if (result.isConfirmed) {
            this.isLoading = true;
            this.cdr.markForCheck();
            
            this.scheduleService.moveSchedule(shiftId, targetDateStr).subscribe({
              next: () => {
                this.alertService.success('Đã chuyển ca sang ngày khác');
                this.loadSchedules();
                this.draggedShiftId = null;
                this.cdr.markForCheck();
              },
              error: () => {
                this.alertService.error('Có lỗi xảy ra khi di chuyển ca');
                this.isLoading = false;
                this.draggedShiftId = null;
                this.cdr.markForCheck();
              }
            });
          }
        });
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onShiftTypeChange() {
    switch (this.form.shiftType) {
      case 'Ca Sáng':
        this.form.startTime = '07:00';
        this.form.endTime = '12:00';
        break;
      case 'Ca Chiều':
        this.form.startTime = '12:00';
        this.form.endTime = '18:00';
        break;
      case 'Ca Tối':
        this.form.startTime = '18:00';
        this.form.endTime = '22:00';
        break;
      case 'Full-time':
        this.form.startTime = '08:00';
        this.form.endTime = '22:00';
        break;
    }
  }

  saveSchedule() {
    if (!this.form.username || !this.form.shiftDate || !this.form.startTime || !this.form.endTime) {
      this.alertService.warning('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (this.form.startTime >= this.form.endTime) {
      this.alertService.warning('Giờ kết thúc phải sau giờ bắt đầu');
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();
    
    const command = {
      ...this.form,
      startTime: this.form.startTime.length === 5 ? `${this.form.startTime}:00` : this.form.startTime,
      endTime: this.form.endTime.length === 5 ? `${this.form.endTime}:00` : this.form.endTime
    };

    this.scheduleService.createSchedule(command).subscribe({
      next: () => {
        this.alertService.success('Phân ca thành công');
        this.closeModal();
        this.loadSchedules();
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.alertService.error('Có lỗi xảy ra khi phân ca');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  deleteSchedule(id: string) {
    this.alertService.confirm('Xóa phân ca', 'Bạn có chắc chắn muốn xóa lịch làm việc này?').then((result) => {
      if (result.isConfirmed) {
        this.scheduleService.deleteSchedule(id).subscribe({
          next: () => {
            this.alertService.success('Đã xóa lịch phân ca');
            this.loadSchedules();
            this.cdr.markForCheck();
          },
          error: () => {
            this.alertService.error('Có lỗi xảy ra khi xóa');
            this.cdr.markForCheck();
          }
        });
      }
    });
  }
}
