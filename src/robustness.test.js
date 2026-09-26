
import { describe, it, expect } from 'vitest'
import { makeExpense, addCategory, remainingBalance, createNewMonthIfNeeded } from './lib/storage'

describe('Robustness / Edge Cases', () => {

    describe('makeExpense', () => {
        it('handles negative price gracefully (allows it for refunds)', () => {
            const e = makeExpense({ title: 'Refund', price: -50, category: 'Food', date: '2023-10-01' })
            expect(e.price).toBe(-50)
        })

        it('handles zero price', () => {
            const e = makeExpense({ title: 'Free Item', price: 0, category: 'Misc', date: '2023-10-01' })
            expect(e.price).toBe(0)
        })

        it('handles huge numbers', () => {
            const e = makeExpense({ title: 'Lambo', price: 999999999, category: 'Transport', date: '2023-10-01' })
            expect(e.price).toBe(999999999)
        })
    })

    describe('addCategory', () => {
        it('prevents duplicates (case insensitive)', () => {
            const state = { categories: ['Food'] }
            const s2 = addCategory(state, 'food', '#000')
            expect(s2.categories.length).toBe(1)
        })

        it('prevents empty names', () => {
            const state = { categories: [] }
            const s2 = addCategory(state, '', '#000')
            expect(s2.categories.length).toBe(0)
        })
    })

    describe('Month Transition (Dec -> Jan)', () => {
        it('handles year rollover (Dec 2023 -> Jan 2024)', () => {
            const prev = {
                currentMonth: { month: 12, year: 2023, startingBalance: 1000, carriedBalance: 0, expenses: [] },
                pastMonths: []
            }
            // Simulate "Now" is Jan 2024
            const jan2024 = new Date('2024-01-15T00:00:00')
            const out = createNewMonthIfNeeded(prev, jan2024)

            expect(out).not.toBeNull()
            expect(out.currentMonth.year).toBe(2024)
            expect(out.currentMonth.month).toBe(1)
            expect(out.pastMonths.length).toBe(1)
            expect(out.pastMonths[0].year).toBe(2023)
            expect(out.pastMonths[0].month).toBe(12)
        })

        it('handles leap year transition (Feb -> Mar)', () => {
            const prev = {
                currentMonth: { month: 2, year: 2024, startingBalance: 1000, carriedBalance: 0, expenses: [] },
                pastMonths: []
            }
            const mar2024 = new Date('2024-03-01T00:00:00')
            const out = createNewMonthIfNeeded(prev, mar2024)
            expect(out).not.toBeNull()
            expect(out.currentMonth.month).toBe(3)
            expect(out.pastMonths.length).toBe(1)
        })
    })

    describe('Dates Logic', () => {
        it('retains date format correctly', () => {
            const e = makeExpense({ title: 'Future', price: 100, category: 'Misc', date: '2025-01-01' })
            expect(e.date).toBe('2025-01-01')
        })
    })
})
