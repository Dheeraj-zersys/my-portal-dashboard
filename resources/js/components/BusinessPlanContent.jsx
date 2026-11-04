import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import Select from "react-select";
import { ChevronLeft, ChevronRight, PenBoxIcon, Search } from "lucide-react";

const emptyForm = {
    entityName: "",
    geographicalAreaId: null,
    districtId: null,
    date: "",
    transport: "",
    industrialMarket: "",
    commercial: "",
    domestic: "",
};
const inputClass =
    "w-full rounded-sm border border-gray-200 bg-[#f8f9fc] px-4 py-2 text-xs text-gray-800 outline-none focus:border-emerald-700";
const labelClass = "space-y-1 text-xs font-medium text-gray-700";

const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
};

const BusinessPlanContent = ({ plans, filters, options }) => {
    const [query, setQuery] = useState(filters.search ?? "");
    const [editingPlan, setEditingPlan] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const page = plans.meta.current_page;
    const pageCount = plans.meta.last_page;
    const pageSize = plans.meta.per_page;
    const total = plans.meta.total;
    const firstItem = total ? (page - 1) * pageSize + 1 : 0;
    const lastItem = Math.min(page * pageSize, total);
    const districtOptions = useMemo(
        () =>
            options.geographicalAreas.find(
                (area) => area.value === form.geographicalAreaId,
            )?.districts ?? [],
        [form.geographicalAreaId, options.geographicalAreas],
    );

    const updateQuery = (search) => {
        setQuery(search);
        router.get(
            "/business-plans",
            { search, page: 1, perPage: pageSize },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const goToPage = (nextPage) => {
        router.get(
            "/business-plans",
            { ...filters, page: nextPage, perPage: pageSize },
            { preserveState: true, preserveScroll: true },
        );
    };

    const openNewPlan = () => {
        setEditingPlan(null);
        setForm({ ...emptyForm });
        setFormError("");
        setIsFormOpen(true);
    };

    const openEditPlan = (plan) => {
        setEditingPlan(plan);
        setForm({ ...emptyForm, ...plan });
        setFormError("");
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingPlan(null);
        setFormError("");
    };

    const savePlan = (event) => {
        event.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        setFormError("");
        const url = editingPlan
            ? `/business-plans/${editingPlan.id}`
            : "/business-plans";
        const options = {
            preserveScroll: true,
            onSuccess: closeForm,
            onError: (errors) => setFormError(Object.values(errors).join(" ")),
            onFinish: () => setIsSaving(false),
        };

        if (editingPlan) {
            router.put(url, form, options);
        } else {
            router.post(url, form, options);
        }
    };

    return (
        <div className="flex min-h-0 flex-1 flex-col bg-[#f8f8f9]">
            <section className="flex-1 p-5 sm:p-8">
                <div className="mx-auto max-w-6xl">
                    {isFormOpen ? (
                        <>
                            <div className="mb-5 flex items-center justify-between">
                                <h1 className="text-3xl font-semibold text-gray-900">
                                    {editingPlan
                                        ? "Edit Business Plan"
                                        : "Add Business Plan"}
                                </h1>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="flex items-center gap-1.5 rounded-lg border border-gray-600 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                                >
                                    <ChevronLeft size={16} aria-hidden="true" />
                                    <span>Back</span>
                                </button>
                            </div>
                            <form
                                onSubmit={savePlan}
                                className="rounded-lg bg-white p-4 sm:p-5"
                            >
                                <div className="grid border-b border-gray-200 pb-4 gap-6 sm:grid-cols-3">
                                    <label className="flex min-w-0 items-center text-base font-medium text-gray-800">
                                        <span className="shrink-0 mr-2">
                                            Entity Name:
                                        </span>
                                        <input
                                            required
                                            type="text"
                                            value={form.entityName}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    entityName:
                                                        event.target.value,
                                                })
                                            }
                                            aria-label="Entity Name"
                                            placeholder="Type entity name"
                                            className="min-w-0 flex-1 rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm font-normal text-gray-800 outline-none focus:border-emerald-700 focus-visible:ring-1 focus-visible:ring-emerald-700"
                                        />
                                    </label>
                                    <label className="flex min-w-0 items-center text-base font-medium text-gray-800">
                                        <span className="shrink-0 mr-2">
                                            GA Name:
                                        </span>
                                        <Select
                                            value={options.geographicalAreas.find(
                                                (area) =>
                                                    area.value ===
                                                    form.geographicalAreaId,
                                            )}
                                            onChange={(selectedOption) =>
                                                setForm({
                                                    ...form,
                                                    geographicalAreaId:
                                                        selectedOption?.value ??
                                                        null,
                                                    districtId: null,
                                                })
                                            }
                                            options={options.geographicalAreas}
                                            placeholder="Select GA"
                                            aria-label="GA Name"
                                            className="min-w-0 flex-1 text-sm font-normal"
                                        />
                                    </label>
                                    <label className="flex min-w-0 items-center text-base font-medium text-gray-800">
                                        <span className="shrink-0 mr-2">
                                            District:
                                        </span>
                                        <Select
                                            value={districtOptions.find(
                                                (district) =>
                                                    district.value ===
                                                    form.districtId,
                                            )}
                                            onChange={(selectedOption) =>
                                                setForm({
                                                    ...form,
                                                    districtId:
                                                        selectedOption?.value ??
                                                        null,
                                                })
                                            }
                                            options={districtOptions}
                                            placeholder="Select District"
                                            aria-label="District"
                                            isDisabled={
                                                !form.geographicalAreaId
                                            }
                                            className="min-w-0 flex-1 text-sm font-normal"
                                        />
                                    </label>
                                </div>

                                <div className="mt-4 max-w-sm">
                                    <label className={labelClass}>
                                        <p className="mb-2 text-base font-medium text-gray-900">
                                            <span>
                                                Date
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </span>
                                        </p>
                                        <input
                                            required
                                            type="date"
                                            value={form.date}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    date: event.target.value,
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </label>
                                </div>

                                <p className="mb-3 mt-5 text-base font-medium text-gray-900">
                                    Segment
                                    <span className="text-red-500">*</span>
                                </p>

                                {/* Segment Fields Grid with Column Separation Margins */}
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {[
                                        ["transport", "Transport"],
                                        ["industrialMarket", "Industrial PNG"],
                                        ["commercial", "Commercial"],
                                        ["domestic", "Domestic"],
                                    ].map(([field, label]) => (
                                        <label key={field} className="block">
                                            <input
                                                required
                                                aria-label={label}
                                                placeholder={label}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={form[field]}
                                                onChange={(event) =>
                                                    setForm({
                                                        ...form,
                                                        [field]:
                                                            event.target.value.replace(
                                                                /\D/g,
                                                                "",
                                                            ),
                                                    })
                                                }
                                                className={inputClass}
                                            />
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="rounded bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
                                    >
                                        {isSaving
                                            ? "Saving..."
                                            : editingPlan
                                              ? "Update Business Plan"
                                              : "Add Business Plan"}
                                    </button>
                                </div>
                                {formError && (
                                    <p
                                        role="alert"
                                        className="mt-4 text-sm text-red-600"
                                    >
                                        {formError}
                                    </p>
                                )}
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Business Plan
                                </h1>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <label className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-400 focus-within:border-emerald-700">
                                        <Search size={18} aria-hidden="true" />
                                        <input
                                            type="search"
                                            value={query}
                                            onChange={(event) =>
                                                updateQuery(event.target.value)
                                            }
                                            placeholder="Search Business plans"
                                            aria-label="Search Business plans"
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

                            <div className="overflow-x-auto rounded-lg bg-white border border-gray-200">
                                <table className="w-full min-w-[900px] border-collapse text-center text-sm">
                                    <thead className="bg-[#e5e5e5] text-xs font-medium text-gray-800 border-b border-gray-200">
                                        <tr>
                                            <th className="px-3 py-3 border-r border-gray-200">
                                                Sl No
                                            </th>
                                            <th className="px-3 py-3 border-r border-gray-200">
                                                Entity Name
                                            </th>
                                            <th className="px-3 py-3 border-r border-gray-200">
                                                GA Name
                                            </th>
                                            <th className="px-3 py-3 border-r border-gray-200">
                                                District
                                            </th>
                                            <th className="px-3 py-3 border-r border-gray-200">
                                                Date
                                            </th>
                                            <th className="px-3 py-3 border-r border-gray-200">
                                                Transport
                                            </th>
                                            <th className="px-3 py-3 border-r border-gray-200">
                                                Industrial PNG
                                            </th>
                                            <th className="px-3 py-3 border-r border-gray-200">
                                                Commercial
                                            </th>
                                            <th className="px-3 py-3 border-r border-gray-200">
                                                Domestic
                                            </th>
                                            <th className="px-3 py-3 text-center">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-800">
                                        {plans.data.map((plan, index) => (
                                            <tr
                                                key={plan.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-3 py-3 border-r border-gray-200">
                                                    {(page - 1) * pageSize +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="px-3 py-3 border-r border-gray-200">
                                                    {plan.entityName}
                                                </td>
                                                <td className="px-3 py-3 border-r border-gray-200">
                                                    {plan.gaName}
                                                </td>
                                                <td className="px-3 py-3 border-r border-gray-200">
                                                    {plan.district}
                                                </td>
                                                <td className="px-3 py-3 border-r border-gray-200">
                                                    {formatDate(plan.date)}
                                                </td>
                                                <td className="px-3 py-3 border-r border-gray-200">
                                                    {plan.transport}
                                                </td>
                                                <td className="px-3 py-3 border-r border-gray-200">
                                                    {plan.industrialMarket}
                                                </td>
                                                <td className="px-3 py-3 border-r border-gray-200">
                                                    {plan.commercial}
                                                </td>
                                                <td className="px-3 py-3 border-r border-gray-200">
                                                    {plan.domestic}
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditPlan(plan)
                                                        }
                                                        aria-label={`Edit business plan for ${plan.gaName}`}
                                                        className="rounded bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700"
                                                    >
                                                        <PenBoxIcon
                                                            size={15}
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {plans.data.length === 0 && (
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
                                <div className="flex flex-col gap-3 px-5 py-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200">
                                    <span>
                                        Showing Showing {firstItem} to{" "}
                                        {lastItem} of {total} entries
                                    </span>
                                    <div
                                        className="flex items-center gap-1"
                                        aria-label="Pagination"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToPage(Math.max(1, page - 1))
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
                                                onClick={() => goToPage(number)}
                                                aria-label={`Page ${number}`}
                                                aria-current={
                                                    page === number
                                                        ? "page"
                                                        : undefined
                                                }
                                                className={`rounded px-2 py-1 ${page === number ? "bg-emerald-700 text-white" : "hover:bg-gray-100"}`}
                                            >
                                                {number}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    Math.min(
                                                        pageCount,
                                                        page + 1,
                                                    ),
                                                )
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
