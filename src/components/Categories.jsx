
import React, { useState } from 'react'
import { addCategory, deleteCategory, updateCategory } from '../lib/storage'
import TwoStepConfirm from './TwoStepConfirm'
import EditCategoryModal from './EditCategoryModal'

export default function Categories({ state, setState }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#60A5FA')
  const [icon, setIcon] = useState('🏷️')
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  // Deletion state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  function add() {
    if (!name.trim()) {
      setError('Category name is required')
      return
    }
    setError('')
    setState(addCategory(state, name, color, icon))
    setName('')
    setIcon('🏷️')
  }

  function confirmDel(n) {
    if (n === 'Miscellaneous') return alert('Cannot delete Miscellaneous')
    setItemToDelete(n)
    setConfirmOpen(true)
  }

  function doDelete() {
    if (itemToDelete) {
      setState(deleteCategory(state, itemToDelete))
    }
    setConfirmOpen(false)
    setItemToDelete(null)
  }

  function saveEdit(oldName, newName, newColor, newIcon) {
    if (!newName) return setEditing(null)
    setState(updateCategory(state, oldName, newName, newColor, newIcon))
    setEditing(null)
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Categories</h3>
          <div className="muted" style={{ fontSize: 13 }}>Manage your expense types</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
          {/* Manually add Income */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#10B981', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                <span style={{ color: 'white' }}>💰</span>
              </div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Income</span>
            </div>
          </div>
          {state.categories.map(c => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)' }}>
              {/* Editing handled via modal now */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: state.categoryColors?.[c] || '#ccc', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  <span>{state.categoryIcons?.[c] || '🏷️'}</span>
                </div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{c}</span>
              </div>
              {c !== 'Miscellaneous' && (
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost" onClick={() => setEditing(c)} style={{ padding: 8, borderRadius: 8 }} aria-label="Edit">✏️</button>
                  <button className="btn btn-ghost" onClick={() => confirmDel(c)} style={{ color: 'var(--danger)', padding: 8, borderRadius: 8 }} aria-label="Delete">🗑️</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="row category-input-row" style={{ background: 'var(--bg)', padding: 16, borderRadius: 16, border: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center', position: 'relative' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <input placeholder="New category name..." value={name} onChange={e => { setName(e.target.value); setError('') }} style={{ border: error ? '1px solid var(--danger)' : 'none', background: 'white', boxShadow: 'var(--shadow-sm)', width: '100%' }} />
            {error && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4, marginLeft: 4 }}>{error}</div>}
          </div>

          <input placeholder="Emoji" value={icon} onChange={e => { const chars = Array.from(e.target.value); setIcon(chars.length ? chars[chars.length - 1] : '') }} style={{ width: 60, flexShrink: 0, background: 'white', border: 'none', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }} />

          <div className="color-grid" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', width: 200 }}>
            {['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#64748B', '#000000'].map(c => (
              <div
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 24, height: 24, borderRadius: '50%', background: c,
                  cursor: 'pointer',
                  border: color === c ? '2px solid white' : '2px solid transparent',
                  boxShadow: color === c ? '0 0 0 2px var(--text-main)' : 'none',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </div>

          <button className="btn btn-primary" onClick={add} style={{ height: 44, padding: '0 24px', alignSelf: error ? 'flex-start' : 'center', width: 'auto' }}>+ Add</button>
        </div>
      </div>

      <TwoStepConfirm
        open={confirmOpen}
        title={`Delete Category "${itemToDelete}"?`}
        itemSummary={<div>All expenses in <strong>{itemToDelete}</strong> will be moved to <strong>Miscellaneous</strong>.</div>}
        onClose={() => setConfirmOpen(false)}
        onDelete={doDelete}
      />

      {editing && (
        <EditCategoryModal
          category={editing}
          color={state.categoryColors?.[editing] || '#60A5FA'}
          icon={state.categoryIcons?.[editing] || '🏷️'}
          onClose={() => setEditing(null)}
          onSave={(n, c, i) => saveEdit(editing, n, c, i)}
        />
      )}
    </div>
  )
}

