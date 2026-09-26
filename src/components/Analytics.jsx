import React from 'react'
import { remainingBalance } from '../lib/storage'

export default function Analytics({ state }) {
  const month = state.currentMonth
  const byCategory = {}
  month.expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.price || 0) })
  const totalSpent = month.expenses.reduce((s, e) => s + Number(e.price || 0), 0)
  const remaining = remainingBalance(month)
  const totalAvailable = (month.startingBalance || 0) + (month.carriedBalance || 0)
  const savedPct = totalAvailable ? Math.round((remaining / totalAvailable) * 100) : 0

  // Sort categories by spend
  const sortedCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
  const maxCat = sortedCats.length > 0 ? sortedCats[0][1] : 0

  const highestCategory = sortedCats[0]

  // day with most spending
  const byDay = {}
  month.expenses.forEach(e => { const d = e.date; byDay[d] = (byDay[d] || 0) + Number(e.price || 0) })
  const topDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]

  // Colors for bars
  const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  return (
    <div>
      <div className="card">
        <h3>{month.name} Overview</h3>
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>TOTAL SPENT</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>₹{totalSpent.toFixed(2)}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>REMAINING</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: remaining < 0 ? 'var(--danger)' : 'var(--success)' }}>₹{remaining.toFixed(2)}</div>
          </div>
        </div>

        <div className="muted" style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>IS SAVED</div>
        <div className="progress" style={{ height: 12 }}>
          <div className="progress-bar" style={{ width: `${Math.max(0, savedPct)}%`, background: 'var(--success)' }} />
        </div>
        <div style={{ marginTop: 6, fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{savedPct}% of available budget</div>
      </div>

      <div className="card">
        <h3>Spending by Category</h3>
        {sortedCats.length === 0 ? <p className="muted">No expenses yet.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingBottom: 16 }}>
            {/* Pie Chart */}
            <div style={{
              width: 180, height: 180, borderRadius: '50%',
              background: `conic-gradient(${(() => {
                let angle = 0
                return sortedCats.map(([cat, amt]) => {
                  const pct = (amt / totalSpent) * 100
                  const deg = pct * 3.6
                  const color = cat === 'Income' ? '#10B981' : (state.categoryColors?.[cat] || '#ccc')
                  const segment = `${color} ${angle}deg ${angle + deg}deg`
                  angle += deg
                  return segment
                }).join(', ')
              })()
                })`
            }} />

            {/* Legend List */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sortedCats.map(([cat, amt]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat === 'Income' ? '#10B981' : (state.categoryColors?.[cat] || '#ccc') }} />
                    <span style={{ fontWeight: 500 }}>{cat}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>₹{amt.toFixed(2)}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{Math.round((amt / totalSpent) * 100)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Highlights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="summary-card">
            <div className="muted" style={{ fontSize: 12 }}>TOP CATEGORY</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{highestCategory ? highestCategory[0] : '—'}</div>
            <div className="muted" style={{ fontSize: 13 }}>{highestCategory ? `₹${highestCategory[1].toFixed(2)}` : ''}</div>
          </div>
          <div className="summary-card">
            <div className="muted" style={{ fontSize: 12 }}>PEAK DAY</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{topDay ? topDay[0] : '—'}</div>
            <div className="muted" style={{ fontSize: 13 }}>{topDay ? `₹${topDay[1].toFixed(2)}` : ''}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
