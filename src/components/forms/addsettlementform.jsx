import React, { useState } from 'react';
import { validateAmount, validatePersonName } from '../../services/validation';

const AddSettlementForm = ({ initialData, onSubmit, onCancel, isEdit = false }) => {
  const [form, setForm] = useState({
    person_name: initialData?.person_name || '',
    amount:      initialData?.amount      || '',
    debt_date:   initialData?.debt_date   || '',
    debt_type:   initialData?.debt_type   || 'lent',
    debt_status: initialData?.debt_status || 'pending',
  });
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: null })); };

  const validate = () => {
    const e = {};
    const n = validatePersonName(form.person_name); if (n.length) e.person_name = n[0];
    const a = validateAmount(form.amount);           if (a.length) e.amount = a[0];
    if (!form.debt_date) e.debt_date = 'Date is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await onSubmit({ person_name: form.person_name, amount: Number(form.amount), debt_date: form.debt_date, debt_type: form.debt_type, debt_status: form.debt_status });
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid" style={{ padding: '20px 22px 0' }}>
        {/* Person name */}
        <div className="form-group">
          <label className="form-label">Person Name *</label>
          <input className="form-input" placeholder="e.g. Rahul" value={form.person_name} onChange={e => set('person_name', e.target.value)} />
          {errors.person_name && <span className="form-err">{errors.person_name}</span>}
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
          <input className="form-input" type="date" value={form.debt_date} onChange={e => set('debt_date', e.target.value)} />
          {errors.debt_date && <span className="form-err">{errors.debt_date}</span>}
        </div>
        {/* Type */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select" value={form.debt_type} onChange={e => set('debt_type', e.target.value)}>
            <option value="lent">Lent (I gave money)</option>
            <option value="borrowed">Borrowed (I owe money)</option>
          </select>
        </div>
        {/* Status */}
        <div className="form-group full">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.debt_status} onChange={e => set('debt_status', e.target.value)}>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>
      <div className="modal-foot">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving…' : isEdit ? 'Update' : 'Add Settlement'}</button>
      </div>
    </form>
  );
};

export default AddSettlementForm;
