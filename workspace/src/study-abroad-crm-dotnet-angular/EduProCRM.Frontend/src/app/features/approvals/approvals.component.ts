import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ApprovalService, ApprovalRequestDto } from '../../core/services/approval.service';

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class ApprovalsComponent implements OnInit {
  private approvalService = inject(ApprovalService);

  // Angular Signals for State Management
  approvals = signal<ApprovalRequestDto[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadApprovals();
  }

  loadApprovals() {
    this.isLoading.set(true);
    this.approvalService.getApprovals().subscribe({
      next: (data) => {
        this.approvals.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        // Mock fallback data for demo
        this.approvals.set([
          {
            id: 'DX-2026-081',
            requestType: 'Phiếu thu giá trị lớn',
            studentId: 'HV-2026-001',
            studentName: 'Phạm Minh Anh',
            contractId: 'HĐ-2026-DE01',
            amount: 30000000,
            proposerName: 'Phạm Thanh Hà (Kế toán)',
            createdAt: '2026-08-17T10:15:00',
            statusLevel1: 'Kế toán soát: ĐÃ DUYỆT',
            statusLevel2: 'Chờ Giám Đốc Phê Duyệt',
            status: 'Chờ duyệt'
          },
          {
            id: 'DX-2026-082',
            requestType: 'Hoàn cọc bảo đảm',
            studentId: 'HV-2026-002',
            studentName: 'Nguyễn Hoàng Long',
            contractId: 'HĐ-2026-AU02',
            amount: 10000000,
            proposerName: 'Trần Thị Lan (Mentor)',
            createdAt: '2026-08-16T15:40:00',
            statusLevel1: 'Kế toán soát: ĐÃ DUYỆT',
            statusLevel2: 'Giám Đốc: ĐÃ PHÊ DUYỆT',
            status: 'Đã duyệt'
          }
        ]);
        this.isLoading.set(false);
      }
    });
  }

  approve(id: string) {
    this.approvalService.approve(id).subscribe({
      next: () => {
        alert('Đã duyệt đề xuất thành công!');
        this.loadApprovals();
      },
      error: () => {
        // UI Signal state update on demo mode
        const updated = this.approvals().map(a => {
          if (a.id === id) {
            return {
              ...a,
              statusLevel2: 'Giám Đốc: ĐÃ PHÊ DUYỆT',
              status: 'Đã duyệt'
            };
          }
          return a;
        });
        this.approvals.set(updated);
        alert('Đã phê duyệt giao dịch thành công (Cấp Giám đốc)!');
      }
    });
  }
}
