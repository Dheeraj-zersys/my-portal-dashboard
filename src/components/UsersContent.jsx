import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserRoundPlus,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
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
  },
  {
    id: 2,
    name: "Tina",
    email: "Tina@gmail.com",
    phone: "0000000000",
    role: "Admin",
    status: "Active",
    unit: "BU 1",
  },
  {
    id: 3,
    name: "Rahul",
    email: "Rahul@gmail.com",
    phone: "0000000000",
    role: "Admin",
    status: "Active",
    unit: "BU 1",
  },
  {
    id: 4,
    name: "Amal",
    email: "Amal@gmail.com",
    phone: "0000000000",
    role: "Admin",
    status: "Active",
    unit: "BU 1",
  },
  {
    id: 5,
    name: "Priya",
    email: "Priya@gmail.com",
    phone: "0000000000",
    role: "User",
    status: "Active",
    unit: "BU 1",
  },
];

const pageSize = 4;
const usersStorageKey = "tg-portal-users";
const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "User",
  status: "Active",
  unit: "BU 1",
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

const UsersContent = () => {
  const [users, setUsers] = useState(getSavedUsers);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return users;
    return users.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(search),
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
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      unit: user.unit,
    });
    setIsDialogOpen(true);
  };

  const saveUser = (event) => {
    event.preventDefault();
    if (editingUser) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUser.id ? { ...user, ...form } : user,
        ),
      );
    } else {
      setUsers((current) => [...current, { id: Date.now(), ...form }]);
      setQuery("");
      setPage(Math.ceil((users.length + 1) / pageSize));
    }
    setIsDialogOpen(false);
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f8f8f9]">
      <section className="flex-1 p-5 sm:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
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
                <UserRoundPlus size={16} aria-hidden="true" />
                Add New User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-[#e5e5e5] text-xs font-semibold text-gray-800">
                <tr>
                  <th className="px-4 py-5">Sl No</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Business Unit</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {visibleUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold text-white ${user.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{user.unit}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => openEditUser(user)}
                        aria-label={`Edit ${user.name}`}
                        className="rounded bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700"
                      >
                        <Pencil size={15} aria-hidden="true" />
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

            <div className="flex flex-col gap-3 px-5 py-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredUsers.length ? (page - 1) * pageSize + 1 : 0}{" "}
                to {Math.min(page * pageSize, filteredUsers.length)} of{" "}
                {filteredUsers.length} entries
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

      {isDialogOpen && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-dialog-title"
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="user-dialog-title"
                className="text-lg font-semibold text-gray-900"
              >
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close dialog"
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>
            <form onSubmit={saveUser} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-gray-700">
                  <span>Name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-emerald-700"
                  />
                </label>
                <label className="space-y-1 text-sm text-gray-700">
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-emerald-700"
                  />
                </label>
                <label className="space-y-1 text-sm text-gray-700">
                  <span>Phone</span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-emerald-700"
                  />
                </label>
                <label className="space-y-1 text-sm text-gray-700">
                  <span>Role</span>
                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm({ ...form, role: event.target.value })
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-emerald-700"
                  >
                    <option>Admin</option>
                    <option>User</option>
                  </select>
                </label>
                <label className="space-y-1 text-sm text-gray-700">
                  <span>Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-emerald-700"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
                <label className="space-y-1 text-sm text-gray-700">
                  <span>Business Unit</span>
                  <select
                    value={form.unit}
                    onChange={(event) =>
                      setForm({ ...form, unit: event.target.value })
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-emerald-700"
                  >
                    <option>BU 1</option>
                    <option>BU 2</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                >
                  {editingUser ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default UsersContent;
