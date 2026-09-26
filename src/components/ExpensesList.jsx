import React, { useState } from 'react'
import { remainingBalance } from '../lib/storage'
import Modal from './Modal'
import TwoStepConfirm from './TwoStepConfirm'
import EditExpenseOverlay from './EditExpenseOverlay'
import CountUp from './CountUp'

export default function ExpensesList({ state, onEdit, onDelete, onAdd }) {
  function formatDate(d) {
    if (!d) return ''
    const [y, m, day] = d.split('-')
    return `${day}/${m}/${y.slice(2)}`
  }
  // optional onReorder callback provided by parent to persist new ordering
  const onReorder = arguments[0].onReorder || null
  const month = state.currentMonth
  const remaining = remainingBalance(month)
  const [search, setSearch] = React.useState('')
  const [filterCategory, setFilterCategory] = React.useState('')
  const [sortBy, setSortBy] = React.useState('date')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [editItem, setEditItem] = useState(null)

  function handleDelete(e) {
    setToDelete(e)
    setConfirmOpen(true)
  }

  function confirmDelete() {
    if (toDelete) onDelete(toDelete.id)
    setToDelete(null)
    setConfirmOpen(false)
  }

  function startEdit(e) {
    setEditItem(e)
  }

  function finishEdit(updated) {
    onEdit(updated)
    setEditItem(null)
  }

  // drag and drop handlers for reordering
  const dragIndexRef = React.useRef(null)
  function onDragStart(e, idx) {
    dragIndexRef.current = idx
    e.dataTransfer.effectAllowed = 'move'
    // visual
    const node = e.currentTarget
    if (node && node.classList) node.classList.add('dragging')
  }
  function onDragOver(e) {
    e.preventDefault()
  }
  function onDrop(e, idx) {
    e.preventDefault()
    const from = dragIndexRef.current
    const to = idx
    if (from == null || to == null || from === to) return
    const items = Array.from(month.expenses)
    const [moved] = items.splice(from, 1)
    items.splice(to, 0, moved)
    if (onReorder) onReorder(items)
    dragIndexRef.current = null
    // remove any dragging class on rows
    const rows = document.querySelectorAll('.expense-row.dragging')
    rows.forEach(r => r.classList.remove('dragging'))
  }

  function onDragEnd(e) {
    dragIndexRef.current = null
    const node = e.currentTarget
    if (node && node.classList) node.classList.remove('dragging')
  }

  const totalAvailable = (month.startingBalance || 0) + (month.carriedBalance || 0)
  const spent = (month.expenses || []).reduce((s, e) => s + Number(e.price || 0), 0)
  const percent = totalAvailable ? Math.min(100, Math.round((spent / totalAvailable) * 100)) : 0

  return (
    <div>
      <div className="card" role="region" aria-label="Expenses summary">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div className="muted">Available</div>
            <div className="summary-amount"><CountUp value={totalAvailable} formatter={v => `₹${v.toFixed(2)}`} /></div>
          </div>
          <div style={{ flex: 1, margin: '0 16px' }}>
            <div className="progress"><div className="progress-bar" style={{ width: `${percent}%` }} /></div>
            <div className="progress-label"><span className="muted">Spent</span><strong>{percent}%</strong></div>
          </div>
          <div>
            <button className="btn btn-primary" onClick={onAdd}>Add Expense</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {month.expenses && month.expenses.length > 0 ? (
                month.expenses
                  .filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
                  .filter(e => !filterCategory || e.category === filterCategory)
                  .sort((a, b) => {
                    if (sortBy === 'date') return a.date < b.date ? 1 : -1
                    if (sortBy === 'price') return Number(b.price) - Number(a.price)
                    return 0
                  })
                  .map((e, idx) => (
                    <tr key={e.id} className="expense-row" style={{ borderBottom: '1px solid var(--border)' }} draggable onDragStart={(ev) => onDragStart(ev, idx)} onDragEnd={onDragEnd} onDragOver={onDragOver} onDrop={(ev) => onDrop(ev, idx)}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{e.title}</div>
                        <div className="muted">{formatDate(e.date)}</div>
                      </td>
                      <td>{formatDate(e.date)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: 99,
                            fontSize: 12,
                            fontWeight: 600,
                            background: e.category === 'Income' ? '#DEF7EC' : (state.categoryColors?.[e.category] ? `${state.categoryColors[e.category]}20` : '#f3f4f6'),
                            color: e.category === 'Income' ? '#03543F' : (state.categoryColors?.[e.category] || '#374151'),
                            border: `1px solid ${e.category === 'Income' ? 'transparent' : (state.categoryColors?.[e.category] || '#e5e7eb')}`
                          }}>
                            {e.type === 'income' ? 'Income' : e.category}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', color: e.type === 'income' ? 'var(--success)' : 'inherit', fontWeight: e.type === 'income' ? 700 : 400 }}>
                        {e.type === 'income' ? '+' : ''}₹{Number(e.price).toFixed(2)}
                      </td>
                      <td>
                        <button className="btn" onClick={() => startEdit(e)}>Edit</button>
                        <button className="btn btn-ghost" onClick={() => handleDelete(e)}>Delete</button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr><td colSpan={5} className="muted">No expenses yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <label>Search</label>
        <input value={search} onChange={e => setSearch(e.target.value)} />
        <label>Filter</label>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All</option>
          {state.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label>Sort</label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Date</option>
          <option value="price">Price</option>
        </select>
      </div>
      <TwoStepConfirm
        open={confirmOpen}
        title={toDelete?.type === 'income' ? "Delete Income" : "Delete Expense"}
        itemSummary={<div><strong>{toDelete?.title}</strong> — {toDelete?.price} on {toDelete?.date}</div>}
        detailsNode={<div>Category: {toDelete?.category}</div>}
        onClose={() => { setConfirmOpen(false); setToDelete(null) }}
        onDelete={confirmDelete}
      />

      {editItem && <EditExpenseOverlay expense={editItem} onClose={() => setEditItem(null)} onSave={finishEdit} state={state} categories={state.categories} />}
    </div >
  )
}
