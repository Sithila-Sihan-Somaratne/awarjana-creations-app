# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


# Awarjana Creations - Photoframe Management App

## Overview
Awarjana Creations is a web application to manage the full workflow of custom photoframe orders, including customers, workers, and admin roles. The system handles order placement, cost calculation, deadline tracking, material management, draft approval, and email notifications for all events (malfunctions, delays, status updates — including alien invasions 🛸).

---

## Roles & Features

### Customer
- Place an order with selected materials and sizes
- Confirm or reject price
- Set deadline (normal or urgent, with optional date and hour)
- Refunds possible if urgent orders are delayed (stricter rules than normal delay)
- View order tracking status
- Receives email notifications for all status changes, errors, and malfunctions

### Worker
- View assigned job cards from admin
- Submit drafts of completed work for admin review
- Track materials usage
- Delays visible to admin
- Receives email notifications for relevant updates or malfunctions

### Admin
- View all orders and tracking details
- Assign orders to workers
- Approve or reject drafts with comments
- Track and update material quantities
- Receives email notifications for errors, delays, and system malfunctions

---

## Cost Calculation

The total cost is calculated as: 
Total Cost = Sum(All Material Costs) + Labor + Overheads + Optional Missing Components


### Base Components & Costs

| Component        | Cost (Currency Units) | Notes |
|-----------------|---------------------|------|
| Frame           | 518.52              | Major Material |
| Glass           | 300.00              | Major Material |
| MDF             | 115.00              | Major Material |
| Wages           | 100.00              | Labor/Overhead |
| Electricity     | 50.00               | Utility/Overhead |
| Stand           | 50.00               | Hardware/Accessory |
| Under Pin       | 20.00               | Hardware/Accessory |
| Hook            | 10.00               | Hardware/Accessory |
| Side Pin        | 10.00               | Hardware/Accessory |
| Missing/Zero-cost components | 0 (optional value can be added) | Coner L Bracket, Screw, Coner, Polythene |

### Scenario-Based Costs
- Scenario A: H=48, W=36, H2=16, W2=24 → Cost: 1350  
- Scenario B: H=96, W=48, H2=16, W2=24 → Cost: 1380  
- Scenario C: Frame cost 700, Usage 80 → Cost: 700  

> Missing components default to 0, but can optionally have a value for total cost calculation.

### Improvements & Proposals
- Dynamic optional components: admin can edit missing/zero-cost component values  
- Live cost updates based on materials, sizes, and scenario selection  
- Configurable urgent/normal deadlines  
- Automatic refund calculation for delayed urgent orders  
- Alerts for approaching deadlines (email + UI)  
- Real-time material stock tracking with low-stock alerts  

---

## Technology Stack

**Frontend:**
- React + Vite
- pnpm package manager
- TailwindCSS + shadcn/ui for UI components
- react-router-dom for routing
- react-hook-form for form handling

**Backend & Database:**
- Supabase (Postgres DB + Auth + Email notifications)
- Tables: `users`, `orders`, `materials`, `job_cards`, `drafts`

**Authentication & Roles:**
- Customer: simple sign-up  
- Worker/Admin: sign-up requires registration code  
- Role-based routing enforced

**UI / Colors:**
- Background: black  
- Components / headings: yellow (+ variants)  
- Text: white  
- Alerts: red = error, green = success  
- Placeholder color variations for components and alerts  

---