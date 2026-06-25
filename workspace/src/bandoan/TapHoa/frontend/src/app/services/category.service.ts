import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { environment } from '../../environments/environment';
import { BaseCrudService } from './base-crud.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends BaseCrudService<Category> {
    constructor(protected override http: HttpClient) {
        super(http, `${environment.apiUrl}/categories`);
    }

    // Các hàm đặc thù của Category (nếu sau này có thêm) sẽ viết thêm ở đây
    // Ví dụ: updateStatus, v.v.. Các hàm get/create/update/delete đã có sẵn.

    // Ghi đè lại tên hàm getCategories() cũ để tương thích component cũ đang dùng (hoặc có thể refactor cả thư mục component lên dùng this.categoryService.getAll())
    getCategories() {
        return this.getAll();
    }

    getCategory(id: string) {
        return this.getById(id);
    }

    createCategory(category: Category) {
        return this.create(category);
    }

    updateCategory(id: string, category: Category) {
        return this.update(id, category);
    }

    deleteCategory(id: string) {
        return this.delete(id);
    }
}
