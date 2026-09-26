import React, { useEffect, useState } from 'react'
import { loadState, saveState, createNewMonthIfNeeded, finalizeMonth, isFreshInstall } from './lib/storage'
import Dashboard from './components/Dashboard'
import AddExpenseOverlay from './components/AddExpenseOverlay'
import ExpensesList from './components/ExpensesList'
import Categories from './components/Categories'
import PastMonths from './components/PastMonths'
import MonthDetail from './components/MonthDetail'
import Analytics from './components/Analytics'
import InitialBudget from './components/InitialBudget'

export default function App() {
  const [state, setState] = useState(() => loadState())
  const [isFresh, setIsFresh] = useState(() => isFreshInstall())
  const [showAdd, setShowAdd] = useState(false)
  const [view, setView] = useState('dashboard')
  const [selectedMonth, setSelectedMonth] = useState(null)

  useEffect(() => {
    const updated = createNewMonthIfNeeded(state)
    if (updated) {
      setState(updated)
      saveState(updated)
    }
  }, [])

  useEffect(() => saveState(state), [state])

  useEffect(() => {
    function handler(e) {
      const budget = e.detail?.budget || 0
      closeMonthAndStartNew(budget)
    }
    window.addEventListener('app:closeMonth', handler)
    return () => window.removeEventListener('app:closeMonth', handler)
  }, [state])

  function addExpense(expense) {
    const s = { ...state }
    s.currentMonth.expenses = [...s.currentMonth.expenses, expense]
    setState(s)
  }

  function updateExpense(updatedExpense) {
    const s = { ...state }
    s.currentMonth.expenses = s.currentMonth.expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e)
    setState(s)
  }

  function deleteExpense(id) {
    const s = { ...state }
    s.currentMonth.expenses = s.currentMonth.expenses.filter(e => e.id !== id)
    setState(s)
  }

  function closeMonthAndStartNew(newBudgetInput) {
    const s = finalizeMonth(state, newBudgetInput)
    setState(s)
  }

  function setInitialBudget(amount) {
    const s = { ...state }
    // Set the provided amount as this month's starting balance and budget input
    s.currentMonth.startingBalance = Number(amount || 0)
    s.currentMonth.budgetInput = Number(amount || 0)
    delete s.currentMonth.budgetNeeded
    s.initialized = true
    setState(s)
    setIsFresh(false)
  }

  return (
    <div className="app-root">
      <header className="app-header" role="banner">
        <h1>Expense Tracker</h1>
        <nav role="navigation" aria-label="Main navigation">
          <button className={`btn nav-btn ${view === 'dashboard' ? 'nav-active' : ''}`} aria-label="Dashboard" onClick={() => setView('dashboard')}>Dashboard</button>
          <button className={`btn nav-btn ${view === 'expenses' ? 'nav-active' : ''}`} aria-label="Expenses" onClick={() => setView('expenses')}>Expenses</button>
          <button className={`btn nav-btn ${view === 'categories' ? 'nav-active' : ''}`} aria-label="Categories" onClick={() => setView('categories')}>Categories</button>
          <button className={`btn nav-btn ${view === 'past' ? 'nav-active' : ''}`} aria-label="Past Months" onClick={() => setView('past')}>History</button>
          <button className={`btn nav-btn ${view === 'analytics' ? 'nav-active' : ''}`} aria-label="Analytics" onClick={() => setView('analytics')}>Analytics</button>
        </nav>
      </header>

      <main>
        {view === 'dashboard' && (
          <Dashboard
            state={state}
            onAdd={() => setShowAdd(true)}
            onCloseMonth={() => setView('past')}
          />
        )}
        {view === 'expenses' && (
          <ExpensesList
            state={state}
            onEdit={updateExpense}
            onDelete={deleteExpense}
            onAdd={() => setShowAdd(true)}
            onReorder={(newOrder) => {
              const s = { ...state }
              s.currentMonth.expenses = newOrder
              setState(s)
            }}
          />
        )}
        {view === 'categories' && (
          <Categories state={state} setState={setState} />
        )}
        {view === 'past' && (
          <PastMonths
            state={state}
            onOpen={(m) => { setSelectedMonth(m); setView('monthDetail') }}
            setState={setState}
          />
        )}
        {view === 'monthDetail' && selectedMonth && (
          <MonthDetail month={selectedMonth} onBack={() => setView('past')} setState={setState} state={state} />
        )}
        {view === 'analytics' && (
          <Analytics state={state} />
        )}
      </main>



      {showAdd && (
        <AddExpenseOverlay
          state={state}
          onClose={() => setShowAdd(false)}
          onSave={(e) => { addExpense(e); setShowAdd(false) }}
        />
      )}

      {/* Initial budget prompt on first launch OR start of new month */}
      {((isFresh && state.pastMonths.length === 0 && (Number(state.currentMonth.budgetInput || 0) === 0) && state.currentMonth.expenses.length === 0) || state.currentMonth.budgetNeeded) && (
        <InitialBudget onSave={setInitialBudget} />
      )}
    </div>
  )
}
