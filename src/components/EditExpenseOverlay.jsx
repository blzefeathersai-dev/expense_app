import React, { useState } from 'react'

export default function EditExpenseOverlay({ expense, onClose, onSave, categories, state }) {
  const [title, setTitle] = useState(expense.title)
  const [price, setPrice] = useState(expense.price)
  const [date, setDate] = useState(expense.date)
  const [category, setCategory] = useState(expense.category)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  function submit(e) {
    e.preventDefault()
    onSave({ ...expense, title, price: Number(price), date, category })
  }

  return (
    <div className="add-overlay open">
      <form className="add-form card" onSubmit={submit}>
        <h3>Edit Expense</h3>
        <label htmlFor="edit-title">Title</label>
        <input id="edit-title" aria-label="Title" autoFocus value={title} onChange={e => setTitle(e.target.value)} />
        <label htmlFor="edit-price">Price</label>
        <input id="edit-price" aria-label="Price" value={price} onChange={e => setPrice(e.target.value)} type="number" />
        <label htmlFor="edit-date">Date</label>
        <input id="edit-date" aria-label="Date" value={date} onChange={e => setDate(e.target.value)} type="date" />
        <label htmlFor="edit-category">Category</label>
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            {category ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: state?.categoryColors?.[category] || '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                  {state?.categoryIcons?.[category] || ''}
                </div>
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
              {(categories || []).map(c => (
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
                  {/* Use state.categoryColors for the dropdown items as well */}
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: state?.categoryColors?.[c] || '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                    {state?.categoryIcons?.[c] || ''}
                  </div>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
