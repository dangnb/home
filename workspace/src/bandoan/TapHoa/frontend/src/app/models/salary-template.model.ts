export interface SalaryTemplate {
  id: string;
  name: string;
  formula: string;
  notes?: string;
  isActive: boolean;
}

export interface CreateSalaryTemplateCommand {
  name: string;
  formula: string;
  notes?: string;
}

export interface UpdateSalaryTemplateCommand {
  id: string;
  name: string;
  formula: string;
  notes?: string;
  isActive: boolean;
}
