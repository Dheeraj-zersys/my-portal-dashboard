# Frontend Integration: Getting Started

This is one Laravel app with the React UI served through Inertia. Every screen you built is already
in place and reachable. Authentication (login, logout, forgot and reset password), the layout and
sidebar navigation are wired to the backend. What's left is the data. Each screen still runs on its
mock data (seed arrays, Redux, localStorage), and your job is to replace that with the real
create / view / edit / delete flows.

This guide covers direction and constraints. Routes, props and payloads are in [`INTEGRATION.md`](INTEGRATION.md).

## Get running

Read **Setup** in `INTEGRATION.md`. Locally, Herd serves the app at `http://my-portal-dashboard.test`.
Keep `npm run dev` running, and log in with the seeded admin account.

## How it's put together

- `resources/js/pages/*` are the Inertia pages, one per route. Each one already receives its real data
  as props (comments at the top list them) but ignores them for now, rendering the existing screen
  component instead.
- `resources/js/components/*` hold your screens, unchanged apart from navigation.
- `resources/js/layouts/AppLayout.jsx` is the header, user menu and sidebar shell, shared by every
  logged-in page.
- `resources/js/app/`, `store/` and `features/` hold the existing Redux code. Most of it should
  disappear as screens move to props.

## Suggested order

1. **Master Data (BU, then GA).** Other screens' dropdowns depend on this data.
2. **Users**, then **Business Plan**.
3. **Dashboard** stats.
4. **Daily Progress Report.** The backend has separate create, edit and preview routes. Today the
   screen switches between those views internally. Decide whether to split it across the
   `Form` / `Show` pages (currently placeholders) or keep one page, but use the routes either way.

Finish one screen completely (definition of done below) before starting the next.

## Mindset shifts from the current code

- **Server owns the data.** Search and pagination happen on the server. Client-side filtering over the
  full array doesn't carry over.
- **IDs, not names.** Dropdowns submit ids. The options props already include what you need, including
  GA → district and state → district cascades.
- **Server owns validation.** Keep client checks for UX if you like, but show the server's errors.
- **Redux probably isn't needed.** Before keeping a slice, ask whether page props plus local or form
  state already cover it.
- **Props are a contract.** If a screen needs a different shape, change the API resource *and* its test,
  and tell the team. Don't work around it on the client.

## Known gaps

- **Office 365.** The "LogIn With Office 365" button has no backend, so it does nothing.
- **Lint.** `npm run lint` reports a few unused-variable errors that came over with the existing code.

## Definition of done (per screen)

- Visually unchanged.
- All data comes from props. No seed arrays, no localStorage.
- Create/edit persists and survives a reload. Server validation errors show next to the right field.
- Search, pagination and filters update the URL and survive a refresh or a back navigation.
- Loading and submitting states are handled. A double click doesn't double-submit.
- `npm run build`, `npm run lint` and `php artisan test` all pass.

## When you're blocked

- Open questions on roles, the Entity field, DPR scope and dashboard counts are listed in `INTEGRATION.md`.
  Don't let them block you. Build against the current behaviour and flag anything that looks wrong.
- There are no delete endpoints yet, because the UI had no delete. If a screen needs one, ask for it.
  Don't fake it on the client.
- If a prop is missing or a route doesn't fit the UI, raise it rather than inventing data on the client.
