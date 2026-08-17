export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
  isActive?: boolean;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  type: 'Individual' | 'Enterprise';
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  representative: string;
  notes: string;
}

export interface Opportunity {
  id: string;
  customerId: string;
  customer?: Customer;
  title: string;
  estimatedValue: number;
  stage: string;
  surveyDate?: string;
  surveyNotes?: string;
}

export interface QuotationItem {
  id?: string;
  quotationId?: string;
  category: string;
  workName: string;
  unit: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
  coefficient: number;
  totalVolume?: number;
  unitPrice: number;
  totalPrice?: number;
  formula?: string;
  notes?: string;
}

export interface Quotation {
  id: string;
  quotationCode: string;
  customerId: string;
  customer?: Customer;
  version: number;
  title: string;
  totalAmount: number;
  discountPercent: number;
  finalAmount: number;
  status: string;
  notes?: string;
  items: QuotationItem[];
}

export interface ContractPaymentTerm {
  id: string;
  stageNumber: number;
  description: string;
  percentage: number;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  customerId: string;
  customer?: Customer;
  quotationId: string;
  quotation?: Quotation;
  totalValue: number;
  advancePayment: number;
  signedDate: string;
  startDate: string;
  endDate: string;
  status: string;
  projectId?: string;
  paymentTerms: ContractPaymentTerm[];
}

export interface ProjectTask {
  id: string;
  projectId: string;
  taskCode: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  plannedVolume: number;
  actualVolume: number;
  unit: string;
  progressPercentage: number;
  status: string;
  priority: string;
}

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  contractId: string;
  contract?: Contract;
  customerId: string;
  customer?: Customer;
  budget: number;
  actualCost: number;
  progressPercentage: number;
  status: string;
  startDate: string;
  endDate: string;
  projectManagerId?: string;
  tasks: ProjectTask[];
}

export interface DailyLogWorker {
  id?: string;
  teamName: string;
  workerCount: number;
  workDescription: string;
  hoursWorked: number;
}

export interface DailyLogMaterial {
  id?: string;
  materialName: string;
  unit: string;
  quantity: number;
  supplier: string;
}

export interface DailyLogPhoto {
  id?: string;
  photoUrl: string;
  caption: string;
}

export interface DailyLog {
  id: string;
  projectId: string;
  project?: Project;
  logDate: string;
  weather: string;
  shift: string;
  generalNotes: string;
  incidentReport: string;
  status: string;
  createdByUser?: User;
  approvedByUser?: User;
  workers: DailyLogWorker[];
  materials: DailyLogMaterial[];
  photos: DailyLogPhoto[];
}

export interface ExecutiveStats {
  totalProjects: number;
  activeProjects: number;
  totalContractValue: number;
  totalReceived: number;
  totalReceivables: number;
  totalPayables: number;
  delayedTasks: number;
  cashflowRatio: number;
}

export interface DebtRecord {
  id: string;
  partnerName: string;
  type: string;
  originalAmount: number;
  paidAmount: number;
  remainingDebt: number;
  dueDate: string;
}

export interface DocumentRecord {
  id: string;
  documentName: string;
  category: string;
  filePath: string;
  fileExtension: string;
  fileSizeBytes: number;
  version: number;
}
