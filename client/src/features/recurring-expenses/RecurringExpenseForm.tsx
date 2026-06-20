import { useState } from 'react';
import { api } from '../../lib/api';
import type { RecurringExpense, CreateRecurringExpenseRequest, UpdateRecurringExpenseRequest } from '../../types';

interface Props {
    expense: RecurringExpense | null;
    onClose: () => void;
    onSaved: () => void;
}

const CATEGORIES = ['Software', 'Hardware', 'Subscription', 'Hosting', 'Other'];

export default function RecurringExpenseForm({ expense, onClose, onSaved }: Props) {
    const [name, setName] = useState(expense?.name ?? '');
    const [description, setDescription] = useState(expense?.description ?? '');
    const [amount, setAmount] = useState(expense ? expense.amount.toString() : '');
    const [category, setCategory] = useState(expense?.category ?? CATEGORIES[0]);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const isEdit = expense !== null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSaving(true);
        try {
            if (isEdit) {
                const body: UpdateRecurringExpenseRequest = {
                    name,
                    description: description.trim() || null,
                    amount: parseFloat(amount),
                    category,
                    isActive: expense.isActive,
                };
                await api.put(`/api/recurring-expenses/${expense.id}`, body);
            } else {
                const body: CreateRecurringExpenseRequest = {
                    name,
                    description: description.trim() || null,
                    amount: parseFloat(amount),
                    category,
                };
                await api.post('/api/recurring-expenses', body);
            }
            onSaved();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>{isEdit ? 'Edit expense' : 'New recurring expense'}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="form-label">
                        Name
                        <input
                            className="form-input"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="e.g. Adobe Creative Cloud"
                            autoFocus
                        />
                    </label>
                    <label className="form-label">
                        Category
                        <select
                            className="form-input"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </label>
                    <label className="form-label">
                        Monthly amount ($)
                        <input
                            className="form-input"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                            placeholder="0.00"
                        />
                    </label>
                    <label className="form-label">
                        Description (optional)
                        <input
                            className="form-input"
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="What is this for?"
                        />
                    </label>
                    {error && <p className="auth-error" role="alert">{error}</p>}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
