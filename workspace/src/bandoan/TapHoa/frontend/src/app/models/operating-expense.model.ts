export interface OperatingExpense {
    id: string;
    name: string;
    type: OperatingExpenseType;
    amount: number;
    month: number;
    year: number;
    dueDate?: string;
    paidDate?: string;
    paymentStatus: ExpensePaymentStatus;
    notes?: string;
    createdBy?: string;
    createdDate?: string;
}

export enum OperatingExpenseType {
    Fixed = 1,
    Variable = 2
}

export enum ExpensePaymentStatus {
    Pending = 1,
    Paid = 2,
    Overdue = 3
}

export interface ExpenseSummary {
    month: number;
    year: number;
    totalFixed: number;
    totalVariable: number;
    totalAmount: number;
    totalPaid: number;
    totalUnpaid: number;
    categories: ExpenseCategorySummary[];
}

export interface ExpenseCategorySummary {
    name: string;
    amount: number;
    paymentStatus: number;
}
