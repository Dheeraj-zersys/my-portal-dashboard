# Integration Walkthrough: GA Manager, then the Users Form

This guide connects one screen to the backend from start to finish, then uses its data in another
screen. Follow it for GA Manager, then repeat the same steps for the other modules
(see [Applying this to other modules](#applying-this-to-other-modules)).

Read it alongside [`INTEGRATION.md`](INTEGRATION.md) (routes, props, payloads) and
[`FRONTEND_GUIDE.md`](FRONTEND_GUIDE.md) (definition of done).

**No backend changes are needed.** The routes, validation and props already exist. This work is all
in `resources/js`.

This code was run in a real browser against the backend: create, edit, filters, pagination, and a new
user logging in from a separate browser.

## What changes

| | Today (mock) | After integration |
|---|---|---|
| Rows come from | `useState` + localStorage | `managers.data` prop |
| Saving | `setManagers(...)` | `form.post()` / `form.put()` |
| Search, filters, pages | `.filter()` / `.slice()` in the browser | URL query params, handled by the server |
| Validation | `setFormError(...)` | `form.errors.<field>` from the server |
| Dropdown values | Names (`"Karnataka"`) | Ids (`stateId: 3`) |

If a save doesn't produce a `POST` or `PUT` in the browser's Network tab, it isn't integrated.

## Setup

```bash
php artisan migrate:fresh --seed   # warning: wipes your local database
npm run dev
```

Log in as `admin@example.com` / `password`.

Clear the old mock data once, in the browser console:

```js
localStorage.removeItem("tg-portal-ga-managers");
```

## Step 0: Pass server data to the screen

Do this first. Edit needs real rows with `stateId` and `districtIds`, and the mock rows have neither,
so the table has to read server rows before Steps 1 and 2 can work. Filters and pagination wait until
Step 3.

**0.1 Stop discarding the props.** In `resources/js/pages/master-data/GeographicalAreas.jsx`:

```jsx
export default function GeographicalAreas({ managers, filters, options }) {
  return (
    <GAManagerContent managers={managers} filters={filters} options={options} />
  );
}
```

**0.2 Give GA its own component.** `MasterDataContent.jsx` is shared with the BU screen, so changing it
would break BU, which is still on mock data.

- Move the GA parts of its JSX and `customSelectStyles` into `GAManagerContent.jsx`.
- Remove the `isGA` branches and replace `{entity}` and `{title}` with fixed text.
- Delete the `initialManagers` seed array.
- Leave `MasterDataContent.jsx` as it is for BU. Delete it once BU is integrated.

**0.3 Read the rows from props.** In `GAManagerContent.jsx`:

```jsx
import { useMemo, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import Select from "react-select";
import { ChevronLeft, ChevronRight, PenBoxIcon, Plus, X } from "lucide-react";

const GA_URL = "/master-data/geographical-areas";

const GAManagerContent = ({ managers, filters, options }) => {
  const rows = managers.data;
  const meta = managers.meta;
```

**Delete** the `states` constant, the `managers` state, both localStorage blocks and `filteredManagers`.
Render `rows.map(...)` in the table, with `(meta.from ?? 1) + index` for Sl No.

**Check:** the table shows the seeded GAs. In DevTools → Application → Local Storage, `tg-portal-ga-managers` doesn't come back after a reload.

## Step 1: Create

**1.1 Replace the form state with `useForm`.** It provides the data, `errors` and `processing`.

```jsx
const emptyForm = { name: "", stateId: null, districtIds: [], status: "Active" };

// inside the component:
const [editingManager, setEditingManager] = useState(null);
const [isFormOpen, setIsFormOpen] = useState(false);
const form = useForm(emptyForm);

const openNewManager = () => {
  setEditingManager(null);
  form.setData(emptyForm);
  form.clearErrors();
  setIsFormOpen(true);
};

const closeForm = () => {
  setIsFormOpen(false);
  setEditingManager(null);
  form.clearErrors();
};
```

The field names must match the payload in `INTEGRATION.md`: `stateId` and `districtIds`, not `state`
and `districts`.

**1.2 Save to the server.**

```jsx
const saveManager = (event) => {
  event.preventDefault();
  form.post(GA_URL, {
    preserveScroll: true,
    onSuccess: () => {
      closeForm();
      showNewRow();
    },
  });
};

// New rows go at the end, so clear the filters and open the last page, as the mock did.
const showNewRow = () => {
  router.get(GA_URL, {}, {
    preserveState: true,
    onSuccess: (page) => {
      const lastPage = page.props.managers.meta.last_page;
      if (lastPage > 1) {
        router.get(GA_URL, { page: lastPage }, { preserveState: true, replace: true });
      }
    },
  });
};
```

Don't add the row to any local list. The server redirects back and Inertia delivers fresh props.

**1.3 Bind the fields to ids.**

```jsx
// Name
<input
  required
  autoFocus
  value={form.data.name}
  onChange={(event) => form.setData("name", event.target.value)}
  /* existing placeholder and className */
/>

// State: changing it clears the districts
<select
  required
  value={form.data.stateId ?? ""}
  onChange={(event) =>
    form.setData({
      ...form.data,
      stateId: Number(event.target.value) || null,
      districtIds: [],
    })
  }
>
  <option value="">Select State Coverage</option>
  {options.states.map((state) => (
    <option key={state.value} value={state.value}>{state.label}</option>
  ))}
</select>
```

Districts come from the selected state's option, and the form stores their ids:

```jsx
const toggleDistrict = (districtId) => {
  form.setData(
    "districtIds",
    form.data.districtIds.includes(districtId)
      ? form.data.districtIds.filter((id) => id !== districtId)
      : [...form.data.districtIds, districtId],
  );
};

const formDistricts =
  options.states.find((state) => state.value === form.data.stateId)?.districts ?? [];
const selectedDistrictNames = formDistricts
  .filter((district) => form.data.districtIds.includes(district.value))
  .map((district) => district.label);
```

In the JSX:

- Loop over `formDistricts`, using `district.value` for the key and checkbox and `district.label` for the text.
- Use `form.data.districtIds.includes(district.value)` for `checked`.
- Show `selectedDistrictNames.join(", ")` in the summary.
- Check `!form.data.stateId` for the "Select a state first" message.

**1.4 Show the server's errors next to each field.** Remove `formError`, `setFormError` and the
client-side state and district check.

```jsx
const FieldError = ({ message }) =>
  message ? (
    <p role="alert" className="text-xs font-normal text-red-600">{message}</p>
  ) : null;

// Array errors can arrive as districtIds or districtIds.0, so check both.
const districtError =
  form.errors.districtIds ??
  Object.entries(form.errors).find(([key]) => key.startsWith("districtIds."))?.[1];
```

Add `<FieldError message={form.errors.name} />`, the same for `stateId`, and
`<FieldError message={districtError} />`.

**1.5 Block double submits.**

```jsx
<button type="submit" disabled={form.processing} /* existing classes + */
  className="... disabled:cursor-not-allowed disabled:opacity-60">
```

**Check:**

- [ ] Submitting with no districts shows the error, keeps the modal open and keeps the typed name.
- [ ] A duplicate name shows an error under the name field.
- [ ] A valid save sends one `POST`, even on a double click.
- [ ] The row exists in the database and survives a reload, and the new row is on screen.

```bash
php artisan tinker --execute='dump(App\Models\GeographicalArea::with("state","districts")->latest("id")->first()->toArray());'
```

## Step 2: Edit

The same form handles edit. The rows already carry `stateId` and `districtIds` for this.

**2.1 Fill the form from the row.**

```jsx
const openEditManager = (manager) => {
  setEditingManager(manager);
  form.setData({
    name: manager.name,
    stateId: manager.stateId,
    districtIds: manager.districtIds,
    status: manager.status,
  });
  form.clearErrors();
  setIsFormOpen(true);
};
```

**2.2 Choose `PUT` or `POST`.** This replaces the `saveManager` from Step 1:

```jsx
const saveManager = (event) => {
  event.preventDefault();
  if (editingManager) {
    form.put(`${GA_URL}/${editingManager.id}`, {
      preserveScroll: true,
      onSuccess: closeForm,
    });
  } else {
    form.post(GA_URL, {
      preserveScroll: true,
      onSuccess: () => {
        closeForm();
        showNewRow();
      },
    });
  }
};
```

**2.3 Add the status selection.** Every edit form for a record with a status must let the user activate
or deactivate it. Show it only when editing, because new records always start as `Active`. Add this
after the district field, using `options.statuses` from the props:

```jsx
{editingManager && (
  <label className="block space-y-1 text-xs font-medium text-gray-700">
    <span>
      Status<span className="text-red-500">*</span>
    </span>
    <select
      required
      value={form.data.status}
      onChange={(event) => form.setData("status", event.target.value)}
      className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-700"
    >
      {options.statuses.map((status) => (
        <option key={status.value} value={status.value}>{status.label}</option>
      ))}
    </select>
    <FieldError message={form.errors.status} />
  </label>
)}
```

**Check:**

- [ ] The modal opens with the name, state, districts and current status filled in.
- [ ] Changing the state clears the districts, and saving without any shows the error.
- [ ] Saving with the name unchanged succeeds, with no false "already taken" error.
- [ ] A valid save sends a `PUT`, updates the row and stays on the same page.
- [ ] The Add form has no status field.
- [ ] Setting a GA to `Inactive` updates its badge and removes it from the Users GA dropdown.
- [ ] Setting it back to `Active` returns it to that dropdown.

## Step 3: Listing (filters and pagination)

The URL now holds the filter and page state, so a refresh or the back button keeps it.

**3.1 Add the navigation helpers.**

```jsx
const visit = (params) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    ),
  );
  router.get(GA_URL, cleaned, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
  });
};

const applyFilters = (changes) => visit({ ...filters, ...changes }); // no page, so back to page 1
const goToPage = (page) => visit({ ...filters, page });
```

**3.2 Work out the selected filter options from the URL.** Remove the `selected*Filter` state, because
`filters` now holds those values. They arrive as strings (`"3"`), while option values are numbers, so
compare them as strings.

```jsx
const findOption = (list, value) =>
  list.find((option) => String(option.value) === String(value)) ?? null;

const selectedGa = findOption(options.geographicalAreas, filters.gaId);
const selectedState = findOption(options.states, filters.stateId);
const districtOptions = useMemo(
  () =>
    selectedState
      ? selectedState.districts
      : options.states.flatMap((state) => state.districts),
  [selectedState, options.states],
);
const selectedDistrict = findOption(districtOptions, filters.districtId);
```

**3.3 Connect the dropdowns.**

```jsx
<Select
  value={selectedGa}
  onChange={(option) => applyFilters({ gaId: option?.value })}
  options={options.geographicalAreas}
  placeholder="GA Name" isClearable styles={customSelectStyles}
/>
<Select
  value={selectedState}
  onChange={(option) => applyFilters({ stateId: option?.value, districtId: null })}
  options={options.states}
  placeholder="Select State" isClearable styles={customSelectStyles}
/>
<Select
  value={selectedDistrict}
  onChange={(option) => applyFilters({ districtId: option?.value })}
  options={districtOptions}
  placeholder="Select District" isClearable styles={customSelectStyles}
/>
```

**3.4 Use the server's pagination data.**

```jsx
<span>Showing {meta.from ?? 0} to {meta.to ?? 0} of {meta.total} entries</span>

// Previous
onClick={() => goToPage(meta.current_page - 1)}  disabled={meta.current_page === 1}
// Numbers
Array.from({ length: meta.last_page }, (_, i) => i + 1)
onClick={() => goToPage(number)}  // highlight when meta.current_page === number
// Next
onClick={() => goToPage(meta.current_page + 1)}  disabled={meta.current_page === meta.last_page}
```

**Check:**

- [ ] Changing a page or filter updates the URL.
- [ ] Changing a filter returns to page 1.
- [ ] After a reload, the filters are still applied and the dropdowns still show their labels.
- [ ] Filters with no matches show the empty message and "Showing 0 to 0 of 0".

## Step 4: Use the GA in the Users form

The GA Name field is free text today. It becomes a dropdown of real GAs, saved by id.

`POST /users` also requires a valid `businessUnitId`, so the form can't save until the whole form is
converted. The new user also won't appear until the table reads from props, so this step covers both.

**4.1 Pass the props and remove the mock data.** In `pages/users/Index.jsx`:

```jsx
export default function UsersIndex({ users, filters, options }) {
  return <UsersContent users={users} filters={filters} options={options} />;
}
```

In `UsersContent.jsx`, delete `initialUsers`, `getSavedUsers`, the localStorage effect and the
client-side filtering. Then apply Steps 0 to 3 using `users.data` and `users.meta`.

**4.2 Use ids in the form.**

```jsx
const emptyForm = {
  name: "", email: "", phone: "", role: "User", status: "Active",
  businessUnitId: null,       // was unit: "BU 1"
  geographicalAreaId: null,   // was gaManager: ""
  entity: "", password: "", confirmPassword: "",
};
```

**4.3 Replace the GA text input with a dropdown.** `options.geographicalAreas` is already in the props,
and `react-select` can use it directly.

```jsx
<div className={labelClass}>
  <p className="text-sm font-medium text-gray-900"><span>GA Name</span></p>
  <Select
    inputId="user-ga"
    value={selectedGa}
    onChange={(option) => form.setData("geographicalAreaId", option?.value ?? null)}
    options={options.geographicalAreas}
    placeholder="Select GA"
    isClearable
    styles={customSelectStyles}
  />
  <FieldError message={form.errors.geographicalAreaId} />
</div>
```

The Business Unit dropdown works the same way, with `options.businessUnits` and `businessUnitId`. Use
`options.roles` for Role.

**4.4 Keep inactive values visible.** The options list only contains active records. Without this
fallback, editing a user whose GA was later deactivated shows a blank field.

```jsx
const selectedOption = (list, id, fallbackLabel) =>
  list.find((option) => option.value === id) ??
  (id && fallbackLabel ? { value: id, label: fallbackLabel } : null);

const selectedBu = selectedOption(options.businessUnits, form.data.businessUnitId, editingUser?.unit);
const selectedGa = selectedOption(options.geographicalAreas, form.data.geographicalAreaId, editingUser?.gaManager);
```

**4.5 Fill and save the form.** Never put a password in the rows or in localStorage.

```jsx
const openEditUser = (user) => {
  setEditingUser(user);
  form.setData({
    name: user.name, email: user.email, phone: user.phone,
    role: user.role, status: user.status,
    businessUnitId: user.businessUnitId,
    geographicalAreaId: user.geographicalAreaId,
    entity: user.entity ?? "",
    password: "", confirmPassword: "",
  });
  form.clearErrors();
  setIsFormOpen(true);
};

const saveUser = (event) => {
  event.preventDefault();
  const callbacks = {
    preserveScroll: true,
    onSuccess: closeForm,
    onError: () => form.setData({ ...form.data, password: "", confirmPassword: "" }),
  };
  if (editingUser) form.put(`/users/${editingUser.id}`, callbacks);
  else form.post("/users", callbacks);
};
```

**4.6 Add the status selection.** As in 2.3, show it only when editing. `status` is already filled in
by `openEditUser`. Add this after the Entity field:

```jsx
{editingUser && (
  <div className={labelClass}>
    <p className="text-sm font-medium text-gray-900">
      <span>Status <b className="text-red-500">*</b></span>
    </p>
    <Select
      inputId="user-status"
      value={{ value: form.data.status, label: form.data.status }}
      onChange={(option) => form.setData("status", option.value)}
      options={options.statuses}
      styles={customSelectStyles}
      isSearchable={false}
    />
    <FieldError message={form.errors.status} />
  </div>
)}
```

**4.7 Search on the server, with a delay.** Users has a search box, so wait for typing to pause rather
than sending a request per keystroke.

```jsx
const [query, setQuery] = useState(filters.search ?? "");

useEffect(() => {
  if (query === (filters.search ?? "")) return;
  const timer = setTimeout(() => {
    router.get("/users", query ? { search: query } : {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, 300);
  return () => clearTimeout(timer);
}, [query, filters.search]);
```

**Check. This is the end-to-end proof:**

- [ ] Create a GA in GA Manager. It appears in the Users GA dropdown.
- [ ] Create a user with that GA. It appears in the table and survives a reload.
- [ ] A missing Business Unit or a short password shows an error next to the field.
- [ ] **Log in as the new user from another browser.** This fails if anything is still mock.
- [ ] Editing that user shows the GA filled in, and saving with a blank password keeps the old one.
- [ ] Setting the user to `Inactive` updates the badge, and a fresh login is then refused.
- [ ] Setting the user back to `Active` allows login again.

```bash
php artisan tinker --execute='dump(App\Models\User::with("geographicalArea")->latest("id")->first()->only("name","email","geographical_area_id"));'
```

## Step 5: Before opening the PR

```bash
grep -n "localStorage\|initialManagers\|initialUsers" \
  resources/js/components/MasterData/GAManagerContent.jsx \
  resources/js/components/UsersContent.jsx    # expect no output

php artisan test
npm run build
npm run lint
```

`npm run lint` currently fails on 3 unused-variable errors in `DailyProgress.jsx` and
`DashboardContent.jsx`, which predate this work. Fix them so it passes.

Also remove the `TODO(frontend)` comment from each page you finish, and work through the definition of
done in `FRONTEND_GUIDE.md`. A screen is only finished when all of it passes.

## Applying this to other modules

Use the same steps for each one: **props → create → edit → listing → use it in dependent forms → checks**.

| Module | Route and props | What's different |
|---|---|---|
| **Business Units** | `/master-data/business-units`: `managers`, `filters`, `options.statuses` | The simplest. It has a search box (use 4.7). Use `options.statuses` for its status field, and show it only when editing, as in 2.3. Delete `MasterDataContent.jsx` afterwards. |
| **Business Plans** | `/business-plans`: `plans`, `filters`, `options.geographicalAreas` | Districts come from the selected GA's `districts`. Send dates as `Y-m-d` and display them as `d/m/Y`. Has no status in the backend (see Known behaviour). |
| **Dashboard** | `/dashboard`: `stats` | Read-only: Step 0 only. Remove the `dashboardSlice` numbers and the hard-coded fallbacks in `DashboardContent.jsx`. |
| **Daily Progress Reports** | `/daily-progress-reports`: `reports`, `filters`; `Form` and `Show` pages | Do this last. Remove localStorage from `app/dpr.js`, and use the separate create, edit and preview routes. Saving redirects to the preview, so don't use the "last page" logic. Has no status in the backend (see Known behaviour). |

Details for each are in the page map in `INTEGRATION.md`.

## Common mistakes

| Symptom | Cause | Fix |
|---|---|---|
| The screen ignores new data | The page doesn't pass its props to the component | See 0.1 |
| The BU screen breaks after a GA change | The shared `MasterDataContent` was edited | See 0.2 |
| "The state id field is required" | The form sends names, not ids | Use the payload keys from `INTEGRATION.md` |
| A district error never appears | Only `errors.districtIds` is read | Also check `districtIds.N` (see 1.4) |
| A filter dropdown is blank after a reload | `"3"` compared with `3` | Compare as strings (see 3.2) |
| A filter applies but the page number is stale | `page` was carried into the filter change | Don't pass `page` from `applyFilters` |
| The row appears, then disappears on reload | It was added to local state | Don't touch rows locally. Rely on the props. |
| A new user can't log in | The form still saves locally, or the user is `Inactive` | Check for the `POST` in the Network tab |

## Known behaviour

- **District dropdown:** it stays open after selecting and can cover the submit button until it's closed.
  The mock UI does the same, so this isn't a regression.
- **Status on edit forms:** GA, Business Unit and User edit forms all include a status selection. New
  records start as `Active`.
- **Business Plans and DPRs have no status:** the backend has no status column, validation or prop for
  them. Don't add the field to those forms until the backend supports it.
- **Deactivated users stay logged in (backend gap):** status is only checked at login. A deactivated
  user keeps access through an existing session or "remember me" cookie. This needs a backend fix before
  go-live, so don't work around it in the frontend.
- **Users can deactivate themselves:** nothing stops an admin setting their own account to `Inactive`.
  They stay logged in until the session ends, then can't log back in.
- **Error wording:** some messages use the raw field name, such as "The business unit id field is
  required." To change them, add entries to `messages()` in the form request.
- **Old browser data:** anything saved only in localStorage is not migrated. Re-enter what's needed.
