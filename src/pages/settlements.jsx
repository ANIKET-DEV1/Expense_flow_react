import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  X,
  Scale,
} from 'lucide-react';
import settlementsService from '../services/settlementService';
import AddSettlementForm from '../components/forms/addsettlementform';

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Settlements = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [showForm,    setShowForm]    = useState(false);
  const [editItem,    setEditItem]    = useState(null);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'PAID'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'LENT' | 'BORROWED'

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const data = await settlementsService.get_settlements();
      setSettlements(data.debts || data || []);
    } catch {
      setError('Failed to load settlements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this settlement record?')) return;
    try {
      await settlementsService.del_settlements(id);
      setSettlements((p) => p.filter((s) => s.id !== id));
    } catch {
      alert('Failed to delete settlement.');
    }
  };

  const handleAdd = async (data) => {
    try {
      await settlementsService.add_settlements(data);
      setShowForm(false);
      fetchSettlements();
    } catch {
      alert('Failed to add settlement.');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await settlementsService.update_settlements(id, data);
      setEditItem(null);
      fetchSettlements();
    } catch {
      alert('Failed to update settlement.');
    }
  };

  // KPIs
  const youOwe = useMemo(() => {
    return settlements
      .filter((s) => (s.debt_type || '').toLowerCase() === 'borrowed' && (s.debt_status || '').toLowerCase() === 'pending')
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  }, [settlements]);

  const owedToYou = useMemo(() => {
    return settlements
      .filter((s) => (s.debt_type || '').toLowerCase() === 'lent' && (s.debt_status || '').toLowerCase() === 'pending')
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  }, [settlements]);

  const netBalance = useMemo(() => {
    return owedToYou - youOwe;
  }, [owedToYou, youOwe]);

  const settledTotal = useMemo(() => {
    return settlements
      .filter((s) => (s.debt_status || '').toLowerCase() === 'paid')
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  }, [settlements]);

  // Filtered List
  const filteredSettlements = useMemo(() => {
    return settlements.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (s.person_name && s.person_name.toLowerCase().includes(q));

      const status = (s.debt_status || '').toLowerCase();
      const matchesTab =
        activeTab === 'ALL' ||
        (activeTab === 'PENDING' && status === 'pending') ||
        (activeTab === 'PAID' && status === 'paid');

      const type = (s.debt_type || '').toLowerCase();
      const matchesType =
        typeFilter === 'ALL' ||
        (typeFilter === 'LENT' && type === 'lent') ||
        (typeFilter === 'BORROWED' && type === 'borrowed');

      return matchesSearch && matchesTab && matchesType;
    });
  }, [settlements, searchQuery, activeTab, typeFilter]);

  const isOpen = showForm || !!editItem;

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Settlements</h1>
          <p className="page-sub">Track who owes whom and balance peer debts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={15} strokeWidth={2.5} />
          Add Settlement
        </button>
      </div>

      {/* ── 4 KPI Stat Cards ── */}
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
        {/* YOU OWE */}
        <div className="stat-card r">
          <div className="stat-icon-wrap">
            <ArrowUpRight size={17} />
          </div>
          <div className="stat-label">YOU OWE (PENDING)</div>
          {loading ? (
            <div className="skel" style={{ height: 28, width: '70%' }} />
          ) : (
            <div className="stat-val" style={{ color: 'var(--red)' }}>
              {fmtINR(youOwe)}
            </div>
          )}
        </div>

        {/* OWED TO YOU */}
        <div className="stat-card g">
          <div className="stat-icon-wrap">
            <ArrowDownLeft size={17} />
          </div>
          <div className="stat-label">OWED TO YOU</div>
          {loading ? (
            <div className="skel" style={{ height: 28, width: '70%' }} />
          ) : (
            <div className="stat-val" style={{ color: 'var(--green)' }}>
              {fmtINR(owedToYou)}
            </div>
          )}
        </div>

        {/* NET BALANCE */}
        <div className="stat-card a">
          <div className="stat-icon-wrap">
            <Scale size={17} />
          </div>
          <div className="stat-label">NET BALANCE</div>
          {loading ? (
            <div className="skel" style={{ height: 28, width: '70%' }} />
          ) : (
            <div
              className="stat-val"
              style={{ color: netBalance >= 0 ? 'var(--green)' : 'var(--red)' }}
            >
              {netBalance >= 0 ? `+${fmtINR(netBalance)}` : `-${fmtINR(Math.abs(netBalance))}`}
            </div>
          )}
        </div>

        {/* SETTLED / PAID */}
        <div className="stat-card b">
          <div className="stat-icon-wrap">
            <CheckCircle2 size={17} />
          </div>
          <div className="stat-label">SETTLED TOTAL</div>
          {loading ? (
            <div className="skel" style={{ height: 28, width: '70%' }} />
          ) : (
            <div className="stat-val" style={{ color: 'var(--blue)' }}>
              {fmtINR(settledTotal)}
            </div>
          )}
        </div>
      </div>

      {/* ── Segment Tabs + Search & Filters Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {/* Left: Status Segment tabs */}
        <div className="seg-tabs" style={{ marginBottom: 0 }}>
          <button
            className={`seg-tab${activeTab === 'ALL' ? ' active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            All
          </button>
          <button
            className={`seg-tab${activeTab === 'PENDING' ? ' active' : ''}`}
            onClick={() => setActiveTab('PENDING')}
          >
            Pending
          </button>
          <button
            className={`seg-tab${activeTab === 'PAID' ? ' active' : ''}`}
            onClick={() => setActiveTab('PAID')}
          >
            Settled (Paid)
          </button>
        </div>

        {/* Right: Search & Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 480, justifyContent: 'flex-end' }}>
          {/* Search box */}
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 11,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-faint)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: 34,
                paddingRight: searchQuery ? 30 : 12,
                paddingTop: 8,
                paddingBottom: 8,
                fontSize: '0.82rem',
                borderRadius: 'var(--r-sm)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-faint)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Type dropdown */}
          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              width: 'auto',
              minWidth: 140,
              paddingTop: 8,
              paddingBottom: 8,
              fontSize: '0.82rem',
              borderRadius: 'var(--r-sm)',
            }}
          >
            <option value="ALL">All Types</option>
            <option value="LENT">Lent (I gave)</option>
            <option value="BORROWED">Borrowed (I owe)</option>
          </select>
        </div>
      </div>

      {/* ── Modal (Add / Edit) ── */}
      <div className={`overlay${isOpen ? ' open' : ''}`}>
        <div className="modal">
          <div className="modal-head">
            <span className="modal-title">{editItem ? 'Update Settlement' : 'Add Settlement'}</span>
            <button
              className="modal-close"
              onClick={() => {
                setShowForm(false);
                setEditItem(null);
              }}
            >
              <X size={16} />
            </button>
          </div>
          <AddSettlementForm
            initialData={editItem}
            isEdit={!!editItem}
            onSubmit={editItem ? (d) => handleUpdate(editItem.id, d) : handleAdd}
            onCancel={() => {
              setShowForm(false);
              setEditItem(null);
            }}
          />
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="card">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skel skel-row" />
          ))}
        </div>
      )}

      {!loading && error && <div className="err-box show">{error}</div>}

      {/* ── Empty ── */}
      {!loading && !error && filteredSettlements.length === 0 && (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <Scale size={36} color="var(--gold)" style={{ opacity: 0.7 }} />
            </div>
            <h3>No settlements found</h3>
            <p>
              {searchQuery || activeTab !== 'ALL' || typeFilter !== 'ALL'
                ? 'Try adjusting your search query or filters'
                : 'Start tracking shared expenses and debts'}
            </p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add Settlement
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {!loading && filteredSettlements.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Person Name</th>
                  <th>Amount</th>
                  <th>Direction / Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'center', width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSettlements.map((s) => {
                  const isLent = (s.debt_type || '').toLowerCase() === 'lent';
                  const isPaid = (s.debt_status || '').toLowerCase() === 'paid';
                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {s.person_name}
                      </td>
                      <td
                        className="mono"
                        style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: isLent ? 'var(--green)' : 'var(--red)',
                        }}
                      >
                        {isLent ? '+' : '−'}
                        {fmtINR(s.amount)}
                      </td>
                      <td>
                        <span className={`badge ${isLent ? 'bg' : 'br'}`} style={{ gap: 4 }}>
                          {isLent ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                          {isLent ? 'Lent (Gave)' : 'Borrowed (Owe)'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isPaid ? 'bg' : 'ba'}`} style={{ gap: 4 }}>
                          {isPaid ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                          {isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {s.debt_date || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setEditItem(s)}
                            title="Edit"
                            style={{ padding: '5px 8px' }}
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            title="Delete"
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 6,
                              background: 'rgba(255,107,107,0.08)',
                              border: '1px solid rgba(255,107,107,0.22)',
                              color: 'var(--red)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all var(--t)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,107,107,0.2)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,107,107,0.08)')}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default Settlements;