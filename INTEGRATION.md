# Backend → Frontend Integration Guide

The backend is complete and the existing UI already runs inside it: login, logout, the layout and
sidebar navigation are wired up. Each screen still renders its **mock data** (seed arrays, Redux,
localStorage). Integration means replacing that mock data with the Inertia props and form posts
described here.

Stack: Laravel 13 · Inertia v3 (`inertiajs/inertia-laravel` + `@inertiajs/react`) · React 19 · MySQL · Tailwind 4.

## Setup

```bash
composer install && npm install
cp .env.example .env && php artisan key:generate
# create the MySQL database `my_portal` and set DB_USERNAME / DB_PASSWORD in .env
php artisan migrate --seed
composer run dev          # or: php artisan serve  +  npm run dev
php artisan test          # 23 feature tests, run on in-memory SQLite
```

Seeded login: `admin@example.com` / `password` (and sonal/tina/rahul/amal/priya@example.com, same password).
Sample users, plans and DPRs are only seeded outside production.

## Conventions

- **Props are camelCase** and mirror the object shapes the current components already use
  (e.g. DPR keys `domesticReg`, `mdpe20Laid`, `forAggPga` from `resources/js/app/dpr.js`).
- **Form payloads are camelCase too.** Post the same keys you receive. Dropdowns send **ids**
  (`businessUnitId`, `geographicalAreaId`, `districtId`, `stateId`, `districtIds`) instead of names.
- **Lists are paginated server-side** (5 per page, like the UI) and arrive as
  `{ data: [...], links: {...}, meta: { current_page, last_page, total, ... } }`.
  Query params: `?search=…&page=…&perPage=…`. Use `router.get(url, params, { preserveState: true })`.
- **Dropdown options** are in `options.*`, already shaped for react-select: `{ value, label }`.
  `geographicalAreas` and `states` entries also include `districts: [{ value, label }]` for cascades.
- **Dates** are sent and received as `Y-m-d`. The UI shows `d/m/Y`, so format on the client.
- **Validation errors** arrive in `usePage().props.errors` / `form.errors`, keyed by the camelCase field name.
- **Shared props on every page:** `auth.user` (same shape as a Users row; null when logged out), and
  `flash.success` / `flash.status`.
- **Writes** (`store`/`update`) redirect back with `flash.success`. DPR store/update redirect to the preview page.

## Page map

| Route (name) | Inertia page | Screen component (`resources/js/components`) | Props |
|---|---|---|---|
| `GET /login` (`login`) | `auth/Login` | wired (`pages/auth/Login.jsx`) | `status` |
| `POST /login` | – | | body: `email`, `password`, `rememberMe` |
| `POST /logout` (`logout`) | – | wired (`layouts/AppLayout.jsx`) | |
| `GET /forgot-password` (`password.request`) | `auth/ForgotPassword` | placeholder; mock flow lives in `pages/auth/Login.jsx` | `status` |
| `POST /forgot-password` (`password.email`) | – | | body: `email` |
| `GET /reset-password/{token}` (`password.reset`) | `auth/ResetPassword` | placeholder | `token`, `email` |
| `POST /reset-password` (`password.store`) | – | | body: `token`, `email`, `password`, `password_confirmation` |
| `GET /dashboard` (`dashboard`) | `Dashboard` | `DashboardContent.jsx` | `stats` (same shape as `dashboardSlice`) |
| `GET /users` | `users/Index` | `UsersContent.jsx` | `users`, `filters`, `options.{roles,statuses,businessUnits,geographicalAreas}` |
| `POST /users`, `PUT /users/{id}` | – | | `name, email, phone, role, status, businessUnitId, geographicalAreaId?, entity?, password, confirmPassword` (password optional on update) |
| `GET /business-plans` | `business-plans/Index` | `BusinessPlanContent.jsx` | `plans`, `filters`, `options.geographicalAreas` |
| `POST /business-plans`, `PUT /business-plans/{id}` | – | | `entityName, geographicalAreaId, districtId, date, transport, industrialMarket, commercial, domestic` |
| `GET /daily-progress-reports` | `daily-progress-reports/Index` | `DailyProgress.jsx` (list, wizard and preview are all here today) | `reports`, `filters` |
| `GET /daily-progress-reports/create` | `daily-progress-reports/Form` | placeholder; wizard currently inside `DailyProgress.jsx` | `report: null`, `steps`, `options.geographicalAreas` |
| `GET /daily-progress-reports/{id}/edit` | `daily-progress-reports/Form` | placeholder; wizard currently inside `DailyProgress.jsx` | `report`, `steps`, `options.geographicalAreas` |
| `POST /daily-progress-reports`, `PUT …/{id}` | – | | `date`, `geographicalAreaId?`, plus every key in `formData` from `dpr.js` (all nullable, ≥ 0) |
| `GET /daily-progress-reports/{id}` | `daily-progress-reports/Show` | placeholder; preview currently inside `DailyProgress.jsx` | `report`, `steps`, `cumulative` (below) |
| `GET /master-data/geographical-areas` | `master-data/GeographicalAreas` | `GAManagerContent.jsx` + `MasterDataContent.jsx` | `managers`, `filters`, `options.{statuses,states,geographicalAreas}`. Filters: `search, gaId, stateId, districtId` |
| `POST`/`PUT /master-data/geographical-areas[/{id}]` | – | | `name, stateId, districtIds[], status` |
| `GET /master-data/business-units` | `master-data/BusinessUnits` | `BUManagerContent.jsx` + `MasterDataContent.jsx` | `managers`, `filters`, `options.statuses` |
| `POST`/`PUT /master-data/business-units[/{id}]` | – | | `name, status` |

Sidebar navigation already uses these URLs (`components/Sidebar.jsx`).

### DPR preview: `cumulative`

```js
cumulative = {
  periods: {                       // labels are computed from the report date
    month:              { label: 'Cumulative for the Month' },
    currentYear:        { label: 'Cumulative CY 2026' },
    previousYear:       { label: 'Cumulative CY 2025' },
    beforePreviousYear: { label: 'Cumulative till Dec 2024' },
  },
  totals: { domesticReg: { month: '…', currentYear: '…', previousYear: '…', beforePreviousYear: '…' }, … }
}
```
"For the Day" is the value on `report` itself. `steps` groups the metric keys by wizard step
(`infrastructure`, `cngStations`, `pipelinesOfc`, `sales`).

## Example: users list + form

```jsx
import { router, useForm, usePage } from '@inertiajs/react';

export default function UsersIndex({ users, filters, options }) {
  const form = useForm({ name: '', email: '', phone: '', role: 'User', status: 'Active',
    businessUnitId: null, geographicalAreaId: null, entity: '', password: '', confirmPassword: '' });

  const search = (q) => router.get('/users', { search: q }, { preserveState: true, replace: true });
  const save = (editingId) => editingId
    ? form.put(`/users/${editingId}`, { onSuccess: () => form.reset() })
    : form.post('/users', { onSuccess: () => form.reset() });
  // users.data → rows, users.meta → pagination, form.errors.email → field error
}
```

## Where things live

- Routes: `routes/web.php`
- Controllers: `app/Http/Controllers` (+ `Auth/`, `MasterData/`)
- Validation: `app/Http/Requests`
- Prop shapes: `app/Http/Resources`, dropdown options: `app/Support/Lookups.php`
- Shared props: `app/Http/Middleware/HandleInertiaRequests.php`
- Schema: `database/migrations`, seed data: `database/seeders`
- Tests (also usable as API examples): `tests/Feature`

## Behaviour changes vs. the current mock UI

- **Password reset is token-based.** The mock "set-password" screen resets by email alone, which is
  insecure. The backend emails a link to `/reset-password/{token}`. With `MAIL_MAILER=log` the link is
  written to `storage/logs/laravel.log`.
- **Inactive users cannot log in.** Login is throttled to 5 attempts per minute.
- **Business plan districts must belong to the chosen GA**, and GA districts must belong to the chosen state.
- **No delete endpoints**, matching the UI. Records are deactivated through `status`.

## Open questions (need a product decision)

1. **Roles:** every authenticated user can currently manage Users and Master Data. Should those be Admin-only?
2. **Entity** (`AGP` on users and business plans) is free text. Should it be a master-data table?
3. **DPR scope:** should a report belong to a GA, and should there be one report per GA per day?
   `geographicalAreaId` is optional for now and the date is not unique.
4. **Dashboard "current / total"** is currently "this month / all time". Please confirm the meaning.
