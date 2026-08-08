import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./presentation/features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'crm', loadComponent: () => import('./presentation/features/crm/crm.component').then(m => m.CrmComponent) },
  { path: 'quotations', loadComponent: () => import('./presentation/features/quotations/quotations.component').then(m => m.QuotationsComponent) },
  { path: 'contracts', loadComponent: () => import('./presentation/features/contracts/contracts.component').then(m => m.ContractsComponent) },
  { path: 'projects', loadComponent: () => import('./presentation/features/projects/projects.component').then(m => m.ProjectsComponent) },
  { path: 'field', loadComponent: () => import('./presentation/features/field/field.component').then(m => m.FieldComponent) },
  { path: 'finance', loadComponent: () => import('./presentation/features/finance/finance.component').then(m => m.FinanceComponent) },
  { path: 'materials', loadComponent: () => import('./presentation/features/materials/materials.component').then(m => m.MaterialsComponent) },
  { path: 'documents', loadComponent: () => import('./presentation/features/documents/documents.component').then(m => m.DocumentsComponent) },
  { path: 'modules', loadComponent: () => import('./presentation/features/modules/modules.component').then(m => m.ModulesComponent) },
];
