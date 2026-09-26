import React from 'react'
import html2canvas from 'html2canvas'
import { remainingBalance } from '../lib/storage'
import jsPDF from 'jspdf'
import TwoStepConfirm from './TwoStepConfirm'
export default function MonthDetail({ month, onBack, setState, state }) {
  function formatDate(d) {
    if (!d) return ''
    const [y, m, day] = d.split('-')
    return `${day}/${m}/${y.slice(2)}`
  }
  function exportPdf() {
    const el = document.getElementById('pdf-report')
    if (!el) return
    html2canvas(el, { scale: 2 }).then(canvas => {
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(img, 'PNG', 0, 0, w, h)
      pdf.save(`${month.name}.pdf`)
    })
  }

  const [confirmOpen, setConfirmOpen] = React.useState(false)
  function deleteMonth() {
    setConfirmOpen(true)
  }

  function doDelete() {
    if (!setState) {
      const raw = localStorage.getItem('expense_app_v1')
      if (!raw) return
      const s = JSON.parse(raw)
      s.pastMonths = s.pastMonths.filter(m => m.id !== month.id)
      localStorage.setItem('expense_app_v1', JSON.stringify(s))
      window.location.reload()
      return
    }
    setState(prev => ({ ...prev, pastMonths: prev.pastMonths.filter(m => m.id !== month.id) }))
    if (onBack) onBack()
  }

  const totalSpent = month.expenses.reduce((s, e) => s + Number(e.price || 0), 0)
  const remaining = remainingBalance(month)
  const totalAvailable = (month.startingBalance || 0) + (month.carriedBalance || 0)
  const pct = totalAvailable ? Math.round((totalSpent / totalAvailable) * 100) : 0

  const byCategory = {}
  month.expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.price || 0) })
  const sortedCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  return (
    <div>
      <div className="card" id="month-export" role="region" aria-label={`Month detail ${month.name}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3>{month.name}</h3>
          <div className="muted" style={{ fontSize: 14 }}>{month.expenses.length} transactions</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          <div className="summary-card" style={{ background: 'rgba(255,255,255,0.5)' }}>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Starting</h4>
            <div className="summary-amount" style={{ fontSize: 18 }}>₹{Number(month.startingBalance || 0).toFixed(2)}</div>
          </div>
          <div className="summary-card" style={{ background: 'rgba(255,255,255,0.5)' }}>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Spent</h4>
            <div className="summary-amount" style={{ fontSize: 18, color: 'var(--danger)' }}>₹{Number(totalSpent).toFixed(2)}</div>
          </div>
          <div className="summary-card" style={{ background: 'rgba(255,255,255,0.5)' }}>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Leftover</h4>
            <div className="summary-amount" style={{ fontSize: 18, color: 'var(--success)' }}>₹{Number(remaining).toFixed(2)}</div>
          </div>
        </div>

        {/* Analytics Section */}
        {sortedCats.length > 0 && (
          <div style={{ marginBottom: 32, padding: 16, background: 'var(--bg)', borderRadius: 16 }}>
            <h4 style={{ marginBottom: 16, fontSize: 15 }}>Spending by Category</h4>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginBottom: 24 }}>
              {/* Pie Chart */}
              <div style={{
                width: 180, height: 180, borderRadius: '50%',
                background: `conic-gradient(${(() => {
                  let angle = 0
                  return sortedCats.map(([cat, amt]) => {
                    const pct = (amt / totalSpent) * 100
                    const deg = pct * 3.6
                    const color = cat === 'Income' ? '#10B981' : (state?.categoryColors?.[cat] || '#ccc')
                    const segment = `${color} ${angle}deg ${angle + deg}deg`
                    angle += deg
                    return segment
                  }).join(', ')
                })()
                  })`
              }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sortedCats.map(([cat, amt]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat === 'Income' ? '#10B981' : (state?.categoryColors?.[cat] || '#ccc') }} />
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{cat}</span>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>₹{amt.toFixed(2)}</div>
                    <div className="muted" style={{ fontSize: 12, width: 30, textAlign: 'right' }}>{Math.round((amt / totalSpent) * 100)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h4 style={{ marginTop: 12, marginBottom: 16 }}>All Expenses</h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="expenses-table">
            <thead><tr><th>Title</th><th>Date</th><th>Category</th><th style={{ textAlign: 'right' }}>Price</th></tr></thead>
            <tbody>
              {month.expenses.map(e => (
                <tr key={e.id} className="expense-row" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ fontWeight: 600 }}>
                    <div>{e.title}</div>
                    <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{formatDate(e.date)}</div>
                  </td>
                  <td className="muted" style={{ fontSize: 13 }}>{formatDate(e.date)}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 600,
                      background: e.category === 'Income' ? '#DEF7EC' : (state?.categoryColors?.[e.category] ? `${state.categoryColors[e.category]}20` : '#f3f4f6'),
                      color: e.category === 'Income' ? '#03543F' : (state?.categoryColors?.[e.category] || '#374151'),
                      border: `1px solid ${e.category === 'Income' ? 'transparent' : (state?.categoryColors?.[e.category] || '#e5e7eb')}`
                    }}>
                      {state?.categoryIcons?.[e.category] ? `${state.categoryIcons[e.category]} ` : ''}{e.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 15 }}>₹{Number(e.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden PDF Report View */}
      <div id="pdf-report" style={{ position: 'absolute', left: -9999, top: 0, width: '210mm', minHeight: '297mm', background: 'white', padding: '20mm', color: 'black', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 24, marginBottom: 10 }}>{month.name} Report</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, borderBottom: '2px solid #000', paddingBottom: 10 }}>
          <div><strong>Start:</strong> ₹{month.startingBalance}</div>
          <div><strong>Spent:</strong> ₹{totalSpent}</div>
          <div><strong>Remaining:</strong> ₹{remaining}</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #000' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Date</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Title</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Category</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {month.expenses.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: 8 }}>{formatDate(e.date)}</td>
                <td style={{ padding: 8 }}>{e.title}</td>
                <td style={{ padding: 8 }}>{e.category}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>₹{Number(e.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 30, textAlign: 'center', fontSize: 12, color: '#666' }}>
          Generated by Expense Tracker
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={exportPdf}>Export to PDF</button>
        <button className="btn btn-danger" onClick={deleteMonth}>Delete Month</button>
        <button className="btn" onClick={onBack}>Back</button>
      </div>
      <TwoStepConfirm
        open={confirmOpen}
        title={`Delete ${month.name}`}
        itemSummary={<div>{month.name} — {month.expenses.length} expenses — Total spent: ₹{totalSpent}</div>}
        detailsNode={<div>Carried: ₹{month.carriedBalance || month.leftover || 0}</div>}
        onClose={() => setConfirmOpen(false)}
        onDelete={() => { setConfirmOpen(false); doDelete() }}
      />
    </div>
  )
}
