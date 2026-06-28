import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Customer {
  id: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  notes?: string;
  email?: string;
  bankAccountNumber?: string;
  bankName?: string;
  totalDebt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customers`;

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: string, customer: Partial<Customer>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { id, ...customer });
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
