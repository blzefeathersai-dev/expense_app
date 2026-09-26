import { describe, it, expect } from 'vitest'
import { makeExpense, remainingBalance, addCategory, deleteCategory, finalizeMonth, createNewMonthIfNeeded, updateCategory } from './storage.js'

describe('storage utilities', () => {
  it('makeExpense sets defaults and types', () => {
    const e = makeExpense({ title: 'T', price: '12.5', date: '2025-01-01' })
    expect(e.id).toBeTruthy()
    expect(typeof e.price).toBe('number')
    expect(e.category).toBe('Miscellaneous')
  })

  it('remainingBalance calculates correctly', () => {
    const month = { startingBalance: 100, carriedBalance: 0, expenses: [{ price: 10 }, { price: '5' }] }
    expect(remainingBalance(month)).toBe(85)
  })

  it('addCategory adds unique categories', () => {
    const s = { categories: ['Miscellaneous'], categoryColors: { 'Miscellaneous': '#9CA3AF' } }
    const out = addCategory(s, 'Food', '#ff0000')
    expect(out.categories).toContain('Food')
    const out2 = addCategory(out, 'Food')
    // adding duplicate shouldn't create a second
    expect(out2.categories.filter(c => c === 'Food').length).toBe(1)
    expect(out.categoryColors['Food']).toBe('#ff0000')
  })

  it('deleteCategory moves expenses to Miscellaneous', () => {
    const s = { categories: ['Miscellaneous', 'X'], currentMonth: { expenses: [{ id: 1, category: 'X' }] }, pastMonths: [] }
    const out = deleteCategory(s, 'X')
    expect(out.categories).not.toContain('X')
    expect(out.currentMonth.expenses[0].category).toBe('Miscellaneous')
  })

  it('finalizeMonth carries leftover into carriedBalance and sets new startingBalance', () => {
    const state = { currentMonth: { startingBalance: 50, carriedBalance: 0, expenses: [{ price: 20 }] }, pastMonths: [] }
    const next = finalizeMonth(state, 30)
    expect(next.pastMonths.length).toBe(1)
    // leftover = 50 - 20 = 30. carriedBalance should be leftover, startingBalance should be new budget input
    expect(next.currentMonth.carriedBalance).toBe(30)
    expect(next.currentMonth.startingBalance).toBe(30)
    expect(next.currentMonth.budgetInput).toBe(30)
    // the effective available balance should be 60
    expect(remainingBalance(next.currentMonth)).toBe(60)
  })

  it('createNewMonthIfNeeded finalizes when month has changed', () => {
    const now = new Date()
    const fakePrev = { currentMonth: { month: (now.getMonth() + 1) % 12 || 12, year: now.getFullYear() - 1, startingBalance: 10, carriedBalance: 0, expenses: [] }, pastMonths: [] }
    const out = createNewMonthIfNeeded(fakePrev)
    expect(out).not.toBeNull()
    expect(out.pastMonths.length).toBe(1)
    expect(out.currentMonth.budgetNeeded).toBe(true)
  })

  describe('updateCategory', () => {
    it('renames category and migrates expenses', () => {
      const startState = {
        categories: ['Food'],
        categoryColors: { 'Food': 'red' },
        currentMonth: { expenses: [{ id: 1, category: 'Food' }] },
        pastMonths: []
      }
      const newState = updateCategory(startState, 'Food', 'Groceries', 'green')

      expect(newState.categories).toContain('Groceries')
      expect(newState.categories).not.toContain('Food')
      expect(newState.categoryColors['Groceries']).toBe('green')
      expect(newState.categoryColors['Food']).toBeUndefined()
      expect(newState.currentMonth.expenses[0].category).toBe('Groceries')
    })

    it('updates color only', () => {
      const startState = {
        categories: ['Food'],
        categoryColors: { 'Food': 'red' },
        currentMonth: { expenses: [] },
        pastMonths: []
      }
      const newState = updateCategory(startState, 'Food', 'Food', 'blue')
      expect(newState.categoryColors['Food']).toBe('blue')
    })
  })
})
