import React, { useState } from 'react';

const AddTagForm = ({ onSubmit, onCancel }) => {
  const [tagName,    setTagName]    = useState('');
  const [error,      setError]      = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = tagName.trim();
    if (!t)        { setError('Tag name is required'); return; }
    if (t.length < 2) { setError('At least 2 characters'); return; }
    setSubmitting(true);
    await onSubmit(t);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '20px 22px 0' }}>
        <div className="form-group">
          <label className="form-label">Tag Name *</label>
          <input
            className="form-input"
            value={tagName}
            onChange={e => { setTagName(e.target.value); setError(''); }}
            placeholder="e.g. Food, Travel, Rent"
          />
          {error && <span className="form-err">{error}</span>}
        </div>
      </div>
      <div className="modal-foot">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Adding…' : 'Add Tag'}</button>
      </div>
    </form>
  );
};

export default AddTagForm;
