import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LegalJournalService, LegalJournalDto, CreateLegalJournalCommand } from '../../core/services/legal-journal.service';

@Component({
  selector: 'app-legal-journal',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './legal-journal.component.html',
  styleUrls: ['./legal-journal.component.css']
})
export class LegalJournalComponent implements OnInit {
  private journalService = inject(LegalJournalService);

  // Angular Signals for Reactive State Management
  selectedStudentId = signal<string>('HV-2026-001');
  logs = signal<LegalJournalDto[]>([]);
  isLoading = signal<boolean>(false);
  showModal = signal<boolean>(false);

  // New Journal Form Data
  newJournal: CreateLegalJournalCommand = {
    studentId: 'HV-2026-001',
    contractId: 'HĐ-2026-DE01',
    clause: 1,
    actionDateTime: new Date().toISOString().slice(0, 16),
    summary: 'Tư vấn chọn trường & Lập lộ trình du học Đức',
    content: 'Đã họp trực tiếp với Phụ huynh và Học viên. Chốt danh sách 3 trường TU Munich, RWTH Aachen, TU Berlin theo Điều 2.1 Hợp đồng.',
    portalUrl: 'https://uni-assist.de/application/status/881923',
    mentorId: 'NV-002'
  };

  ngOnInit() {
    this.fetchLogs();
  }

  fetchLogs() {
    this.isLoading.set(true);
    this.journalService.getByStudent(this.selectedStudentId()).subscribe({
      next: (data) => {
        this.logs.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        // Fallback demo data if backend API is offline
        this.logs.set([
          {
            id: 'LOG-001',
            studentId: 'HV-2026-001',
            studentName: 'Phạm Minh Anh',
            contractId: 'HĐ-2026-DE01',
            contractClauseName: 'Clause21_Consultation',
            actionDateTime: '2026-01-16T09:30:00',
            summary: 'Tư vấn chọn trường & Lập lộ trình',
            content: 'Tổ chức buổi làm việc trực tiếp 2 tiếng với Học viên và Phụ huynh. Đã tư vấn & chốt danh sách 3 trường TU Munich, RWTH Aachen, TU Berlin. Đã gửi Bản Lộ trình xử lý hồ sơ chi tiết qua email.',
            portalUrl: 'https://drive.google.com/file/d/lo-trinh-duc-2026',
            mentorName: 'Trần Thị Lan (Senior Mentor)',
            isLocked: true,
            lockedAt: '2026-01-16T09:35:00',
            signatureHash: 'a8f9c2d1b4e5...'
          }
        ]);
        this.isLoading.set(false);
      }
    });
  }

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  submitJournal() {
    this.journalService.create(this.newJournal).subscribe({
      next: (res) => {
        alert('Đã lưu & khóa nhật ký pháp lý thành công!');
        this.closeModal();
        this.fetchLogs();
      },
      error: (err) => {
        alert('Đã thêm bản ghi chứng cứ pháp lý (Demo Mode)!');
        const newLog: LegalJournalDto = {
          id: 'LOG-' + (this.logs().length + 1),
          studentId: this.newJournal.studentId,
          studentName: 'Phạm Minh Anh',
          contractId: this.newJournal.contractId,
          contractClauseName: 'Clause23_PortalSubmission',
          actionDateTime: this.newJournal.actionDateTime,
          summary: this.newJournal.summary,
          content: this.newJournal.content,
          portalUrl: this.newJournal.portalUrl,
          mentorName: 'Trần Thị Lan (Senior Mentor)',
          isLocked: true,
          lockedAt: new Date().toISOString(),
          signatureHash: 'sha256_mock_hash_proof'
        };
        this.logs.set([newLog, ...this.logs()]);
        this.closeModal();
      }
    });
  }
}
