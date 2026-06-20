import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { RecurringExpense } from '../../types';
import RecurringExpenseForm from './RecurringExpenseForm';

export default function RecurringExpensesPage() {
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState<RecurringExpense | null>(null);
    const [showForm, setShowForm] = useState(false);

    const { data: expenses = [], isLoading } = useQuery({
        queryKey: ['recurring-expenses'],
        queryFn: () => api.get<RecurringExpense[]>('/api/recurring-expenses'),
    });

    const toggleMutation = useMutation({
        mutationFn: (id: number) => api.patch<void>(`/api/recurring-expenses/${id}/toggle`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/api/recurring-expenses/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] }),
    });

    function openCreate() {
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(expense: RecurringExpense) {
        setEditing(expense);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditing(null);
    }

    function onSaved() {
        queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] });
        closeForm();
    }

    const activeExpenses = expenses.filter(e => e.isActive);
    const monthlyTotal = activeExpenses.reduce((sum, e) => sum + e.amount, 0);

    if (isLoading) return <p>Loading…</p>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Recurring Expenses</h1>
                    {expenses.length > 0 && (
                        <p className="page-subtitle">
                            {activeExpenses.length} active · ${monthlyTotal.toFixed(2)}/month
                        </p>
                    )}
                </div>
                <button className="btn btn-primary" onClick={openCreate}>+ Add expense</button>
            </div>

            {expenses.length === 0 ? (
                <div className="empty-state">
                    <p>No recurring expenses yet. Add your tools, subscriptions, and services.</p>
                </div>
            ) : (
                <ul className="expense-list">
                    {expenses.map(expense => (
                        <li
                            key={expense.id}
                            className={`expense-item${expense.isActive ? '' : ' expense-item--inactive'}`}
                        >
                            <div className="expense-info">
                                <div className="expense-name">{expense.name}</div>
                                <div className="expense-meta">
                                    <span className="expense-category">{expense.category}</span>
                                    {expense.description && (
                                        <span className="expense-desc">{expense.description}</span>
                                    )}
                                </div>
                            </div>
                            <div className="expense-amount">${expense.amount.toFixed(2)}</div>
                            <span className={`badge ${expense.isActive ? 'badge-active' : 'badge-inactive'}`}>
                                {expense.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <div className="expense-actions">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => toggleMutation.mutate(expense.id)}
                                    disabled={toggleMutation.isPending}
                                >
                                    {expense.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button className="btn btn-ghost" onClick={() => openEdit(expense)}>
                                    Edit
                                </button>
                                <button
                                    className="btn btn-ghost btn-danger"
                                    onClick={() => deleteMutation.mutate(expense.id)}
                                    disabled={deleteMutation.isPending}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {showForm && (
                <RecurringExpenseForm
                    expense={editing}
                    onClose={closeForm}
                    onSaved={onSaved}
                />
            )}
        </div>
    );
}
