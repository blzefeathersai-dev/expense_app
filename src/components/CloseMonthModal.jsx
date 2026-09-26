import React, { useState } from 'react'

export default function CloseMonthModal({ open, onClose, onConfirm }) {
  const [budget, setBudget] = useState('')
  if (!open) return null
  return (
    <div className="add-overlay open" role="dialog" aria-modal="true" aria-label="Close month dialog">
      <form className="add-form card" onSubmit={(e)=>{ e.preventDefault(); onConfirm(budget); }}>
        <h3>Close month and start new</h3>
        <label htmlFor="close-budget">New month budget (optional)</label>
        <input id="close-budget" aria-label="New month budget" type="number" autoFocus value={budget} onChange={e=>setBudget(e.target.value)} />
        <div style={{marginTop:12,display:'flex',gap:8}}>
          <button type="submit" className="btn btn-primary">Confirm</button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
