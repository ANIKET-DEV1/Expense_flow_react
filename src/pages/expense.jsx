import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Receipt,
  Calendar,
  Banknote,
  Smartphone,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import expensesService from '../services/expenseService';
import tagsService from '../services/tagsService';
import AddExpenseForm from '../components/forms/addexpenseform';

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'tag' | 'month'
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [expandedGroups, setExpandedGroups] = useState({});

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [expR, tagR] = await Promise.allSettled([
        expensesService.get_expenses(),
        tagsService.get_tags(),
      ]);
      if (expR.status === 'fulfilled') setExpenses(expR.value.expenses || expR.value || []);
      if (tagR.status === 'fulfilled') setTags(tagR.value.tags || tagR.value || []);
    } catch {
      setError('Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await expensesService.del_expenses(id);
      setExpenses((p) => p.filter((e) => e.id !== id));
    } catch {
      alert('Failed to delete expense.');
    }
  };

  const handleAdd = async (data) => {
    try {
      await expensesService.add_expenses(data);
      setShowForm(false);
      fetchAll();
    } catch {
      alert('Failed to add expense.');
    }
  };

  // KPI Calculations
  const totalSpent = useMemo(() => {
    return expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const thisMonthSpent = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((e) => {
        if (!e.expense_date) return false;
        const d = new Date(e.expense_date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const cashSpent = useMemo(() => {
    return expenses
      .filter((e) => (e.payment_type || '').toUpperCase() === 'CASH')
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const digitalSpent = useMemo(() => {
    return expenses
      .filter((e) => (e.payment_type || '').toUpperCase() !== 'CASH')
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  }, [expenses]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      // Search query matches description or tag
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.tag_name && e.tag_name.toLowerCase().includes(q));

      // Payment type filter
      const p = paymentFilter.toUpperCase();
      const matchesPayment =
        p === 'ALL' || (e.payment_type || '').toUpperCase() === p;

      return matchesSearch && matchesPayment;
    });
  }, [expenses, searchQuery, paymentFilter]);

  // Grouped by Tag
  const groupedByTag = useMemo(() => {
    const map = {};
    filteredExpenses.forEach((e) => {
      const tag = e.tag_name || 'Untagged';
      if (!map[tag]) map[tag] = { tag, total: 0, items: [] };
      map[tag].total += Number(e.amount) || 0;
      map[tag].items.push(e);
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [filteredExpenses]);

  // Grouped by Month
  const groupedByMonth = useMemo(() => {
    const map = {};
    filteredExpenses.forEach((e) => {
      let key = 'Undated';
      let label = 'Undated';
      if (e.expense_date) {
        const d = new Date(e.expense_date);
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      }
      if (!map[key]) map[key] = { key, label, total: 0, items: [] };
      map[key].total += Number(e.amount) || 0;
      map[key].items.push(e);
    });
    return Object.values(map).sort((a, b) => b.key.localeCompare(a.key));
  }, [filteredExpenses]);

  const toggleGroup = (key) => {
    setExpandedGroups((p) => ({ ...p, [key]: !p[key] }));
  };

  const renderExpenseRows = (items) => (
    <table>
      <thead>
        <tr>
          <th>Context Label / Description</th>
          <th>Category Tag</th>
          <th>Method</th>
          <th>Value Date</th>
          <th>Sum Outflow</th>
          <th style={{ textAlign: 'center', width: '60px' }}>Delete</th>
        </tr>
      </thead>
      <tbody>
        {items.map((exp) => (
          <tr key={exp.id}>
            <td style={{ fontWeight: 600, color: 'var(--text)' }}>
              {exp.description || exp.tag_name || 'General Expense'}
            </td>
            <td>
              {exp.tag_name ? (
                <span className="badge ba" style={{ fontSize: '0.72rem', textTransform: 'lowercase' }}>
                  {exp.tag_name}
                </span>
              ) : (
                <span style={{ color: 'var(--text-faint)' }}>—</span>
              )}
            </td>
            <td style={{ color: 'var(--text-muted)' }}>
              {exp.payment_type === 'CASH'
                ? 'Cash'
                : exp.payment_type === 'UPI'
                ? 'UPI'
                : exp.payment_type === 'Card'
                ? 'Card'
                : exp.payment_type || '—'}
            </td>
            <td className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              {exp.expense_date || '—'}
            </td>
            <td className="mono" style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>
              {fmtINR(exp.amount)}
            </td>
            <td style={{ textAlign: 'center' }}>
              <button
                onClick={() => handleDelete(exp.id)}
                title="Delete record"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: 'rgba(255,107,107,0.08)',
                  border: '1px solid rgba(255,107,107,0.22)',
                  color: 'var(--red)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--t)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,107,107,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,107,107,0.08)';
                }}
              >
                <Trash2 size={13} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-sub">All your logged expenses</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={15} strokeWidth={2.5} />
          Add Expense
        </button>
      </div>

      {/* ── 4 KPI Stat Cards ── */}
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
        {/* TOTAL SPENT */}
        <div className="stat-card r">
          <div className="stat-icon-wrap">
            <Receipt size={17} />
          </div>
          <div className="stat-label">TOTAL SPENT</div>
          {loading ? (
            <div className="skel" style={{ height: 28, width: '70%' }} />
          ) : (
            <div className="stat-val" style={{ color: 'var(--red)' }}>
              {fmtINR(totalSpent)}
            </div>
          )}
        </div>

        {/* THIS MONTH */}
        <div className="stat-card a">
          <div className="stat-icon-wrap">
            <Calendar size={17} />
          </div>
          <div className="stat-label">THIS MONTH</div>
          {loading ? (
            <div className="skel" style={{ height: 28, width: '70%' }} />
          ) : (
            <div className="stat-val" style={{ color: 'var(--gold)' }}>
              {fmtINR(thisMonthSpent)}
            </div>
          )}
        </div>

        {/* CASH */}
        <div className="stat-card g">
          <div className="stat-icon-wrap">
            <Banknote size={17} />
          </div>
          <div className="stat-label">CASH</div>
          {loading ? (
            <div className="skel" style={{ height: 28, width: '70%' }} />
          ) : (
            <div className="stat-val" style={{ color: 'var(--green)' }}>
              {fmtINR(cashSpent)}
            </div>
          )}
        </div>

        {/* DIGITAL */}
        <div className="stat-card b">
          <div className="stat-icon-wrap">
            <Smartphone size={17} />
          </div>
          <div className="stat-label">DIGITAL</div>
          {loading ? (
            <div className="skel" style={{ height: 28, width: '70%' }} />
          ) : (
            <div className="stat-val" style={{ color: 'var(--blue)' }}>
              {fmtINR(digitalSpent)}
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
        {/* Left: Segment tabs */}
        <div className="seg-tabs" style={{ marginBottom: 0 }}>
          <button
            className={`seg-tab${activeTab === 'all' ? ' active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`seg-tab${activeTab === 'tag' ? ' active' : ''}`}
            onClick={() => setActiveTab('tag')}
          >
            By Tag
          </button>
          <button
            className={`seg-tab${activeTab === 'month' ? ' active' : ''}`}
            onClick={() => setActiveTab('month')}
          >
            By Month
          </button>
        </div>

        {/* Right: Search & Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 520, justifyContent: 'flex-end' }}>
          {/* Search box */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
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
              placeholder="Search tag or description..."
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

          {/* Payment dropdown */}
          <select
            className="form-select"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            style={{
              width: 'auto',
              minWidth: 160,
              paddingTop: 8,
              paddingBottom: 8,
              fontSize: '0.82rem',
              borderRadius: 'var(--r-sm)',
            }}
          >
            <option value="ALL">All payment types</option>
            <option value="CASH">Cash only</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
          </select>
        </div>
      </div>

      {/* ── Add Expense Modal ── */}
      <div className={`overlay${showForm ? ' open' : ''}`}>
        <div className="modal">
          <div className="modal-head">
            <span className="modal-title">Add Expense</span>
            <button className="modal-close" onClick={() => setShowForm(false)}>
              <X size={16} />
            </button>
          </div>
          <AddExpenseForm tags={tags} onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      </div>

      {/* ── Content Area ── */}
      {loading && (
        <div className="card">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skel skel-row" />
          ))}
        </div>
      )}

      {!loading && error && <div className="err-box show">{error}</div>}

      {/* ── Empty State ── */}
      {!loading && !error && filteredExpenses.length === 0 && (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <Receipt size={36} color="var(--gold)" style={{ opacity: 0.7 }} />
            </div>
            <h3>No expenses found</h3>
            <p>
              {searchQuery || paymentFilter !== 'ALL'
                ? 'Try adjusting your search query or filter'
                : 'Start tracking by adding your first expense'}
            </p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add Expense
            </button>
          </div>
        </div>
      )}

      {/* ── Tab 1: All View ── */}
      {!loading && !error && filteredExpenses.length > 0 && activeTab === 'all' && (
        <div className="card">
          <div className="table-wrap">{renderExpenseRows(filteredExpenses)}</div>
        </div>
      )}

      {/* ── Tab 2: By Tag View ── */}
      {!loading && !error && filteredExpenses.length > 0 && activeTab === 'tag' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {groupedByTag.map((group) => {
            const isOpen = expandedGroups[group.tag] !== false; // open by default
            return (
              <div key={group.tag} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Accordion header */}
                <div
                  onClick={() => toggleGroup(group.tag)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    background: 'var(--surface2)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center' }}>
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                    <span className="badge ba" style={{ fontSize: '0.78rem' }}>
                      {group.tag}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                      ({group.items.length} {group.items.length === 1 ? 'item' : 'items'})
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gold)' }}>
                    {fmtINR(group.total)}
                  </div>
                </div>

                {/* Accordion body */}
                {isOpen && (
                  <div className="table-wrap" style={{ borderTop: '1px solid var(--border)' }}>
                    {renderExpenseRows(group.items)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Tab 3: By Month View ── */}
      {!loading && !error && filteredExpenses.length > 0 && activeTab === 'month' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {groupedByMonth.map((group) => {
            const isOpen = expandedGroups[group.key] !== false; // open by default
            return (
              <div key={group.key} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Accordion header */}
                <div
                  onClick={() => toggleGroup(group.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    background: 'var(--surface2)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center' }}>
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
                      {group.label}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                      ({group.items.length} {group.items.length === 1 ? 'item' : 'items'})
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gold)' }}>
                    {fmtINR(group.total)}
                  </div>
                </div>

                {/* Accordion body */}
                {isOpen && (
                  <div className="table-wrap" style={{ borderTop: '1px solid var(--border)' }}>
                    {renderExpenseRows(group.items)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Expenses;