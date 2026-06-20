export interface RecurringExpense {
    id: number;
    name: string;
    description: string | null;
    amount: number;
    category: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateRecurringExpenseRequest {
    name: string;
    description: string | null;
    amount: number;
    category: string;
}

export interface UpdateRecurringExpenseRequest {
    name: string;
    description: string | null;
    amount: number;
    category: string;
    isActive: boolean;
}
