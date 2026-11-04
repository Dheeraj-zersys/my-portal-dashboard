import { useState } from "react";
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

const emptyEntity = {
    entityCode: "",
    name: "",
    stateId: null,
    gstin: "",
    vatNumber: "",
    cstNumber: "",
    cin: "",
    panNumber: "",
    tanNumber: "",
    registeredAddress: "",
    status: "Active",
};

const EntityManager = ({ managers, filters, options, showSearch = false }) => {
    const [query, setQuery] = useState(filters.search ?? "");
    const [editingManager, setEditingManager] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({ ...emptyEntity });
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const page = managers.meta.current_page;
    const pageCount = managers.meta.last_page;
    const pageSize = managers.meta.per_page;
    const total = managers.meta.total;
    const firstItem = total ? (page - 1) * pageSize + 1 : 0;
    const lastItem = Math.min(page * pageSize, total);

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

        router.get("/master-data/entities", parameters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const goToPage = (nextPage) => {
        router.get(
            "/master-data/entities",
            { ...filters, page: nextPage, perPage: pageSize },
            { preserveState: true, preserveScroll: true },
        );
    };

    const openNewManager = () => {
        setEditingManager(null);
        setForm({ ...emptyEntity });
        setFormError("");
        setIsFormOpen(true);
    };

    const openEditManager = (manager) => {
        setEditingManager(manager);
        setForm({ ...emptyEntity, ...manager });
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
        if (!form.entityCode || !form.name || !form.stateId) {
            setFormError("Please fill out all required fields marked with *.");
            return;
        }

        setIsSaving(true);
        setFormError("");
        const url = "/master-data/entities";
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

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: "#e5e7eb",
            boxShadow: "none",
            minHeight: "38px",
            borderRadius: "0.375rem",
            backgroundColor: "#ffffff",
            "&:hover": { borderColor: "#059669" },
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
                            Entity Manager
                        </h1>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            {showSearch && (
                                <label className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-400 focus-within:border-emerald-600">
                                    <Search size={17} aria-hidden="true" />
                                    <input
                                        type="search"
                                        value={query}
                                        onChange={(event) =>
                                            updateFilters({
                                                search: event.target.value,
                                            })
                                        }
                                        placeholder="Search Entities"
                                        aria-label="Search Entities"
                                        className="w-full bg-transparent text-sm text-gray-800 outline-none sm:w-44"
                                    />
                                </label>
                            )}
                            <button
                                type="button"
                                onClick={openNewManager}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                            >
                                <Plus size={16} aria-hidden="true" />
                                Add New Entity
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
                        <table className="w-full min-w-[640px] border-collapse text-center text-sm">
                            <thead className="bg-[#e5e5e5] text-xs font-semibold text-gray-800">
                                <tr>
                                    <th className="px-4 py-3 border-r border-gray-200">
                                        Sl No
                                    </th>
                                    <th className="px-4 py-3 border-r border-gray-200">
                                        Entity Name
                                    </th>
                                    <th className="px-4 py-3 border-r border-gray-200">
                                        Entity Code
                                    </th>
                                    <th className="px-4 py-3 border-r border-gray-200">
                                        GSTIN
                                    </th>
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
                                        <td className="px-4 py-3 border-r border-gray-200">
                                            {manager.entityCode}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-200">
                                            {manager.gstin || "-"}
                                        </td>
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
                                                aria-label={`Edit Entity ${manager.name}`}
                                                className="rounded bg-emerald-50 p-1.5 text-emerald-600 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-600"
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
                                            colSpan={7}
                                            className="px-4 py-10 text-center text-gray-500"
                                        >
                                            No entity entries found.
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
                                        className={`rounded px-2 py-1 ${page === number ? "bg-emerald-600 text-white" : "hover:bg-gray-100"}`}
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
                    className="fixed inset-0 z-20 flex items-center justify-center bg-black/25 p-4 overflow-y-auto"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeForm();
                    }}
                >
                    <form
                        onSubmit={saveManager}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="manager-dialog-title"
                        className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                            <h2
                                id="manager-dialog-title"
                                className="text-lg font-semibold text-gray-900"
                            >
                                {editingManager ? "Edit Entity" : "Add Entity"}
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="block space-y-1 text-xs font-medium text-gray-700">
                                <span>
                                    Entity Code
                                    <span className="text-red-500">*</span>
                                </span>
                                <input
                                    required
                                    autoFocus
                                    value={form.entityCode}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            entityCode: e.target.value,
                                        })
                                    }
                                    placeholder="Enter Entity Code"
                                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-600"
                                />
                            </label>

                            <label className="block space-y-1 text-xs font-medium text-gray-700">
                                <span>
                                    Entity Name
                                    <span className="text-red-500">*</span>
                                </span>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter Entity Name"
                                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-600"
                                />
                            </label>

                            <label className="block space-y-1 text-xs font-medium text-gray-700">
                                <span>
                                    State
                                    <span className="text-red-500">*</span>
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
                                            stateId: option?.value ?? null,
                                        })
                                    }
                                    options={options.states ?? []}
                                    placeholder="Select State"
                                    styles={customSelectStyles}
                                    isClearable
                                />
                            </label>

                            <label className="block space-y-1 text-xs font-medium text-gray-700">
                                <span>GSTIN</span>
                                <input
                                    value={form.gstin}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            gstin: e.target.value,
                                        })
                                    }
                                    placeholder="Enter GSTIN"
                                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-600"
                                />
                            </label>

                            <label className="block space-y-1 text-xs font-medium text-gray-700">
                                <span>VAT Number</span>
                                <input
                                    value={form.vatNumber}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            vatNumber: e.target.value,
                                        })
                                    }
                                    placeholder="Enter VAT Number"
                                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-600"
                                />
                            </label>

                            <label className="block space-y-1 text-xs font-medium text-gray-700">
                                <span>CST Number</span>
                                <input
                                    value={form.cstNumber}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            cstNumber: e.target.value,
                                        })
                                    }
                                    placeholder="Enter CST Number"
                                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-600"
                                />
                            </label>

                            <label className="block space-y-1 text-xs font-medium text-gray-700">
                                <span>CIN</span>
                                <input
                                    value={form.cin}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            cin: e.target.value,
                                        })
                                    }
                                    placeholder="Enter CIN"
                                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-600"
                                />
                            </label>

                            <label className="block space-y-1 text-xs font-medium text-gray-700">
                                <span>PAN Number</span>
                                <input
                                    value={form.panNumber}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            panNumber: e.target.value,
                                        })
                                    }
                                    placeholder="Enter PAN Number"
                                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-600"
                                />
                            </label>

                            <label className="block space-y-1 text-xs font-medium text-gray-700 sm:col-span-2">
                                <span>TAN Number</span>
                                <input
                                    value={form.tanNumber}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            tanNumber: e.target.value,
                                        })
                                    }
                                    placeholder="Enter TAN Number"
                                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-600 sm:w-1/2"
                                />
                            </label>

                            <label className="block space-y-1 text-xs font-medium text-gray-700 sm:col-span-2">
                                <span>Registered Address</span>
                                <textarea
                                    rows={3}
                                    value={form.registeredAddress}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            registeredAddress: e.target.value,
                                        })
                                    }
                                    placeholder="Enter Registered Address"
                                    className="w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-600"
                                />
                            </label>
                        </div>

                        {editingManager && (
                            <div className="mt-4">
                                <label className="block space-y-1 text-xs font-medium text-gray-700 sm:w-1/2">
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
                            </div>
                        )}

                        {formError && (
                            <p
                                role="alert"
                                className="mt-3 text-xs text-red-600"
                            >
                                {formError}
                            </p>
                        )}

                        <div className="mt-6 flex justify-center">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 rounded bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
                            >
                                <Plus size={16} aria-hidden="true" />
                                {isSaving
                                    ? "Saving..."
                                    : editingManager
                                      ? "Update Entity"
                                      : "Add Entity"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EntityManager;
