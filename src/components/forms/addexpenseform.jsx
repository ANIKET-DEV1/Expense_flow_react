import React, { useState } from 'react';
import { validateAmount } from '../../services/validation';

const PAYMENT_TYPES = ['CASH', 'UPI', 'Card'];

const AddExpenseForm = ({ tags, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ tag_name:'', amount:'', description:'', payment_type:'CASH', expense_date:'' });
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: null })); };

  const validate = () => {
    const e = {};
    const a = validateAmount(form.amount); if (a.length) e.amount = a[0];
    if (!form.expense_date) e.expense_date = 'Date is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await onSubmit({ tag_name: form.tag_name || null, amount: Number(form.amount), description: form.description || null, payment_type: form.payment_type, expense_date: form.expense_date });
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* Tag */}
        <div className="form-group">
          <label className="form-label">Tag / Category</label>
          <select className="form-select" value={form.tag_name} onChange={e => set('tag_name', e.target.value)}>
            <option value="">— No tag —</option>
            {tags.map(t => { const n = t.tag_name || t; return <option key={n} value={n}>{n}</option>; })}
          </select>
        </div>
        {/* Payment type */}
        <div className="form-group">
          <label className="form-label">Payment Type</label>
          <select className="form-select" value={form.payment_type} onChange={e => set('payment_type', e.target.value)}>
            {PAYMENT_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
          </select>
        </div>
        {/* Amount */}
        <div className="form-group">
          <label className="form-label">Amount (₹) *</label>
          <input className="form-input" type="number" placeholder="e.g. 500" min="1" value={form.amount} onChange={e => set('amount', e.target.value)} />
          {errors.amount && <span className="form-err">{errors.amount}</span>}
        </div>
        {/* Date */}
        <div className="form-group">
          <label className="form-label">Date *</label>
          <input className="form-input" type="date" value={form.expense_date} onChange={e => set('expense_date', e.target.value)} />
          {errors.expense_date && <span className="form-err">{errors.expense_date}</span>}
        </div>
        {/* Description */}
        <div className="form-group full">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" placeholder="Optional notes..." rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
      </div>
      <div className="modal-foot">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Adding…' : 'Add Expense'}</button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
