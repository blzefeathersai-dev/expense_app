import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import EditExpenseOverlay from './EditExpenseOverlay'

describe('EditExpenseOverlay', ()=>{
  it('saves edited expense', ()=>{
    const expense = { id:'1', title:'Old', price:10, date:'2025-01-01', category:'Misc' }
    const onSave = vi.fn()
    const onClose = vi.fn()
    render(<EditExpenseOverlay expense={expense} onSave={onSave} onClose={onClose} />)

    const titleInput = screen.getByLabelText('Title')
    const priceInput = screen.getByLabelText('Price')
    fireEvent.change(titleInput, { target: { value: 'New' } })
    fireEvent.change(priceInput, { target: { value: '15' } })
    fireEvent.click(screen.getByText('Save'))

    expect(onSave).toHaveBeenCalled()
  })
})
