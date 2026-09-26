import React from 'react'

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="add-overlay">
      <div className="add-form card">
        <h3>{title}</h3>
        <div>{children}</div>
        <div style={{marginTop:12}}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
