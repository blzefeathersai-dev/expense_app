import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ExpensesList from './ExpensesList'

describe('ExpensesList delete flow', () => {
  it('opens two-step confirm and calls onDelete', async () => {
    const state = { currentMonth: { expenses: [{ id: '1', title: 'a', price: 10, date: '2025-01-01', category: 'Miscellaneous' } ] }, categories: ['Miscellaneous'] }
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const onAdd = vi.fn()
    render(<ExpensesList state={state} onEdit={onEdit} onDelete={onDelete} onAdd={onAdd} />)

    // click delete
    fireEvent.click(screen.getByText('Delete'))
    // first stage shows Continue
    expect(await screen.findByText('This action cannot be undone.')).toBeTruthy()
    fireEvent.click(screen.getByText('Continue'))
    // second stage shows Delete Permanently
    expect(await screen.findByText('Delete Permanently')).toBeTruthy()
    fireEvent.click(screen.getByText('Delete Permanently'))
    expect(onDelete).toHaveBeenCalledWith('1')
  })
})
