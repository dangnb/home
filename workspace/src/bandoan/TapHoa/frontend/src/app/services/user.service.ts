import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseCrudService<any> {
  constructor(http: HttpClient) {
    super(http, 'users');
  }

  // Get all users without pagination
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
