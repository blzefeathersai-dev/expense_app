import React from 'react'
import { remainingBalance } from '../lib/storage'
import CloseMonthModal from './CloseMonthModal'
import CountUp from './CountUp'

function IconCalendar() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stopColor="#ffd88f" />
          <stop offset="1" stopColor="#ffb36b" />
        </linearGradient>
      </defs>
      <rect x="4" y="8" width="40" height="32" rx="6" fill="url(#g1)" opacity="0.95" />
      <path d="M16 6v6M32 6v6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12" y="18" width="8" height="6" rx="2" fill="rgba(255,255,255,0.22)" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g2" x1="0" x2="1">
          <stop offset="0" stopColor="#ffd6e0" />
          <stop offset="1" stopColor="#ff9fb8" />
        </linearGradient>
      </defs>
      <rect x="4" y="8" width="40" height="32" rx="6" fill="url(#g2)" opacity="0.95" />
      <path d="M30 32a6 6 0 01-12 0" fill="rgba(255,255,255,0.22)" />
      <path d="M34 20a10 10 0 10-20 0c0 11-4 11-4 11h28s-4 0-4-11" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

import { IconWallet, IconChart, IconCash, IconCard } from './IconComponents'

import TwoStepConfirm from './TwoStepConfirm'

export default function Dashboard({ state, onAdd }) {
  const m = state.currentMonth
  const remaining = remainingBalance(m)
  const [closeOpen, setCloseOpen] = React.useState(false)
  const [resetOpen, setResetOpen] = React.useState(false)
  return (
    <div>
      <div className="dashboard-grid">
        {/* Start Balance */}
        <div className="rich-card">
          <div className="rich-icon icon-blue"><IconWallet /></div>
          <div className="rich-content">
            <div className="rich-label">Starting Budget</div>
            <div className="rich-value"><CountUp value={Number(m.startingBalance || 0)} formatter={v => `₹${v.toFixed(2)}`} /></div>
          </div>
        </div>

        {/* Carried Balance */}
        <div className="rich-card">
          <div className="rich-icon icon-orange"><IconCash /></div>
          <div className="rich-content">
            <div className="rich-label">Carried Forward</div>
            <div className="rich-value"><CountUp value={Number(m.carriedBalance || 0)} formatter={v => `₹${v.toFixed(2)}`} /></div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="rich-card">
          <div className="rich-icon icon-red"><IconChart /></div>
          <div className="rich-content">
            <div className="rich-label">Total Spent</div>
            <div className="rich-value"><CountUp value={Number(state.currentMonth.expenses.filter(e => e.type !== 'income').reduce((a, b) => a + Number(b.price || 0), 0))} formatter={v => `₹${v.toFixed(2)}`} /></div>
          </div>
        </div>

        {/* Available */}
        <div className="rich-card">
          <div className="rich-icon icon-green"><IconCard /></div>
          <div className="rich-content">
            <div className="rich-label">Available Now</div>
            <div className="rich-value"><CountUp value={Number(remaining || 0)} formatter={v => `₹${v.toFixed(2)}`} /></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Recent Activity</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" type="button" onClick={onAdd}>+ Add</button>
            <button className="btn" type="button" onClick={() => setCloseOpen(true)}>Close Month</button>
          </div>
        </div>

        {m.expenses.length === 0 ? <p className="muted" style={{ textAlign: 'center', padding: '32px 0' }}>No expenses yet. Add one to get started!</p> : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {m.expenses
              .slice()
              .sort((a, b) => b.date > a.date ? 1 : -1)
              .slice(0, 5) // Just show top 5 in recent
              .map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40,
                      borderRadius: 12,
                      background: e.type === 'income' ? '#10B981' : (state.categoryColors?.[e.category] || '#E5E7EB'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20,
                      color: 'white'
                    }}>
                      {e.type === 'income' ? '💰' : <span>{state.categoryIcons?.[e.category] || '🏷️'}</span>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{e.title}</div>
                      <div className="muted" style={{ fontSize: 13 }}>{new Date(e.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: e.type === 'income' ? 'var(--success)' : 'inherit' }}>
                    {e.type === 'income' ? '+' : '-'}₹{Number(e.price).toFixed(2)}
                  </div>
                </div>
              ))}

            {m.expenses.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, fontWeight: 600, color: 'var(--accent)', cursor: 'pointer' }} onClick={() => document.querySelector('[aria-label="Expenses"]').click()}>
                View all expenses &rarr;
              </div>
            )}
          </div>
        )}
      </div>


      <CloseMonthModal open={closeOpen} onClose={() => setCloseOpen(false)} onConfirm={(budget) => {
        window.dispatchEvent(new CustomEvent('app:closeMonth', { detail: { budget } }))
        setCloseOpen(false)
      }} />

      <div style={{ marginTop: 40, textAlign: 'center', paddingBottom: 40 }}>
        <button
          className="btn btn-ghost"
          style={{ color: 'var(--danger)', fontSize: 13, opacity: 0.7 }}
          onClick={() => setResetOpen(true)}
        >
          Reset All Data
        </button>
      </div>

      <TwoStepConfirm
        open={resetOpen}
        title="Reset Application?"
        itemSummary={<div>This will <strong>permanently delete</strong> all your expenses, categories, and settings. This cannot be undone.</div>}
        onClose={() => setResetOpen(false)}
        onDelete={() => {
          localStorage.clear()
          window.location.reload()
        }}
      />
    </div >
  )
}
