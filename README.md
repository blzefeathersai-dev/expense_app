# Expense Tracker (Local)

This is a minimal local expense tracker built with React + Vite. It follows the product plan provided by the user: monthly cycles, categories, past months, PDF export, and two-step deletion confirmations.

Quick start

1. Install dependencies

```bash
npm install
```

2. Run in development

```bash
npm run dev
```

3. Open http://localhost:5173

Notes

- All data is stored in `localStorage` under the key `expense_app_v1`.
- PDF export uses `html2canvas` and `jspdf`.
- Deletions use browser confirm dialogs (two layers).
