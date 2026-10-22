import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import {
  ChevronLeft,
  ChevronRight,
  PenBoxIcon,
  Search,
  Plus,
} from "lucide-react";

const initialUsers = [
  {
    id: 1,
    name: "Sonal",
    email: "Sonal@gmail.com",
    phone: "0000000000",
    role: "Admin",
    status: "Active",
    unit: "BU 1",
    gaManager: "GA Manager",
    entity: "AGP",
  },
  {
    id: 2,
    name: "Tina",
    email: "Tina@gmail.com",
    phone: "0000000000",
    role: "Admin",
    status: "Active",
    unit: "BU 1",
    gaManager: "GA Manager",
    entity: "AGP",
  },
  {
    id: 3,
    name: "Rahul",
    email: "Rahul@gmail.com",
    phone: "0000000000",
    role: "Admin",
    status: "Active",
    unit: "BU 1",
    gaManager: "GA Manager",
    entity: "AGP",
  },
  {
    id: 4,
    name: "Amal",
    email: "Amal@gmail.com",
    phone: "0000000000",
    role: "Admin",
    status: "Active",
    unit: "BU 1",
    gaManager: "GA Manager",
    entity: "AGP",
  },
  {
    id: 5,
    name: "Priya",
    email: "Priya@gmail.com",
    phone: "0000000000",
    role: "User",
    status: "Active",
    unit: "BU 1",
    gaManager: "GA Manager",
    entity: "AGP",
  },
];

const pageSize = 5;
const usersStorageKey = "tg-portal-users";
const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "User",
  status: "Active",
  unit: "BU 1",
  gaManager: "",
  entity: "",
  password: "",
  confirmPassword: "",
};

const getSavedUsers = () => {
  try {
    const savedUsers = window.localStorage.getItem(usersStorageKey);
    if (savedUsers === null) return initialUsers;

    const parsedUsers = JSON.parse(savedUsers);
    if (Array.isArray(parsedUsers)) return parsedUsers;

    console.error("Saved users data is not a valid list.");
  } catch (error) {
    console.error("Unable to load saved users from local storage.", error);
  }
  return initialUsers;
};

const inputClass =
  "w-full rounded border border-gray-200 bg-[#f8f9fc] px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-700";
const labelClass = "space-y-1 text-xs font-medium text-gray-700";

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#f8f9fc",
    borderColor: state.isFocused ? "#047857" : "#e5e7eb",
    borderRadius: "0.375rem",
    minHeight: "38px",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.isFocused ? "#047857" : "#d1d5db",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 8px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0",
    color: "#1f2937",
    fontSize: "0.875rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1f2937",
    fontSize: "0.875rem",
  }),
};

const UsersContent = () => {
  const [users, setUsers] = useState(getSavedUsers);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return users;
    return users.filter((user) =>
      Object.values(user).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search),
      ),
    );
  }, [query, users]);
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const visibleUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(usersStorageKey, JSON.stringify(users));
    } catch (error) {
      console.error("Unable to save users to local storage.", error);
    }
  }, [users]);

  const openNewUser = () => {
    setEditingUser(null);
    setForm({ ...emptyForm });
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setForm({
      ...emptyForm,
      ...user,
      password: "",
      confirmPassword: "",
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setFormError("");
  };

  const saveUser = (event) => {
    event.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (!editingUser && !form.password) {
      setFormError("Enter a password for the new user.");
      return;
    }

    const userDetails = { ...form };
    delete userDetails.password;
    delete userDetails.confirmPassword;
    if (editingUser) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUser.id ? { ...user, ...userDetails } : user,
        ),
      );
    } else {
      setUsers((current) => [...current, { id: Date.now(), ...userDetails }]);
      setQuery("");
      setPage(Math.ceil((users.length + 1) / pageSize));
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
                <h1 className="text-3xl font-semibold text-gray-800">
                  {editingUser ? "Edit User" : "Add User"}
                </h1>
                <button
                  type="button"
                  onClick={closeForm}
                  className="border rounded-md pr-4 pl-4 pt-2 pb-2 px-3 py-1.5 text-sm text-gray-900 hover:bg-white"
                >
                  Back <ChevronLeft size={15} aria-hidden="true" />
                </button>
              </div>
              <form
                onSubmit={saveUser}
                className="rounded-lg bg-white p-5 shadow-sm sm:p-7"
              >
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    <p className=" text-sm font-medium text-gray-900">
                      <span>
                        Name <b className="text-red-500">*</b>
                      </span>
                    </p>
                    <input
                      required
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>

                  <div className={labelClass}>
                    <p className=" text-sm font-medium text-gray-900">
                      <span>
                        Role <b className="text-red-500">*</b>
                      </span>
                    </p>
                    <Select
                      value={{ value: form.role, label: form.role }}
                      onChange={(selectedOption) =>
                        setForm({ ...form, role: selectedOption.value })
                      }
                      options={[
                        { value: "Admin", label: "Admin" },
                        { value: "User", label: "User" },
                      ]}
                      styles={customSelectStyles}
                      isSearchable={false}
                    />
                  </div>

                  <label className={labelClass}>
                    <p className=" text-sm font-medium text-gray-900">
                      <span>
                        Email <b className="text-red-500">*</b>
                      </span>
                    </p>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm({ ...form, email: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>

                  <div className={labelClass}>
                    <p className=" text-sm font-medium text-gray-900">
                      <span>
                        Business Unit <b className="text-red-500">*</b>
                      </span>
                    </p>
                    <Select
                      value={{ value: form.unit, label: form.unit }}
                      onChange={(selectedOption) =>
                        setForm({ ...form, unit: selectedOption.value })
                      }
                      options={[
                        { value: "BU 1", label: "BU 1" },
                        { value: "BU 2", label: "BU 2" },
                      ]}
                      styles={customSelectStyles}
                      isSearchable={false}
                    />
                  </div>

                  <label className={labelClass}>
                    <p className=" text-sm font-medium text-gray-900">
                      <span>
                        Phone <b className="text-red-500">*</b>
                      </span>
                    </p>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        setForm({ ...form, phone: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className={labelClass}>
                    <p className=" text-sm font-medium text-gray-900">
                      <span>GA Name</span>
                    </p>
                    <input
                      value={form.gaManager}
                      onChange={(event) =>
                        setForm({ ...form, gaManager: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className={labelClass}>
                    <p className=" text-sm font-medium text-gray-900">
                      <span>
                        Password{" "}
                        {!editingUser && <b className="text-red-500">*</b>}
                      </span>
                    </p>
                    <input
                      required={!editingUser}
                      type="password"
                      value={form.password}
                      onChange={(event) =>
                        setForm({ ...form, password: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className={labelClass}>
                    <p className=" text-sm font-medium text-gray-900">
                      <span>
                        Confirm Password{" "}
                        {!editingUser && <b className="text-red-500">*</b>}
                      </span>
                    </p>
                    <input
                      required={!editingUser}
                      type="password"
                      value={form.confirmPassword}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          confirmPassword: event.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className={labelClass}>
                    <p className=" text-sm font-medium text-gray-900">
                      <span>Entity</span>
                    </p>
                    <input
                      value={form.entity}
                      onChange={(event) =>
                        setForm({ ...form, entity: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                </div>
                {formError && (
                  <p role="alert" className="mt-4 text-sm text-red-600">
                    {formError}
                  </p>
                )}
                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    className="rounded bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                  >
                    {editingUser ? "Update User" : "Add User"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Users</h1>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-400 focus-within:border-emerald-700">
                    <Search size={17} aria-hidden="true" color="#62666d" />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Search users"
                      aria-label="Search users"
                      className="w-full bg-transparent text-sm text-gray-800 outline-none sm:w-44"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={openNewUser}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                  >
                    <Plus size={16} aria-hidden="true" />
                    Add New User
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg bg-white border border-gray-200">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="bg-[#e5e5e5] text-xs font-semibold text-gray-900 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 border-r border-gray-200">
                        Sl No
                      </th>
                      <th className="px-4 py-3 border-r border-gray-200">
                        Name
                      </th>
                      <th className="px-4 py-3 border-r border-gray-200">
                        Email
                      </th>
                      <th className="px-4 py-3 border-r border-gray-200">
                        Phone
                      </th>
                      <th className="px-4 py-3 border-r border-gray-200">
                        Role
                      </th>
                      <th className="px-4 py-3 border-r border-gray-200">
                        Status
                      </th>
                      <th className="px-4 py-3 border-r border-gray-200">
                        Business Unit
                      </th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-800">
                    {visibleUsers.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border-r border-gray-200">
                          {(page - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200">
                          {user.name}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200">
                          {user.phone}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200">
                          {user.role}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold text-white ${user.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200">
                          {user.unit}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => openEditUser(user)}
                            aria-label={`Edit ${user.name}`}
                            className="rounded bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700"
                          >
                            <PenBoxIcon size={17} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {visibleUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-4 py-10 text-center text-gray-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="flex flex-col gap-3 px-5 py-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200">
                  <span>
                    Showing{" "}
                    {filteredUsers.length ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredUsers.length)} of{" "}
                    {filteredUsers.length} entries
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

export default UsersContent;
