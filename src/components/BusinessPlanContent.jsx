import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Search,
} from "lucide-react";

const initialPlans = [
  {
    id: 1,
    entityName: "AOF",
    gaName: "Anantapur",
    district: "Anantapur",
    date: "2025-01-10",
    transport: "500",
    industrialMarket: "800",
    commercial: "300",
    consumer: "600",
  },
  {
    id: 2,
    entityName: "AOF",
    gaName: "Kurnool",
    district: "Kurnool",
    date: "2025-01-12",
    transport: "450",
    industrialMarket: "750",
    commercial: "250",
    consumer: "550",
  },
  {
    id: 3,
    entityName: "AOF",
    gaName: "Kadapa",
    district: "YSR Kadapa",
    date: "2025-01-15",
    transport: "600",
    industrialMarket: "900",
    commercial: "350",
    consumer: "700",
  },
  {
    id: 4,
    entityName: "AOF",
    gaName: "Vijayawada",
    district: "NTR",
    date: "2025-01-18",
    transport: "700",
    industrialMarket: "1000",
    commercial: "400",
    consumer: "850",
  },
  {
    id: 5,
    entityName: "AOF",
    gaName: "Tirupati",
    district: "Tirupati",
    date: "2025-01-20",
    transport: "550",
    industrialMarket: "850",
    commercial: "320",
    consumer: "650",
  },
];

const pageSize = 5;
const storageKey = "tg-portal-business-plans";
const emptyForm = {
  entityName: "",
  gaName: "",
  district: "",
  date: "",
  transport: "",
  industrialMarket: "",
  commercial: "",
  consumer: "",
};
const inputClass =
  "w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-700";
const labelClass = "space-y-1 text-xs font-medium text-gray-700";

const getSavedPlans = () => {
  try {
    const savedPlans = window.localStorage.getItem(storageKey);
    if (savedPlans === null) return initialPlans;
    const parsedPlans = JSON.parse(savedPlans);
    if (Array.isArray(parsedPlans)) return parsedPlans;
    console.error("Saved business plans data is not a valid list.");
  } catch (error) {
    console.error("Unable to load business plans from local storage.", error);
  }
  return initialPlans;
};

const BusinessPlanContent = () => {
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
        String(value ?? "").toLowerCase().includes(search),
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
                  className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-white"
                >
                  Back
                </button>
              </div>
              <form
                onSubmit={savePlan}
                className="rounded-lg bg-white p-5 shadow-sm sm:p-7"
              >
                <div className="mb-5 grid gap-x-6 gap-y-4 sm:grid-cols-3">
                  <label className={labelClass}>
                    <span>Entity Name <b className="text-red-500">*</b></span>
                    <input
                      required
                      value={form.entityName}
                      onChange={(event) =>
                        setForm({ ...form, entityName: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className={labelClass}>
                    <span>GA Name <b className="text-red-500">*</b></span>
                    <input
                      required
                      value={form.gaName}
                      onChange={(event) =>
                        setForm({ ...form, gaName: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className={labelClass}>
                    <span>District <b className="text-red-500">*</b></span>
                    <input
                      required
                      value={form.district}
                      onChange={(event) =>
                        setForm({ ...form, district: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className={labelClass}>
                    <span>Date <b className="text-red-500">*</b></span>
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
                <p className="mb-3 text-xs font-semibold text-gray-700">
                  Segment
                </p>
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-4">
                  {[
                    ["transport", "Transport"],
                    ["industrialMarket", "Industrial Mkt"],
                    ["commercial", "Commercial"],
                    ["consumer", "Consumer"],
                  ].map(([field, label]) => (
                    <label key={field} className={labelClass}>
                      <span>{label}</span>
                      <input
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
                    className="rounded bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800"
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
                      <th className="px-3 py-3">Transport</th>
                      <th className="px-3 py-3">Industrial Mkt</th>
                      <th className="px-3 py-3">Commercial</th>
                      <th className="px-3 py-3">Consumer</th>
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
                        <td className="px-3 py-3">{plan.transport}</td>
                        <td className="px-3 py-3">{plan.industrialMarket}</td>
                        <td className="px-3 py-3">{plan.commercial}</td>
                        <td className="px-3 py-3">{plan.consumer}</td>
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
                          colSpan="9"
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
                    Showing {filteredPlans.length ? (page - 1) * pageSize + 1 : 0}{" "}
                    to {Math.min(page * pageSize, filteredPlans.length)} of{" "}
                    {filteredPlans.length} entries
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BusinessPlanContent;
