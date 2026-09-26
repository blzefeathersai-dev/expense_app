// Simple localStorage-backed state for the expense app
const KEY = 'expense_app_v1'

function defaultState() {
  const now = new Date()
  const monthName = now.toLocaleString(undefined, { month: 'long', year: 'numeric' })
  return {
    currentMonth: {
      id: `${now.getFullYear()}-${now.getMonth() + 1}`,
      name: monthName,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      startingBalance: 0,
      carriedBalance: 0,
      budgetInput: 0,
      expenses: []
    },
    pastMonths: [],
    categories: ['Miscellaneous'],
    categoryColors: { 'Miscellaneous': '#9CA3AF' },
    categoryIcons: { 'Miscellaneous': '📦' },
    // whether the user completed initial setup (entered a first budget)
    initialized: false
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    return JSON.parse(raw)
  } catch (e) {
    console.error('loadState', e)
    return defaultState()
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    console.error('saveState', e)
  }
}

export function isFreshInstall() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return true
    const parsed = JSON.parse(raw)
    // consider fresh if not initialized
    return parsed.initialized !== true
  } catch (e) {
    return true
  }
}

export function createNewMonthIfNeeded(state, targetDate = new Date()) {
  const now = targetDate
  const month = now.getMonth() + 1 // 1-12
  const current = state.currentMonth

  // Check if we are still in the same month
  if (current.year === now.getFullYear() && current.month === month) {
    return null
  }
  // finalize previous month automatically
  const leftover = remainingBalance(state.currentMonth)
  const finished = { ...state.currentMonth, leftover }
  const nextMonth = {
    id: `${now.getFullYear()}-${month}`,
    name: now.toLocaleString(undefined, { month: 'long', year: 'numeric' }),
    year: now.getFullYear(),
    month: month,
    // carry the leftover into `carriedBalance`, leave `startingBalance` for user input
    startingBalance: 0,
    carriedBalance: leftover,
    budgetInput: 0,
    budgetNeeded: true,
    expenses: []
  }
  return { ...state, pastMonths: [...state.pastMonths, finished], currentMonth: nextMonth }
}


export function finalizeMonth(state, newBudgetInput = 0) {
  const leftover = remainingBalance(state.currentMonth)
  const finished = { ...state.currentMonth, leftover }
  const now = new Date()
  const nextMonthIndex = now.getMonth() + 1 // for simplicity use current date
  const nextMonth = {
    id: `${now.getFullYear()}-${nextMonthIndex}`,
    name: now.toLocaleString(undefined, { month: 'long', year: 'numeric' }),
    year: now.getFullYear(),
    month: nextMonthIndex,
    // next month's starting balance is the user-provided budget; leftover is carried separately
    startingBalance: Number(newBudgetInput || 0),
    carriedBalance: Number(leftover),
    budgetInput: Number(newBudgetInput || 0),
    expenses: []
  }
  return { ...state, pastMonths: [...state.pastMonths, finished], currentMonth: nextMonth }
}

export function remainingBalance(month) {
  const expenses = month.expenses || []
  const spent = expenses.filter(e => e.type !== 'income').reduce((s, e) => s + Number(e.price || 0), 0)
  const earned = expenses.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.price || 0), 0)
  // Force Number() on everything to avoid any string concatenation risk
  return Number(month.startingBalance || 0) + Number(month.carriedBalance || 0) + Number(earned) - Number(spent)
}

// Utility to create expense ids
export function makeExpense({ title, price, date, category, type }) {
  return {
    id: `e-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    price: Number(price),
    date,
    category: type === 'income' ? 'Income' : (category || 'Miscellaneous'),
    type: type || 'expense'
  }
}

export function addCategory(state, name, color, icon) {
  if (!name) return state
  if (state.categories.some(c => c.toLowerCase() === name.toLowerCase())) return state
  const colors = { ...(state.categoryColors || {}), [name]: color || '#60A5FA' }
  const icons = { ...(state.categoryIcons || {}), [name]: icon || '🏷️' }
  return { ...state, categories: [...state.categories, name], categoryColors: colors, categoryIcons: icons }
}


export function deleteCategory(state, name) {
  if (name === 'Miscellaneous') return state
  const categories = state.categories.filter(c => c !== name)
  // move expenses to Miscellaneous
  const move = (month) => ({ ...month, expenses: month.expenses.map(e => ({ ...e, category: e.category === name ? 'Miscellaneous' : e.category })) })
  return { ...state, categories, currentMonth: move(state.currentMonth), pastMonths: state.pastMonths.map(move) }
}

export function updateCategory(state, oldName, newName, newColor, newIcon) {
  const categories = state.categories.map(c => c === oldName ? newName : c)

  // Update colors & icons
  const colors = { ...state.categoryColors }
  const icons = { ...state.categoryIcons }
  if (oldName !== newName) {
    delete colors[oldName]
    delete icons[oldName]
  }
  colors[newName] = newColor
  if (newIcon) icons[newName] = newIcon

  // Update expenses if name changed
  if (oldName !== newName) {
    const update = (month) => ({
      ...month,
      expenses: month.expenses.map(e => ({
        ...e,
        category: e.category === oldName ? newName : e.category
      }))
    })
    return {
      ...state,
      categories,
      categoryColors: colors,
      categoryIcons: icons,
      currentMonth: update(state.currentMonth),
      pastMonths: state.pastMonths.map(update)
    }
  }

  // If only color/icon changed
  return { ...state, categoryColors: colors, categoryIcons: icons }
}
