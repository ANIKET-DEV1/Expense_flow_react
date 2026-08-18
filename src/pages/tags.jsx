import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Tag as TagIcon, Trash2, X, Layers, Sparkles } from 'lucide-react';
import tagsService from '../services/tagsService';
import AddTagForm from '../components/forms/addtagform';

const TAG_ACCENTS = [
  '#d4a24c',
  '#3ddc84',
  '#ff6b6b',
  '#5b9fed',
  '#a78bfa',
  '#ec4899',
  '#14b8a6',
  '#f0b429',
];

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await tagsService.get_tags();
      setTags(data.tags || data || []);
    } catch {
      setError('Failed to load tags.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async (tag_name) => {
    if (!window.confirm(`Delete tag "${tag_name}"?`)) return;
    try {
      await tagsService.del_tags(tag_name);
      setTags((p) => p.filter((t) => (t.tag_name || t) !== tag_name));
    } catch {
      alert('Failed to delete tag.');
    }
  };

  const handleAdd = async (tag_name) => {
    try {
      await tagsService.add_tags({ tag_name });
      setShowForm(false);
      fetchTags();
    } catch {
      alert('Failed to add tag.');
    }
  };

  const filteredTags = useMemo(() => {
    return tags.filter((t) => {
      const name = (t.tag_name || t || '').toLowerCase();
      return !searchQuery || name.includes(searchQuery.toLowerCase().trim());
    });
  }, [tags, searchQuery]);

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Tags Manager</h1>
          <p className="page-sub">
            {tags.length} custom category tag{tags.length !== 1 ? 's' : ''} to organise your spending
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={15} strokeWidth={2.5} />
          Add Tag
        </button>
      </div>

      {/* ── KPI Stat Row ── */}
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
        <div className="stat-card a">
          <div className="stat-icon-wrap">
            <Layers size={17} />
          </div>
          <div className="stat-label">TOTAL TAGS</div>
          {loading ? (
            <div className="skel" style={{ height: 28, width: '50%' }} />
          ) : (
            <div className="stat-val" style={{ color: 'var(--gold)' }}>
              {tags.length}
            </div>
          )}
        </div>

        <div className="stat-card g">
          <div className="stat-icon-wrap">
            <Sparkles size={17} />
          </div>
          <div className="stat-label">STATUS</div>
          <div className="stat-val" style={{ color: 'var(--green)', fontSize: '1.1rem' }}>
            Unlimited Active
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          gap: 12,
        }}
      >
        <div style={{ position: 'relative', maxWidth: 360, width: '100%' }}>
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
            placeholder="Search tags..."
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
      </div>

      {/* ── Add Tag Modal ── */}
      <div className={`overlay${showForm ? ' open' : ''}`}>
        <div className="modal">
          <div className="modal-head">
            <span className="modal-title">Add Tag</span>
            <button className="modal-close" onClick={() => setShowForm(false)}>
              <X size={16} />
            </button>
          </div>
          <AddTagForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      </div>

      {/* ── Loading Skeletons ── */}
      {loading && (
        <div className="tag-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skel" style={{ height: 44, width: 140, borderRadius: 'var(--r-sm)' }} />
          ))}
        </div>
      )}

      {!loading && error && <div className="err-box show">{error}</div>}

      {/* ── Empty State ── */}
      {!loading && !error && filteredTags.length === 0 && (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <TagIcon size={36} color="var(--gold)" style={{ opacity: 0.7 }} />
            </div>
            <h3>No tags found</h3>
            <p>
              {searchQuery
                ? 'No tags matched your search query'
                : 'Create tags to categorise your expenses into custom groups'}
            </p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add Tag
            </button>
          </div>
        </div>
      )}

      {/* ── Tag Cards Grid ── */}
      {!loading && filteredTags.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 14,
          }}
        >
          {filteredTags.map((tag, i) => {
            const name = tag.tag_name || tag;
            const accent = TAG_ACCENTS[i % TAG_ACCENTS.length];
            return (
              <div
                key={name}
                className="card"
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  transition: 'all var(--t)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `${accent}18`,
                      border: `1px solid ${accent}33`,
                      color: accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <TagIcon size={15} />
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      color: 'var(--text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {name}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(name)}
                  title={`Delete tag ${name}`}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: 'rgba(255,107,107,0.08)',
                    border: '1px solid rgba(255,107,107,0.22)',
                    color: 'var(--red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all var(--t)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,107,107,0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,107,107,0.08)')}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Tags;