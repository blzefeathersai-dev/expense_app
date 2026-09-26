import React, { useState } from 'react'

export default function InitialBudget({ onSave }) {
  const [amount, setAmount] = useState('')

  function submit(e) {
    e.preventDefault()
    const num = Number(amount || 0)
    if (isNaN(num)) return alert('Enter a valid number')
    onSave(num)
  }

  return (
    <div className="add-overlay open">
      <form className="add-form card" onSubmit={submit}>
        <h3>Welcome — Set your first monthly budget</h3>
        <label>Budget amount</label>
        <input autoFocus value={amount} onChange={e=>setAmount(e.target.value)} type="number" aria-label="Initial budget amount" />
        <div style={{marginTop:12,display:'flex',gap:8}}>
          <button type="submit" className="btn btn-primary">Start</button>
        </div>
      </form>
    </div>
  )
}
