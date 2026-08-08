import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  User, Customer, Opportunity, Quotation, QuotationItem,
  Contract, Project, ProjectTask, DailyLog, ExecutiveStats,
  DebtRecord, DocumentRecord
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api';

  // Auth & Admin
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { username, password });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/auth/users`);
  }

  // Dashboard
  getExecutiveStats(): Observable<ExecutiveStats> {
    return this.http.get<ExecutiveStats>(`${this.baseUrl}/dashboard/executive-stats`);
  }

  // CRM
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/crm/customers`);
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/crm/customers`, customer);
  }

  getOpportunities(): Observable<Opportunity[]> {
    return this.http.get<Opportunity[]>(`${this.baseUrl}/crm/opportunities`);
  }

  convertOpportunityToQuotation(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/crm/opportunities/${id}/convert-to-quotation`, {});
  }

  // Quotations & BOQ
  getQuotations(): Observable<Quotation[]> {
    return this.http.get<Quotation[]>(`${this.baseUrl}/quotation`);
  }

  getQuotationById(id: string): Observable<Quotation> {
    return this.http.get<Quotation>(`${this.baseUrl}/quotation/${id}`);
  }

  addQuotationItem(item: Partial<QuotationItem>): Observable<QuotationItem> {
    return this.http.post<QuotationItem>(`${this.baseUrl}/quotation/items`, item);
  }

  getExcelExportUrl(quotationId: string): string {
    return `${this.baseUrl}/quotation/${quotationId}/export-excel`;
  }

  // Contracts
  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.baseUrl}/contract`);
  }

  convertToProject(contractId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/contract/${contractId}/convert-to-project`, {});
  }

  // Projects
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/project`);
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/project/${id}`);
  }

  createTask(task: Partial<ProjectTask>): Observable<ProjectTask> {
    return this.http.post<ProjectTask>(`${this.baseUrl}/project/tasks`, task);
  }

  updateTaskStatus(taskId: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/project/tasks/${taskId}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Daily Log (ConsBase Field)
  getDailyLogs(projectId: string): Observable<DailyLog[]> {
    return this.http.get<DailyLog[]>(`${this.baseUrl}/dailylog/project/${projectId}`);
  }

  createDailyLog(log: Partial<DailyLog>): Observable<DailyLog> {
    return this.http.post<DailyLog>(`${this.baseUrl}/dailylog`, log);
  }

  approveDailyLog(id: string, approverUserId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/dailylog/${id}/approve?approverUserId=${approverUserId}`, {});
  }

  lockDailyLog(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/dailylog/${id}/lock`, {});
  }

  // Finance & Debts
  getDebts(): Observable<DebtRecord[]> {
    return this.http.get<DebtRecord[]>(`${this.baseUrl}/finance/debts`);
  }

  getPaymentRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/finance/payment-requests`);
  }

  approvePaymentRequest(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/finance/payment-requests/${id}/approve`, {});
  }

  getCostOverrunAnalysis(projectId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/finance/cost-overrun-analysis/${projectId}`);
  }

  // Modules
  getMaterialRequisitions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/modules/materials/requisitions`);
  }

  getWarehouses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/modules/materials/warehouses`);
  }

  getChangeOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/modules/change-orders`);
  }

  approveChangeOrder(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/modules/change-orders/${id}/approve`, {});
  }

  getAcceptanceRecords(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/modules/acceptance-records`);
  }

  getDocuments(): Observable<DocumentRecord[]> {
    return this.http.get<DocumentRecord[]>(`${this.baseUrl}/modules/documents`);
  }

  getQcHseIncidents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/modules/qchse`);
  }

  resolveQcHseIncident(id: string, correctiveAction: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/modules/qchse/${id}/resolve`, JSON.stringify(correctiveAction), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getSubcontractors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/modules/subcontractors`);
  }
}
