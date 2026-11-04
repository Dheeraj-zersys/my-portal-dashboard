import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import Select from "react-select";
import {
    ChevronLeft,
    ChevronRight,
    PenBoxIcon,
    Plus,
    Search,
    X,
} from "lucide-react";

const emptyGA = {
    name: "",
    stateId: null,
    districtIds: [],
    status: "Active",
};
const emptyBU = { name: "", status: "Active" };

const BusinessUnits = ({
    managerType,
    managers,
    filters,
    options,
    showSearch = false,
}) => {
    const isGA = managerType === "ga";
    const title = isGA ? "GA Manager" : "BU Manager";
    const entity = isGA ? "GA" : "BU";
    const emptyForm = isGA ? emptyGA : emptyBU;

    const [query, setQuery] = useState(filters.search ?? "");
    const [editingManager, setEditingManager] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const page = managers.meta.current_page;
    const pageCount = managers.meta.last_page;
    const pageSize = managers.meta.per_page;
    const total = managers.meta.total;
    const firstItem = total ? (page - 1) * pageSize + 1 : 0;
    const lastItem = Math.min(page * pageSize, total);

    const selectedGaNameFilter =
        (options.geographicalAreas ?? []).find(
            (option) => option.value === Number(filters.gaId),
        ) ?? null;
    const selectedStateFilter =
        (options.states ?? []).find(
            (option) => option.value === Number(filters.stateId),
        ) ?? null;
    const selectedDistrictFilter =
        (options.states ?? [])
            .flatMap((state) => state.districts)
            .find((option) => option.value === Number(filters.districtId)) ??
        null;

    const updateFilters = (changes) => {
        if ("search" in changes) {
            setQuery(changes.search ?? "");
        }

        const parameters = {
            ...filters,
            ...changes,
            page: 1,
            perPage: pageSize,
        };
        Object.keys(parameters).forEach((key) => {
            if (parameters[key] === null || parameters[key] === "") {
                delete parameters[key];
            }
        });

        router.get(
            isGA
                ? "/master-data/geographical-areas"
                : "/master-data/business-units",
            parameters,
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const goToPage = (nextPage) => {
        router.get(
            isGA
                ? "/master-data/geographical-areas"
                : "/master-data/business-units",
            { ...filters, page: nextPage, perPage: pageSize },
            { preserveState: true, preserveScroll: true },
        );
    };

    const openNewManager = () => {
        setEditingManager(null);
        setForm({ ...emptyForm });
        setFormError("");
        setIsFormOpen(true);
    };

    const openEditManager = (manager) => {
        setEditingManager(manager);
        setForm({
            ...emptyForm,
            ...manager,
            ...(isGA ? { districtIds: manager.districtIds ?? [] } : {}),
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
        if (isSaving) return;
        if (isGA && (!form.stateId || form.districtIds.length === 0)) {
            setFormError("Select a state and at least one district.");
            return;
        }

        setIsSaving(true);
        setFormError("");
        const url = isGA
            ? "/master-data/geographical-areas"
            : "/master-data/business-units";
        const endpoint = editingManager ? `${url}/${editingManager.id}` : url;
        const payload = { ...form };
        if (!editingManager) {
            delete payload.status;
        }
        const requestOptions = {
            preserveScroll: true,
            onSuccess: closeForm,
            onError: (errors) => setFormError(Object.values(errors).join(" ")),
            onFinish: () => setIsSaving(false),
        };

        if (editingManager) {
            router.put(endpoint, payload, requestOptions);
        } else {
            router.post(endpoint, payload, requestOptions);
        }
    };

    const districtOptions = useMemo(() => {
        const districts = selectedStateFilter
            ? selectedStateFilter.districts
            : (options.states ?? []).flatMap((state) => state.districts);
        return [
            ...new Map(
                districts.map((district) => [district.value, district]),
            ).values(),
        ];
    }, [options.states, selectedStateFilter]);

    const formDistrictOptions = useMemo(
        () =>
            (options.states ?? []).find(
                (state) => state.value === Number(form.stateId),
            )?.districts ?? [],
        [form.stateId, options.states],
    );

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: "#e5e7eb",
            boxShadow: "none",
            minHeight: "38px",
            borderRadius: "0.375rem",
            backgroundColor: "#ffffff",
            "&:hover": { borderColor: "#047857" },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af",
            fontSize: "0.875rem",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#1f2937",
            fontSize: "0.875rem",
        }),
        menuPortal: (provided) => ({ ...provided, zIndex: 30 }),
    };

    return (
        <div className="flex min-h-0 flex-1 flex-col bg-[#f8f8f9]">
            <section className="flex-1 p-5 sm:p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {title}
                        </h1>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            {showSearch && (
                                <label className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-400 focus-within:border-emerald-700">
                                    <Search size={17} aria-hidden="true" />
                                    <input
                                        type="search"
                                        value={query}
                                        onChange={(event) =>
                                            updateFilters({
                                                search: event.target.value,
                                            })
                                        }
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

                    {isGA && (
                        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <Select
                                value={selectedGaNameFilter}
                                onChange={(option) =>
                                    updateFilters({
                                        gaId: option?.value ?? null,
                                    })
                                }
                                options={options.geographicalAreas}
                                placeholder="GA Name"
                                isClearable
                                styles={customSelectStyles}
                            />
                            <Select
                                value={selectedStateFilter}
                                onChange={(option) =>
                                    updateFilters({
                                        stateId: option?.value ?? null,
                                        districtId: null,
                                    })
                                }
                                options={options.states}
                                placeholder="Select State"
                                isClearable
                                styles={customSelectStyles}
                            />
                            <Select
                                value={selectedDistrictFilter}
                                onChange={(option) =>
                                    updateFilters({
                                        districtId: option?.value ?? null,
                                    })
                                }
                                options={districtOptions}
                                placeholder="Select District"
                                isClearable
                                styles={customSelectStyles}
                            />
                        </div>
                    )}

                    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
                        <table className="w-full min-w-[640px] border-collapse text-center text-sm">
                            <thead className="bg-[#e5e5e5] text-xs font-semibold text-gray-800">
                                <tr>
                                    <th className="px-4 py-3 border-r border-gray-200">
                                        Sl No
                                    </th>
                                    <th className="px-4 py-3 border-r border-gray-200">
                                        {entity} Name
                                    </th>
                                    {isGA && (
                                        <>
                                            <th className="px-4 py-3 border-r border-gray-200">
                                                State
                                            </th>
                                            <th className="px-4 py-3 border-r border-gray-200">
                                                Districts
                                            </th>
                                        </>
                                    )}
                                    <th className="px-4 py-3 border-r border-gray-200">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 border-r border-gray-200">
                                        Created Date
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-800">
                                {managers.data.map((manager, index) => (
                                    <tr
                                        key={manager.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 border-r border-gray-200">
                                            {(page - 1) * pageSize + index + 1}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-200">
                                            {manager.name}
                                        </td>
                                        {isGA && (
                                            <>
                                                <td className="px-4 py-3 border-r border-gray-200">
                                                    {manager.state}
                                                </td>
                                                <td className="px-4 py-3 border-r border-gray-200">
                                                    {manager.districts?.join(
                                                        ", ",
                                                    )}
                                                </td>
                                            </>
                                        )}
                                        <td className="px-4 py-3 border-r border-gray-200">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold text-white ${manager.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                                            >
                                                {manager.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-200">
                                            {manager.createdDate}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditManager(manager)
                                                }
                                                aria-label={`Edit ${entity} ${manager.name}`}
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
                                {managers.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={isGA ? 7 : 5}
                                            className="px-4 py-10 text-center text-gray-500"
                                        >
                                            No {title.toLowerCase()} entries
                                            found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flex flex-col gap-3 px-5 py-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {firstItem} to {lastItem} of {total}{" "}
                                entries
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
                                            page === number ? "page" : undefined
                                        }
                                        className={`rounded px-2 py-1 ${page === number ? "bg-emerald-700 text-white" : "hover:bg-gray-100"}`}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(Math.min(pageCount, page + 1))
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
                                {editingManager
                                    ? `Edit ${entity}`
                                    : `Add ${entity}`}
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
                                    {entity} Name
                                    <span className="text-red-500">*</span>
                                </span>
                                <input
                                    required
                                    autoFocus
                                    value={form.name}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            name: event.target.value,
                                        })
                                    }
                                    placeholder={`Enter ${entity} Name`}
                                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-700"
                                />
                            </label>

                            {isGA && (
                                <>
                                    <label className="block space-y-1 text-xs font-medium text-gray-700">
                                        <span>
                                            State Coverage
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </span>
                                        <Select
                                            value={
                                                (options.states ?? []).find(
                                                    (state) =>
                                                        state.value ===
                                                        Number(form.stateId),
                                                ) ?? null
                                            }
                                            onChange={(option) =>
                                                setForm({
                                                    ...form,
                                                    stateId:
                                                        option?.value ?? null,
                                                    districtIds: [],
                                                })
                                            }
                                            options={options.states ?? []}
                                            placeholder="Select State Coverage"
                                            aria-label="State Coverage"
                                            styles={customSelectStyles}
                                            isClearable
                                        />
                                    </label>
                                    <fieldset className="space-y-1 text-xs font-medium text-gray-700">
                                        <legend>
                                            District Coverage
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </legend>
                                        <Select
                                            value={formDistrictOptions.filter(
                                                (district) =>
                                                    form.districtIds.includes(
                                                        district.value,
                                                    ),
                                            )}
                                            onChange={(selectedOptions) =>
                                                setForm({
                                                    ...form,
                                                    districtIds: (
                                                        selectedOptions ?? []
                                                    ).map(
                                                        (district) =>
                                                            district.value,
                                                    ),
                                                })
                                            }
                                            options={formDistrictOptions}
                                            placeholder={
                                                form.stateId
                                                    ? "Select District Coverage"
                                                    : "Select a state first"
                                            }
                                            aria-label="District Coverage"
                                            styles={customSelectStyles}
                                            isMulti
                                            isDisabled={!form.stateId}
                                            closeMenuOnSelect={false}
                                            menuPortalTarget={
                                                typeof document === "undefined"
                                                    ? undefined
                                                    : document.body
                                            }
                                        />
                                    </fieldset>
                                </>
                            )}
                            {editingManager && (
                                <label className="block space-y-1 text-xs font-medium text-gray-700">
                                    <span>
                                        Status
                                        <span className="text-red-500">*</span>
                                    </span>
                                    <Select
                                        value={
                                            options.statuses.find(
                                                (status) =>
                                                    status.value ===
                                                    form.status,
                                            ) ?? null
                                        }
                                        onChange={(option) =>
                                            setForm({
                                                ...form,
                                                status: option?.value ?? "",
                                            })
                                        }
                                        options={options.statuses}
                                        styles={customSelectStyles}
                                        isSearchable={false}
                                    />
                                </label>
                            )}
                        </div>

                        {formError && (
                            <p
                                role="alert"
                                className="mt-3 text-xs text-red-600"
                            >
                                {formError}
                            </p>
                        )}

                        <div className="mt-5 flex justify-center">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="rounded bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                            >
                                {isSaving
                                    ? "Saving..."
                                    : editingManager
                                      ? `Update ${entity}`
                                      : `Add ${entity}`}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BusinessUnits;
