import React, { useState } from 'react'
import { makeExpense } from '../lib/storage'

export default function AddExpenseOverlay({ state, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState({})
  const [type, setType] = useState('expense')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  function submit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!price) newErrors.price = 'Price is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const exp = makeExpense({ title, price, date, category: category || 'Miscellaneous', type })
    onSave(exp)
  }

  return (
    <div className="add-overlay open">
      <form className="add-form card" onSubmit={submit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Add {type === 'income' ? 'Income' : 'Expense'}</h3>
          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 12, padding: 4 }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setType('expense')}
              style={{ padding: '6px 12px', background: type === 'expense' ? 'white' : 'transparent', boxShadow: type === 'expense' ? 'var(--shadow-sm)' : 'none', color: type === 'expense' ? 'var(--text-main)' : 'var(--text-muted)' }}
            >
              Expense
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setType('income')}
              style={{ padding: '6px 12px', background: type === 'income' ? 'white' : 'transparent', boxShadow: type === 'income' ? 'var(--shadow-sm)' : 'none', color: type === 'income' ? 'var(--text-main)' : 'var(--text-muted)' }}
            >
              Income
            </button>
          </div>
        </div>

        <label htmlFor="add-title">Title</label>
        <input
          id="add-title"
          aria-label="Title"
          autoFocus
          value={title}
          onChange={e => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })) }}
          style={{ borderColor: errors.title ? 'var(--danger)' : undefined }}
        />
        {errors.title && <div style={{ color: 'var(--danger)', fontSize: 13, marginTop: 8, marginBottom: 16 }}>{errors.title}</div>}

        <label htmlFor="add-price">Amount</label>
        <input
          id="add-price"
          aria-label="Price"
          value={price}
          onChange={e => { setPrice(e.target.value); setErrors(prev => ({ ...prev, price: '' })) }}
          type="number"
          style={{ borderColor: errors.price ? 'var(--danger)' : undefined }}
        />
        {errors.price && <div style={{ color: 'var(--danger)', fontSize: 13, marginTop: 8, marginBottom: 16 }}>{errors.price}</div>}

        <label htmlFor="add-date">Date</label>
        <input id="add-date" aria-label="Date" value={date} onChange={e => setDate(e.target.value)} type="date" />

        {type === 'expense' && (
          <>
            <label style={{ marginBottom: 8 }}>Category</label>
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                {category ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: state.categoryColors?.[category] || '#ccc' }} />
                    <span>{category}</span>
                  </div>
                ) : (
                  <span className="muted">Select Category...</span>
                )}
                <span style={{ fontSize: 12, transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
              </div>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                  background: 'white', border: '1px solid var(--border)', borderRadius: 12,
                  boxShadow: 'var(--shadow-lg)', maxHeight: 200, overflowY: 'auto', zIndex: 10
                }}>
                  {state.categories.map(c => (
                    <div
                      key={c}
                      onClick={() => { setCategory(c); setDropdownOpen(false) }}
                      style={{
                        padding: '10px 12px',
                        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                        background: category === c ? 'var(--bg)' : 'transparent',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = category === c ? 'var(--bg)' : 'transparent'}
                    >
                      <div style={{ width: 16, height: 16, borderRadius: 4, background: state.categoryColors?.[c] || '#ccc' }} />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: 12 }}>Save {type === 'income' ? 'Income' : 'Expense'}</button>
          <button type="button" className="btn btn-ghost" onClick={onClose} style={{ padding: 12 }}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
