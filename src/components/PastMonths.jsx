import React from 'react'

export default function PastMonths({ state, onOpen, setState }) {
  return (
    <div>
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>History</h3>
        {state.pastMonths.length === 0 ? (
          <p className="muted" style={{ textAlign: 'center', padding: 32 }}>No past months yet. Close your current month to see history.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {state.pastMonths.map((m) => (
              <div key={m.id} className="tile" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{m.name}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Budget: ₹{Number(m.startingBalance || 0).toFixed(0)}
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Leftover: ₹{Number(m.leftover || m.carriedBalance || 0).toFixed(0)}
                </div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {m.expenses?.length || 0} expenses
                </div>
                <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => onOpen(m)}>View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
