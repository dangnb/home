import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../services/audit.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-audits',
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './audits.component.html',
    styleUrl: './audits.component.scss'
})
export class AuditsComponent implements OnInit {
   private auditService = inject(AuditService);
   private cdr = inject(ChangeDetectorRef);

   logs: any[] = [];
   filteredLogs: any[] = [];
   paginatedLogs: any[] = [];

   searchTerm: string = '';
   actionFilter: string = '';

   currentPage = 1;
   pageSize = 15;
   totalPages = 1;

   ngOnInit() {
      this.loadAudits();
   }

   loadAudits() {
      this.auditService.getAudits().subscribe({
         next: (data: any[]) => {
             this.logs = data || [];
             this.onSearchChange();
         },
         error: (err: any) => console.error(err)
      });
   }

   onSearchChange() {
       let filtered = [...this.logs];

       if (this.searchTerm) {
           const term = this.searchTerm.toLowerCase();
           filtered = filtered.filter(l => 
               (l.username && l.username.toLowerCase().includes(term)) ||
               (l.requestName && l.requestName.toLowerCase().includes(term))
           );
       }

       if (this.actionFilter) {
           filtered = filtered.filter(l => l.action === this.actionFilter);
       }

       this.filteredLogs = filtered;
       this.currentPage = 1;
       this.updatePagination();
   }

   updatePagination() {
       this.totalPages = Math.ceil(this.filteredLogs.length / this.pageSize) || 1;
       if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
       const startIndex = (this.currentPage - 1) * this.pageSize;
       this.paginatedLogs = this.filteredLogs.slice(startIndex, startIndex + this.pageSize);
       this.cdr.detectChanges();
   }

   goToPage(page: number) {
       if (page >= 1 && page <= this.totalPages) {
           this.currentPage = page;
           this.updatePagination();
       }
   }

   get paginationArray() {
       const pages = [];
       let start = Math.max(1, this.currentPage - 2);
       let end = Math.min(this.totalPages, this.currentPage + 2);

       if (start === 1) end = Math.min(this.totalPages, 5);
       if (end === this.totalPages) start = Math.max(1, this.totalPages - 4);

       for (let i = start; i <= end; i++) {
           pages.push(i);
       }
       return pages;
   }
}
