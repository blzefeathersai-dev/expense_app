# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "Expense Tracker" [level=1] [ref=e5]
    - navigation "Main navigation" [ref=e6]:
      - button "Show dashboard" [ref=e7] [cursor=pointer]: Dashboard
      - button "Show expenses" [ref=e8] [cursor=pointer]: Expenses
      - button "Manage categories" [ref=e9] [cursor=pointer]: Categories
      - button "Past months" [ref=e10] [cursor=pointer]: Past Months
      - button "Analytics" [ref=e11] [cursor=pointer]
  - main [ref=e12]:
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]:
          - heading "Starting Balance" [level=4] [ref=e16]
          - generic [ref=e17]: ₹0.00
          - generic [ref=e18]: Your set budget for this month
        - generic [ref=e19]:
          - heading "Carried Balance" [level=4] [ref=e20]
          - generic [ref=e21]: ₹0.00
          - generic [ref=e22]: Money carried from previous months
        - generic [ref=e23]:
          - heading "Current Available" [level=4] [ref=e24]
          - generic [ref=e25]: ₹0.00
          - generic [ref=e26]: Starting + Carried − Spent
      - generic [ref=e27]:
        - generic [ref=e28]:
          - button "Add Expense" [ref=e29] [cursor=pointer]
          - button "Close Month" [ref=e30] [cursor=pointer]
        - paragraph [ref=e31]: Quick actions and summaries
  - contentinfo [ref=e32]: All data stored locally · Safe two-step deletions
  - generic [ref=e34]:
    - heading "Welcome — Set your first monthly budget" [level=3] [ref=e35]
    - generic [ref=e36]: Budget amount
    - spinbutton "Initial budget amount" [active] [ref=e37]: "5000"
    - button "Start" [ref=e39] [cursor=pointer]
```