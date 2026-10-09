import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Search } from "lucide-react";

const initialPlans = [
  {
    id: 1,
    entityName: "AGP",
    gaName: "CHK",
    district: "Anantapur",
    date: "2026-01-10",
    transport: "500",
    industrialMarket: "800",
    commercial: "300",
    domestic: "600",
  },
  {
    id: 2,
    entityName: "AGP",
    gaName: "GA",
    district: "Kurnool",
    date: "2026-01-12",
    transport: "450",
    industrialMarket: "750",
    commercial: "250",
    domestic: "550",
  },
  {
    id: 3,
    entityName: "AGP",
    gaName: "LD",
    district: "YSR Kadapa",
    date: "2026-01-15",
    transport: "600",
    industrialMarket: "900",
    commercial: "350",
    domestic: "700",
  },
  {
    id: 4,
    entityName: "AGP",
    gaName: "LD",
    district: "NTR",
    date: "2026-01-18",
    transport: "700",
    industrialMarket: "1000",
    commercial: "400",
    domestic: "850",
  },
  {
    id: 5,
    entityName: "AGP",
    gaName: "LD",
    district: "Tirupati",
    date: "2026-01-20",
    transport: "550",
    industrialMarket: "850",
    commercial: "320",
    domestic: "650",
  },
];

const pageSize = 5;
const seedSignature = JSON.stringify(initialPlans);
const storageKey = "tg-portal-business-plans";
const legacyStorageKey = `${storageKey}-${seedSignature}`;
const emptyForm = {
  entityName: "",
  gaName: "",
  district: "",
  date: "",
  transport: "",
  industrialMarket: "",
  commercial: "",
  domestic: "",
};
const inputClass =
  "w-full rounded border border-gray-200 bg-[#f8f9fc] px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-emerald-700";
const labelClass = "space-y-1 text-xs font-medium text-gray-700";

const formatDate = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const getSavedPlans = () => {
  try {
    const savedPlans =
      window.localStorage.getItem(storageKey) ??
      window.localStorage.getItem(legacyStorageKey);
    if (savedPlans === null) return initialPlans;
    const parsedPlans = JSON.parse(savedPlans);
    if (Array.isArray(parsedPlans)) return parsedPlans;
    console.error("Saved business plans data is not a valid list.");
  } catch (error) {
    console.error("Unable to load business plans from local storage.", error);
  }
  return initialPlans;
};

const BusinessPlanContentView = () => {
  const [plans, setPlans] = useState(getSavedPlans);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const filteredPlans = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return plans;
    return plans.filter((plan) =>
      Object.values(plan).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search),
      ),
    );
  }, [plans, query]);
  const pageCount = Math.max(1, Math.ceil(filteredPlans.length / pageSize));
  const visiblePlans = filteredPlans.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plans));
    } catch (error) {
      console.error("Unable to save business plans to local storage.", error);
    }
  }, [plans]);

  const openNewPlan = () => {
    setEditingPlan(null);
    setForm({ ...emptyForm });
    setIsFormOpen(true);
  };

  const openEditPlan = (plan) => {
    setEditingPlan(plan);
    setForm({ ...emptyForm, ...plan });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
  };

  const savePlan = (event) => {
    event.preventDefault();
    if (editingPlan) {
      setPlans((current) =>
        current.map((plan) =>
          plan.id === editingPlan.id ? { ...plan, ...form } : plan,
        ),
      );
    } else {
      setPlans((current) => [...current, { id: Date.now(), ...form }]);
      setQuery("");
      setPage(Math.ceil((plans.length + 1) / pageSize));
    }
    closeForm();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f8f8f9]">
      <section className="flex-1 p-5 sm:p-8">
        <div className="mx-auto max-w-6xl">
          {isFormOpen ? (
            <>
              <div className="mb-5 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">
                  {editingPlan ? "Edit Business Plan" : "Add Business Plan"}
                </h1>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded border border-gray-600 px-5 py-3 text-xs text-gray-700 hover:bg-white"
                >
                  Back
                </button>
              </div>
              <form
                onSubmit={savePlan}
                className="rounded-lg bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="grid gap-3 border-b border-gray-100 pb-3 sm:grid-cols-3">
                  <label className="flex min-w-0 items-center gap-1 text-xs font-semibold text-gray-800">
                    <span className="shrink-0">Entity Name:</span>
                    <input
                      required
                      value={form.entityName}
                      onChange={(event) =>
                        setForm({ ...form, entityName: event.target.value })
                      }
                      aria-label="Entity Name"
                      className="min-w-0 flex-1 bg-transparent text-xs font-semibold outline-none focus-visible:ring-1 focus-visible:ring-emerald-700"
                    />
                  </label>
                  <label className="flex min-w-0 items-center gap-1 text-xs font-semibold text-gray-800">
                    <span className="shrink-0">GA Name:</span>
                    <input
                      required
                      value={form.gaName}
                      onChange={(event) =>
                        setForm({ ...form, gaName: event.target.value })
                      }
                      aria-label="GA Name"
                      className="min-w-0 flex-1 bg-transparent text-xs font-semibold outline-none focus-visible:ring-1 focus-visible:ring-emerald-700"
                    />
                  </label>
                  <label className="flex min-w-0 items-center gap-1 text-xs font-semibold text-gray-800">
                    <span className="shrink-0">District:</span>
                    <input
                      required
                      value={form.district}
                      onChange={(event) =>
                        setForm({ ...form, district: event.target.value })
                      }
                      aria-label="District"
                      className="min-w-0 flex-1 bg-transparent text-xs font-semibold outline-none focus-visible:ring-1 focus-visible:ring-emerald-700"
                    />
                  </label>
                </div>
                <div className="mt-3 max-w-sm">
                  <label className={labelClass}>
                    <span>
                      Date<span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={(event) =>
                        setForm({ ...form, date: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                </div>
                <p className="mb-2 mt-3 text-xs font-semibold text-gray-700">
                  Segment<span className="text-red-500">*</span>
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["transport", "Transport"],
                    ["industrialMarket", "Industrial Mkt"],
                    ["commercial", "Commercial"],
                    ["domestic", "Domestic"],
                  ].map(([field, label]) => (
                    <label key={field}>
                      <input
                        required
                        aria-label={label}
                        placeholder={label}
                        type="number"
                        min="0"
                        value={form[field]}
                        onChange={(event) =>
                          setForm({ ...form, [field]: event.target.value })
                        }
                        className={inputClass}
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    className="rounded bg-emerald-700 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-800"
                  >
                    {editingPlan ? "Update Business Plan" : "Add Business Plan"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-semibold text-gray-900">
                  Business Plan
                </h1>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-400 focus-within:border-emerald-700">
                    <Search size={17} aria-hidden="true" />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Search business plans"
                      aria-label="Search business plans"
                      className="w-full bg-transparent text-sm text-gray-800 outline-none sm:w-44"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={openNewPlan}
                    className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                  >
                    + Add Business Plan
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
                <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                  <thead className="bg-[#e5e5e5] text-xs font-semibold text-gray-800">
                    <tr>
                      <th className="px-3 py-3">Sl No</th>
                      <th className="px-3 py-3">Entity Name</th>
                      <th className="px-3 py-3">GA Name</th>
                      <th className="px-3 py-3">District</th>
                      <th className="px-3 py-3">Date</th>
                      <th className="px-3 py-3">Transport</th>
                      <th className="px-3 py-3">Industrial Mkt</th>
                      <th className="px-3 py-3">Commercial</th>
                      <th className="px-3 py-3">Domestic</th>
                      <th className="px-3 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    {visiblePlans.map((plan, index) => (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3">
                          {(page - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-3 py-3">{plan.entityName}</td>
                        <td className="px-3 py-3">{plan.gaName}</td>
                        <td className="px-3 py-3">{plan.district}</td>
                        <td className="px-3 py-3">{formatDate(plan.date)}</td>
                        <td className="px-3 py-3">{plan.transport}</td>
                        <td className="px-3 py-3">{plan.industrialMarket}</td>
                        <td className="px-3 py-3">{plan.commercial}</td>
                        <td className="px-3 py-3">{plan.domestic}</td>
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => openEditPlan(plan)}
                            aria-label={`Edit business plan for ${plan.gaName}`}
                            className="rounded bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700"
                          >
                            <Pencil size={15} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {visiblePlans.length === 0 && (
                      <tr>
                        <td
                          colSpan="10"
                          className="px-4 py-10 text-center text-gray-500"
                        >
                          No business plans found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="flex flex-col gap-3 px-5 py-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Showing{" "}
                    {filteredPlans.length ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredPlans.length)} of{" "}
                    {filteredPlans.length} entries
                  </span>
                  <div
                    className="flex items-center gap-1"
                    aria-label="Pagination"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                      disabled={page === 1}
                      aria-label="Previous page"
                      className="rounded px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from(
                      { length: pageCount },
                      (_, index) => index + 1,
                    ).map((number) => (
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
                    ))}
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const BusinessPlanContent = () => (
  <BusinessPlanContentView key={seedSignature} />
);

export default BusinessPlanContent;
