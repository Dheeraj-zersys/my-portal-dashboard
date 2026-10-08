import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, X } from "lucide-react";

const pageSize = 5;
const states = {
  "Andhra Pradesh": [
    "Anantapur",
    "Chittoor",
    "East Godavari",
    "Guntur",
    "Kakinada",
    "Kurnool",
    "NTR",
    "Tirupati",
    "West Godavari",
  ],
  Telangana: ["Hyderabad", "Karimnagar", "Khammam", "Rangareddy", "Warangal"],
  Karnataka: ["Bengaluru", "Belagavi", "Mysuru"],
};
const emptyGA = {
  name: "",
  state: "",
  districts: [],
  status: "Active",
};
const emptyBU = { name: "", status: "Active" };

const MasterDataContent = ({
  managerType,
  initialManagers,
  showSearch = false,
}) => {
  const isGA = managerType === "ga";
  const title = isGA ? "GA Manager" : "BU Manager";
  const entity = isGA ? "GA" : "BU";
  const storageKey = `tg-portal-${managerType}-managers`;
  const emptyForm = isGA ? emptyGA : emptyBU;
  const [managers, setManagers] = useState(() => {
    try {
      const savedManagers = window.localStorage.getItem(storageKey);
      if (savedManagers === null) return initialManagers;
      const parsedManagers = JSON.parse(savedManagers);
      if (Array.isArray(parsedManagers)) return parsedManagers;
      console.error(`Saved ${entity} manager data is not a valid list.`);
    } catch (error) {
      console.error(`Unable to load ${entity} managers from local storage.`, error);
    }
    return initialManagers;
  });
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingManager, setEditingManager] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [formError, setFormError] = useState("");

  const filteredManagers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return managers;
    return managers.filter((manager) =>
      Object.values(manager).some((value) =>
        (Array.isArray(value) ? value.join(" ") : String(value ?? ""))
          .toLowerCase()
          .includes(search),
      ),
    );
  }, [managers, query]);
  const pageCount = Math.max(1, Math.ceil(filteredManagers.length / pageSize));
  const visibleManagers = filteredManagers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(managers));
    } catch (error) {
      console.error(`Unable to save ${entity} managers to local storage.`, error);
    }
  }, [entity, managers, storageKey]);

  const openNewManager = () => {
    setEditingManager(null);
    setForm({ ...emptyForm, ...(isGA ? { districts: [] } : {}) });
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditManager = (manager) => {
    setEditingManager(manager);
    setForm({
      ...emptyForm,
      ...manager,
      ...(isGA ? { districts: manager.districts ?? [] } : {}),
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingManager(null);
    setFormError("");
  };

  const saveManager = (event) => {
    event.preventDefault();
    if (isGA && (!form.state || form.districts.length === 0)) {
      setFormError("Select a state and at least one district.");
      return;
    }

    const savedAt = new Intl.DateTimeFormat("en-GB").format(new Date());
    const managerDetails = {
      ...form,
      ...(isGA ? {} : { status: form.status }),
    };
    if (editingManager) {
      setManagers((current) =>
        current.map((manager) =>
          manager.id === editingManager.id
            ? { ...manager, ...managerDetails }
            : manager,
        ),
      );
    } else {
      setManagers((current) => [
        ...current,
        { id: Date.now(), ...managerDetails, createdDate: savedAt },
      ]);
      setQuery("");
      setPage(Math.ceil((managers.length + 1) / pageSize));
    }
    closeForm();
  };

  const toggleDistrict = (district) => {
    setForm((current) => ({
      ...current,
      districts: current.districts.includes(district)
        ? current.districts.filter((selected) => selected !== district)
        : [...current.districts, district],
    }));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f8f8f9]">
      <section className="flex-1 p-5 sm:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <div className="flex flex-col gap-3 sm:flex-row">
              {showSearch && (
                <label className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-400 focus-within:border-emerald-700">
                  <Search size={17} aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    placeholder={`Search ${title}`}
                    aria-label={`Search ${title}`}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none sm:w-44"
                  />
                </label>
              )}
              <button
                type="button"
                onClick={openNewManager}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <Plus size={16} aria-hidden="true" />
                Add New {entity}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-[#e5e5e5] text-xs font-semibold text-gray-800">
                <tr>
                  <th className="px-4 py-3">Sl No</th>
                  <th className="px-4 py-3">{entity} Name</th>
                  {isGA && (
                    <>
                      <th className="px-4 py-3">State</th>
                      <th className="px-4 py-3">Districts</th>
                    </>
                  )}
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created Date</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {visibleManagers.map((manager, index) => (
                  <tr key={manager.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-4 py-3">{manager.name}</td>
                    {isGA && (
                      <>
                        <td className="px-4 py-3">{manager.state}</td>
                        <td className="px-4 py-3">
                          {manager.districts?.join(", ")}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold text-white ${manager.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                      >
                        {manager.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{manager.createdDate}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => openEditManager(manager)}
                        aria-label={`Edit ${entity} ${manager.name}`}
                        className="rounded bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700"
                      >
                        <Pencil size={15} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleManagers.length === 0 && (
                  <tr>
                    <td
                      colSpan={isGA ? 7 : 5}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      No {title.toLowerCase()} entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex flex-col gap-3 px-5 py-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredManagers.length ? (page - 1) * pageSize + 1 : 0}{" "}
                to {Math.min(page * pageSize, filteredManagers.length)} of{" "}
                {filteredManagers.length} entries
              </span>
              <div className="flex items-center gap-1" aria-label="Pagination">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="rounded px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                  (number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setPage(number)}
                      aria-label={`Page ${number}`}
                      aria-current={page === number ? "page" : undefined}
                      className={`rounded px-2 py-1 ${page === number ? "bg-emerald-700 text-white" : "hover:bg-gray-100"}`}
                    >
                      {number}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(pageCount, current + 1))
                  }
                  disabled={page === pageCount}
                  aria-label="Next page"
                  className="rounded px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/25 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <form
            onSubmit={saveManager}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manager-dialog-title"
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="manager-dialog-title"
                className="text-lg font-semibold text-gray-900"
              >
                {editingManager ? `Edit ${entity}` : `Add ${entity}`}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close dialog"
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block space-y-1 text-xs font-medium text-gray-700">
                <span>
                  {entity} Name<span className="text-red-500">*</span>
                </span>
                <input
                  required
                  autoFocus
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder={`Enter ${entity} Name`}
                  className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-700"
                />
              </label>

              {isGA ? (
                <>
                  <label className="block space-y-1 text-xs font-medium text-gray-700">
                    <span>
                      State Coverage<span className="text-red-500">*</span>
                    </span>
                    <select
                      required
                      value={form.state}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          state: event.target.value,
                          districts: [],
                        })
                      }
                      className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-700"
                    >
                      <option value="">Select State Coverage</option>
                      {Object.keys(states).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>
                  <fieldset className="space-y-1 text-xs font-medium text-gray-700">
                    <legend>
                      District Coverage
                      <span className="text-red-500">*</span>
                    </legend>
                    <details className="group relative">
                      <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm font-normal text-gray-500 outline-none focus-visible:border-emerald-700">
                        <span className="truncate">
                          {form.districts.length
                            ? form.districts.join(", ")
                            : "Select District Coverage"}
                        </span>
                        <span aria-hidden="true">⌄</span>
                      </summary>
                      <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border border-gray-200 bg-white p-2 shadow-lg">
                        {(states[form.state] ?? []).map((district) => (
                          <label
                            key={district}
                            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 font-normal hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={form.districts.includes(district)}
                              onChange={() => toggleDistrict(district)}
                              className="accent-emerald-700"
                            />
                            {district}
                          </label>
                        ))}
                        {!form.state && (
                          <p className="px-2 py-1.5 font-normal text-gray-500">
                            Select a state first.
                          </p>
                        )}
                      </div>
                    </details>
                  </fieldset>
                </>
              ) : (
                <label className="block space-y-1 text-xs font-medium text-gray-700">
                  <span>
                    Status<span className="text-red-500">*</span>
                  </span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-700"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
              )}
            </div>

            {formError && (
              <p role="alert" className="mt-3 text-xs text-red-600">
                {formError}
              </p>
            )}

            <div className="mt-5 flex justify-center">
              <button
                type="submit"
                className="rounded bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800"
              >
                {editingManager ? `Update ${entity}` : `Add ${entity}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MasterDataContent;
