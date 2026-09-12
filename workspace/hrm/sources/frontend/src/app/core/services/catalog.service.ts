import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type SystemCatalogType =
  | 'LEAVE_TYPE'
  | 'JOB_POSITION'
  | 'EDUCATION_LEVEL'
  | 'ASSET_CATEGORY'
  | 'CONTRACT_TYPE'
  | 'NATIONALITY'
  | 'DEPARTMENT_TYPE';

export interface SystemCatalogDto {
  id: number;
  tenantId: number;
  catalogType: string;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  isSystemDefault: boolean;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export const CATALOG_TYPE_META: Record<SystemCatalogType, { label: string; icon: string; description: string }> = {
  LEAVE_TYPE:      { label: 'Loại Nghỉ Phép',             icon: 'bi-calendar-x',          description: 'Cấu hình các hình thức nghỉ phép trong công ty' },
  JOB_POSITION:    { label: 'Chức Vụ / Chức Danh',        icon: 'bi-person-badge',         description: 'Các chức danh công việc từ C-Level đến nhân viên' },
  EDUCATION_LEVEL: { label: 'Trình Độ Học Vấn',           icon: 'bi-mortarboard',          description: 'Phân loại trình độ học vấn nhân sự' },
  ASSET_CATEGORY:  { label: 'Danh Mục Tài Sản',           icon: 'bi-box-seam',             description: 'Phân loại các nhóm tài sản công ty' },
  CONTRACT_TYPE:   { label: 'Loại Hợp Đồng',             icon: 'bi-file-earmark-text',    description: 'Cấu hình các loại hợp đồng lao động' },
  NATIONALITY:     { label: 'Quốc Tịch / Dân Tộc',       icon: 'bi-globe-asia-australia', description: 'Danh sách quốc tịch / dân tộc nhân sự' },
  DEPARTMENT_TYPE: { label: 'Loại Phòng Ban',             icon: 'bi-diagram-3',            description: 'Phân loại các nhóm phòng ban trong tổ chức' },
};

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/config`;

  /** Lấy danh sách dropdown cho một loại danh mục (chỉ ACTIVE) */
  getCatalogByType(type: SystemCatalogType, activeOnly = true): Observable<any> {
    const params = new HttpParams().set('activeOnly', activeOnly.toString());
    return this.http.get<any>(`${this.apiUrl}/${type}`, { params });
  }

  /** Lấy tất cả danh mục phân nhóm theo loại (Admin UI) */
  getAllGrouped(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all-grouped`);
  }

  /** Tạo mới danh mục */
  create(type: string, dto: { code: string; name: string; description?: string; sortOrder?: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${type}`, dto);
  }

  /** Cập nhật danh mục */
  update(type: string, id: number, dto: { name: string; description?: string; sortOrder?: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${type}/${id}`, dto);
  }

  /** Bật/Tắt danh mục */
  toggleStatus(type: string, id: number, activate: boolean): Observable<any> {
    const params = new HttpParams().set('activate', activate.toString());
    return this.http.patch<any>(`${this.apiUrl}/${type}/${id}/status`, null, { params });
  }

  /** Xóa mềm danh mục */
  delete(type: string, id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${type}/${id}`);
  }
}
