import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Categories from './Categories'

describe('Categories rename', () => {
  it('renames category and updates state', () => {
    const state = { categories: ['Miscellaneous', 'Food'], currentMonth: { expenses: [{ id: 1, category: 'Food' }] }, pastMonths: [] }
    const setState = vi.fn()
    render(<Categories state={state} setState={setState} />)

    fireEvent.click(screen.getByLabelText('Rename'))
    const input = screen.getByDisplayValue('Food')
    fireEvent.change(input, { target: { value: 'Groceries' } })
    fireEvent.click(screen.getByText('Save'))

    expect(setState).toHaveBeenCalled()
  })
})
