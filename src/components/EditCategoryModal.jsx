import React, { useState } from 'react'

export default function EditCategoryModal({ category, color, icon, onClose, onSave }) {
    const [name, setName] = useState(category)
    const [catColor, setCatColor] = useState(color)
    const [catIcon, setCatIcon] = useState(icon)

    function submit(e) {
        if (e) e.preventDefault()
        onSave(name, catColor, catIcon)
    }

    return (
        <div className="add-overlay open">
            <form className="add-form card" onSubmit={submit}>
                <h3>Edit Category</h3>

                <label>Name</label>
                <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <label>Emoji</label>
                <input
                    value={catIcon}
                    onChange={e => { const chars = Array.from(e.target.value); setCatIcon(chars.length ? chars[chars.length - 1] : '') }}
                    style={{ width: 60, textAlign: 'center' }}
                />

                <label>Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#64748B', '#000000'].map(c => (
                        <div
                            key={c}
                            onClick={() => setCatColor(c)}
                            style={{
                                width: 24, height: 24, borderRadius: '50%', background: c,
                                cursor: 'pointer',
                                border: catColor === c ? '2px solid white' : '2px solid transparent',
                                boxShadow: catColor === c ? '0 0 0 2px var(--text-main)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        />
                    ))}
                </div>

                <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                    <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
