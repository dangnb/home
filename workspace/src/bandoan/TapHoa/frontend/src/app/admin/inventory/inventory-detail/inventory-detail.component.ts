import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

interface StockMovement {
    transactionId: string;
    transactionCode: string;
    typeName: string;
    type: number;
    statusName: string;
    date: string;
    approvedDate: string | null;
    referenceId: string | null;
    notes: string | null;
    createdBy: string;
    quantity: number;
    unitCost: number;
    lineTotal: number;
    runningBalance: number;
}

interface ProductStockDetail {
    productId: string;
    productName: string;
    barcode: string | null;
    unit: string;
    currentStock: number;
    averageCost: number;
    totalValue: number;
    reorderPoint: number;
    movements: StockMovement[];
}

@Component({
    selector: 'app-inventory-detail',
    standalone: true,
    imports: [CommonModule, DatePipe, DecimalPipe, NgClass, RouterLink, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="premium-card mb-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white flex-wrap gap-3">
        <div>
          <a routerLink="/admin/inventory" class="text-decoration-none text-muted d-flex align-items-center gap-1 mb-2" style="font-size: 13px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path>
            </svg>
            {{ 'INVENTORY_DETAIL.BACK_TO_INVENTORY' | translate }}
          </a>
          <h5 class="mb-1 fw-bold text-dark fs-5">
            <span class="me-2 fs-5">📋</span>{{ 'INVENTORY_DETAIL.TITLE' | translate }}: <span class="text-primary">{{ detail?.productName }}</span>
          </h5>
          <p class="text-muted mb-0 fs-7">{{ 'INVENTORY_DETAIL.SUBTITLE' | translate }}</p>
        </div>
      </div>

      <!-- Summary Cards -->
      @if (detail) {
      <div class="p-4 bg-light border-bottom">
        <div class="row g-3">
          <div class="col-6 col-lg-2">
            <div class="card border-0 shadow-sm h-100 rounded-4">
              <div class="card-body text-center p-3">
                <div class="text-muted small fw-medium mb-1">{{ 'INVENTORY_DETAIL.CURRENT_STOCK' | translate }}</div>
                <div class="fs-3 fw-bold" [ngClass]="{'text-danger': detail.currentStock <= 0, 'text-warning': detail.currentStock > 0 && detail.currentStock <= detail.reorderPoint, 'text-success': detail.currentStock > detail.reorderPoint}">
                  {{ detail.currentStock }}
                </div>
                <div class="text-muted small">{{ detail.unit }}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-2">
            <div class="card border-0 shadow-sm h-100 rounded-4">
              <div class="card-body text-center p-3">
                <div class="text-muted small fw-medium mb-1">{{ 'INVENTORY_DETAIL.AVG_COST' | translate }}</div>
                <div class="fs-5 fw-bold text-primary">{{ detail.averageCost | number:'1.0-0' }}₫</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-2">
            <div class="card border-0 shadow-sm h-100 rounded-4">
              <div class="card-body text-center p-3">
                <div class="text-muted small fw-medium mb-1">{{ 'INVENTORY_DETAIL.STOCK_VALUE' | translate }}</div>
                <div class="fs-5 fw-bold text-success">{{ detail.totalValue | number:'1.0-0' }}₫</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-2">
            <div class="card border-0 shadow-sm h-100 rounded-4">
              <div class="card-body text-center p-3">
                <div class="text-muted small fw-medium mb-1">{{ 'INVENTORY_DETAIL.REORDER_POINT' | translate }}</div>
                <div class="fs-3 fw-bold text-warning">{{ detail.reorderPoint }}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-2">
            <div class="card border-0 shadow-sm h-100 rounded-4">
              <div class="card-body text-center p-3">
                <div class="text-muted small fw-medium mb-1">{{ 'INVENTORY_DETAIL.TOTAL_TRANSACTIONS' | translate }}</div>
                <div class="fs-3 fw-bold text-dark">{{ detail.movements.length }}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-2">
            <div class="card border-0 shadow-sm h-100 rounded-4">
              <div class="card-body text-center p-3">
                <div class="text-muted small fw-medium mb-1">{{ 'INVENTORY_DETAIL.BARCODE' | translate }}</div>
                <div class="fw-bold text-dark" style="font-family: monospace; font-size: 13px;">{{ detail.barcode || '—' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      }

      <!-- Movements Table -->
      <div class="bg-white p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 custom-table" style="font-size: 13px;">
            <thead class="table-light">
              <tr>
                <th scope="col" class="ps-3">{{ 'INVENTORY_DETAIL.COL_DATE' | translate }}</th>
                <th scope="col">{{ 'INVENTORY_DETAIL.COL_CODE' | translate }}</th>
                <th scope="col">{{ 'INVENTORY_DETAIL.COL_TYPE' | translate }}</th>
                <th scope="col" class="d-none d-lg-table-cell">{{ 'INVENTORY_DETAIL.COL_REFERENCE' | translate }}</th>
                <th scope="col" class="text-center">{{ 'INVENTORY_DETAIL.COL_QUANTITY' | translate }}</th>
                <th scope="col" class="text-end d-none d-md-table-cell">{{ 'INVENTORY_DETAIL.COL_UNIT_COST' | translate }}</th>
                <th scope="col" class="text-end d-none d-md-table-cell">{{ 'INVENTORY_DETAIL.COL_TOTAL' | translate }}</th>
                <th scope="col" class="text-center fw-bold">{{ 'INVENTORY_DETAIL.COL_BALANCE' | translate }}</th>
                <th scope="col" class="d-none d-lg-table-cell">{{ 'INVENTORY_DETAIL.COL_CREATED_BY' | translate }}</th>
                <th scope="col" class="d-none d-xl-table-cell">{{ 'INVENTORY_DETAIL.COL_NOTES' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              @if (isLoading) {
              <tr>
                <td colspan="10" class="text-center py-4 text-muted">{{ 'COMMON.LOADING' | translate }}</td>
              </tr>
              }
              @for (m of detail?.movements; track m.transactionId) {
              <tr>
                <td class="ps-3 text-nowrap">
                  <div>{{ m.approvedDate || m.date | date:'dd/MM/yyyy' }}</div>
                  <small class="text-muted">{{ m.approvedDate || m.date | date:'HH:mm' }}</small>
                </td>
                <td>
                  <a [routerLink]="['/admin/transactions', m.transactionId]" class="text-decoration-none fw-medium" style="font-family: monospace;">
                    {{ m.transactionCode }}
                  </a>
                </td>
                <td>
                  <span class="badge rounded-pill px-2 py-1"
                    [ngClass]="{
                      'bg-success': m.type === 1,
                      'bg-danger': m.type === 2,
                      'bg-warning text-dark': m.type === 5,
                      'bg-info text-dark': m.type === 3,
                      'bg-secondary': m.type === 4
                    }">
                    {{ m.typeName }}
                  </span>
                </td>
                <td class="d-none d-lg-table-cell text-muted" style="font-family: monospace; font-size: 12px;">
                  {{ m.referenceId || '—' }}
                </td>
                <td class="text-center fw-bold"
                  [ngClass]="{
                    'text-success': m.type === 1,
                    'text-danger': m.type === 2 || m.type === 5,
                    'text-info': m.type === 3
                  }">
                  @if (m.type === 1) { +{{ m.quantity }} }
                  @else if (m.type === 2 || m.type === 5) { -{{ m.quantity }} }
                  @else { {{ m.quantity > 0 ? '+' : '' }}{{ m.quantity }} }
                </td>
                <td class="text-end d-none d-md-table-cell text-muted">
                  {{ m.unitCost | number:'1.0-0' }}₫
                </td>
                <td class="text-end d-none d-md-table-cell fw-medium">
                  {{ m.lineTotal | number:'1.0-0' }}₫
                </td>
                <td class="text-center fw-bolder fs-6"
                  [ngClass]="{'text-danger': m.runningBalance <= 0, 'text-dark': m.runningBalance > 0}">
                  {{ m.runningBalance }}
                </td>
                <td class="d-none d-lg-table-cell text-muted">{{ m.createdBy }}</td>
                <td class="d-none d-xl-table-cell text-muted" style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{ m.notes || '—' }}
                </td>
              </tr>
              }
              @if (!isLoading && (!detail || detail.movements.length === 0)) {
              <tr>
                <td colspan="10" class="text-center py-5 text-muted">
                  <span class="fs-1 d-block mb-3">📭</span>
                  Chưa có giao dịch nào cho sản phẩm này.
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
    `
})
export class InventoryDetailComponent implements OnInit {
    private http = inject(HttpClient);
    private route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    detail: ProductStockDetail | null = null;
    isLoading = true;

    ngOnInit() {
        const productId = this.route.snapshot.paramMap.get('productId');
        if (productId) {
            this.fetchDetail(productId);
        }
    }

    fetchDetail(productId: string) {
        this.isLoading = true;
        this.http.get<ProductStockDetail>(`${environment.apiUrl}/transactions/stock-detail/${productId}`).subscribe({
            next: (data) => {
                this.detail = data;
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error('Error fetching product stock detail:', err);
                this.isLoading = false;
                this.cdr.markForCheck();
            }
        });
    }
}
