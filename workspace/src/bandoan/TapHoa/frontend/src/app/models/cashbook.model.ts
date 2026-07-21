export interface CashBookEntry {
    id: string;
    entryDate: string;
    type: CashBookEntryType;
    category: string;
    amount: number;
    description?: string;
    referenceId?: string;
    referenceType?: string;
    shiftId?: string;
    createdBy?: string;
    createdDate?: string;
}

export enum CashBookEntryType {
    Income = 1,
    Expense = 2
}

export interface CashBookSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    openingBalance: number;
    closingBalance: number;
    incomeBreakdown: CashBookCategoryBreakdown[];
    expenseBreakdown: CashBookCategoryBreakdown[];
}

export interface CashBookCategoryBreakdown {
    category: string;
    amount: number;
    count: number;
}
