import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/authcontext';
import expensesService from '../services/expenseService';
import settlementsService from '../services/settlementService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

/* ── helpers ── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};
const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const TAG_COLORS = ['#d4a24c','#3ddc84','#ff6b6b','#5b9fed','#a78bfa','#ec4899','#14b8a6','#f0b429'];

const buildMonthlyData = (expenses) => {
  const map = {};
  expenses.forEach((e) => {
    if (!e.expense_date) return;
    const d   = new Date(e.expense_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!map[key]) map[key] = { key, label, amount: 0 };
    map[key].amount += Number(e.amount) || 0;
  });
  return Object.values(map).sort((a, b) => a.key.localeCompare(b.key)).slice(-6);
};

const buildTagData = (expenses) => {
  const map = {};
  expenses.forEach((e) => {
    const tag = e.tag_name || 'Untagged';
    map[tag] = (map[tag] || 0) + (Number(e.amount) || 0);
  });
  return Object.entries(map).map(([name, value], i) => ({ name, value, color: TAG_COLORS[i % TAG_COLORS.length] }));
};

/* ── Custom tooltips ── */
const LineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)', padding: '10px 14px' }}>
      <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>{label}</p>
      <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>{fmtINR(payload[0].value)}</p>
    </div>
  );
};
const PieTooltipCustom = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)', padding: '10px 14px' }}>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '3px' }}>{payload[0].name}</p>
      <p style={{ fontSize: '14px', fontWeight: '700', color: payload[0].payload.color, fontFamily: 'var(--font-mono)' }}>{fmtINR(payload[0].value)}</p>
    </div>
  );
};

/* ── Dashboard ── */
const Dashboard = () => {
  const { user } = useAuth();
  const [expenses,    setExpenses]    = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [chartKey,    setChartKey]    = useState(0);

  useEffect(() => {
    setLoading(true);
    setChartKey(k => k + 1);
    (async () => {
      const [expR, setR] = await Promise.allSettled([
        expensesService.get_expenses(),
        settlementsService.get_settlements(),
      ]);
      if (expR.status === 'fulfilled') setExpenses(expR.value.expenses || expR.value || []);
      if (setR.status === 'fulfilled') setSettlements(setR.value.debts   || setR.value   || []);
      setLoading(false);
    })();
  }, []);

  const totalSpent = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const now = new Date();
  const thisMonth = expenses
    .filter(e => { if (!e.expense_date) return false; const d = new Date(e.expense_date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const youOwe    = settlements.filter(s => s.debt_type === 'borrowed' && s.debt_status === 'pending').reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const owedToYou = settlements.filter(s => s.debt_type === 'lent'     && s.debt_status === 'pending').reduce((s, e) => s + (Number(e.amount) || 0), 0);

  const monthlyData = buildMonthlyData(expenses);
  const tagPieData  = buildTagData(expenses);

  return (
    <>
      {/* Page header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{getGreeting()}, {user?.username}</h1>
          <p className="page-sub">Here's your financial snapshot</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-row">
        {[
          { cls:'a', icon: <CreditCard size={18} />, label:'TOTAL SPENT', val: loading ? '—' : fmtINR(totalSpent) },
          { cls:'r', icon: <Calendar size={18} />,   label:'THIS MONTH',  val: loading ? '—' : fmtINR(thisMonth)  },
          { cls:'r', icon: <ArrowUpRight size={18} />, label:'YOU OWE',     val: loading ? '—' : fmtINR(youOwe)     },
          { cls:'g', icon: <ArrowDownLeft size={18} />, label:'OWED TO YOU', val: loading ? '—' : fmtINR(owedToYou)  },
        ].map((c) => (
          <div key={c.label} className={`stat-card ${c.cls}`}>
            <div className="stat-icon-wrap">{c.icon}</div>
            <div className="stat-label">{c.label}</div>
            {loading
              ? <div className="skel" style={{ height: '30px', width: '70%', marginTop: '4px' }} />
              : <div className="stat-val">{c.val}</div>
            }
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>

        {/* Line chart */}
        <div className="card">
          <div className="chart-head">
            <div>
              <div className="card-title">Spend Outflow Analytics</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-faint)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>Monthly expenditure trend</div>
            </div>
            <Link to="/expenses" style={{ fontSize: '0.74rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>Last 6 Months</Link>
          </div>
          {loading ? (
            <div className="skel" style={{ height: '210px' }} />
          ) : monthlyData.length === 0 ? (
            <div style={{ height: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '0.85rem' }}>No expense data yet</div>
          ) : (
            <ResponsiveContainer key={`line-${chartKey}`} width="100%" height={210}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" tick={{ fill: '#4a5060', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a5060', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                <Tooltip content={<LineTooltip />} />
                <Line type="monotone" dataKey="amount" stroke="#d4a24c" strokeWidth={2.5}
                  dot={{ fill: '#d4a24c', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#d4a24c', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart */}
        <div className="card">
          <div className="chart-head">
            <div>
              <div className="card-title">Spending by Tag</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-faint)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>Category breakdown</div>
            </div>
            <Link to="/tags" style={{ fontSize: '0.74rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>Manage →</Link>
          </div>
          {loading ? (
            <div className="skel" style={{ height: '210px' }} />
          ) : tagPieData.length === 0 ? (
            <div style={{ height: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '0.85rem' }}>No tagged expenses yet</div>
          ) : (
            <ResponsiveContainer key={`pie-${chartKey}`} width="100%" height={210}>
              <PieChart>
                <Pie data={tagPieData} cx="50%" cy="45%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {tagPieData.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<PieTooltipCustom />} />
                <Legend iconType="circle" iconSize={7}
                  formatter={(val) => <span style={{ color: 'var(--text-faint)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom: recent expenses + pending settlements */}
      <div className="dash-grid">
        <div className="card reveal">
          <div className="chart-head">
            <div className="card-title">Recent Expenses</div>
            <Link to="/expenses">View all →</Link>
          </div>
          {loading ? [1,2,3].map(i => <div key={i} className="skel skel-row" />) : expenses.length === 0
            ? <p style={{ color: 'var(--text-faint)', fontSize: '0.84rem' }}>No expenses yet.</p>
            : expenses.slice(0, 5).map(exp => (
              <div key={exp.id} className="recent-item">
                <div className="recent-dot" />
                <div className="recent-text">
                  <div>{exp.tag_name || 'Untagged'}</div>
                  <div className="recent-tag">{exp.expense_date} · {exp.payment_type}</div>
                </div>
                <div className="recent-amt">−{fmtINR(exp.amount)}</div>
              </div>
            ))
          }
        </div>

        <div className="card reveal">
          <div className="chart-head">
            <div className="card-title">Pending Settlements</div>
            <Link to="/settlements">View all →</Link>
          </div>
          {loading ? [1,2,3].map(i => <div key={i} className="skel skel-row" />) : settlements.filter(s => s.debt_status === 'pending').length === 0
            ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                <CheckCircle2 size={16} color="var(--green)" />
                <span>All debts settled!</span>
              </div>
            )
            : settlements.filter(s => s.debt_status === 'pending').slice(0, 5).map(s => (
              <div key={s.id} className="recent-item">
                <div className="recent-dot" style={{ background: s.debt_type === 'lent' ? 'var(--green)' : 'var(--red)' }} />
                <div className="recent-text">
                  <div>{s.person_name}</div>
                  <div className="recent-tag">{s.debt_type === 'lent' ? 'Owes you' : 'You owe'} · {s.debt_date}</div>
                </div>
                <div className="recent-amt" style={{ color: s.debt_type === 'lent' ? 'var(--green)' : 'var(--red)' }}>
                  {s.debt_type === 'lent' ? '+' : '−'}{fmtINR(s.amount)}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
};

export default Dashboard;