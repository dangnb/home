import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor() { }

    success(title: string, text?: string) {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#3085d6',
            timer: 3000,
            timerProgressBar: true
        });
    }

    error(title: string, text?: string) {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#d33'
        });
    }

    warning(title: string, text?: string) {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#f8bb86'
        });
    }

    info(title: string, text?: string) {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: text,
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#3fc3ee'
        });
    }

    confirm(title: string, text: string, confirmButtonText: string = 'Đồng ý', cancelButtonText: string = 'Hủy') {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText
        });
    }
}
