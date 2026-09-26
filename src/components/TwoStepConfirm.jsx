import React, { useState } from 'react'

export default function TwoStepConfirm({ open, title, itemSummary, detailsNode, onClose, onDelete }) {
  const [stage, setStage] = useState(0)
  if (!open) return null
  return (
    <div className="add-overlay open">
      <div className="add-form card">
        <h3>{title}</h3>
        {stage === 0 ? (
          <div>
            <p>This action cannot be undone.</p>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-primary" onClick={() => setStage(1)}>Continue</button>
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <div>{itemSummary}</div>
            <div style={{marginTop:8}}>{detailsNode}</div>
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button className="btn btn-danger" onClick={() => { onDelete(); setStage(0) }}>Delete Permanently</button>
              <button className="btn btn-ghost" onClick={() => { setStage(0); onClose() }}>Keep</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
