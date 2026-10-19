// import { useEffect, useMemo, useState } from "react";
// {
//   (useDispatch, useSelector);
// }
// ("react-redux");
// import { Pencil, Trash2 } from "lucide-react";
// import Header from "../components/Header";
// import { Field, Modal, Pagination, StatusBadge } from "../components/ui";
// import {
//   createItem,
//   deleteItem,
//   fetchList,
//   updateItem,
// } from "../store/slices/dataSlice";

// export default function DailyProgress() {
//   const dispatch = useDispatch();
//   const items = useSelector((s) => s.data.reports.items);
//   const bus = useSelector((s) => s.data.bus.items);
//   const gas = useSelector((s) => s.data.gas.items);
//   const [q, setQ] = useState("");
//   const [page, setPage] = useState(1);
//   const [modal, setModal] = useState(null);

//   useEffect(() => {
//     dispatch(fetchList("reports"));
//     dispatch(fetchList("bus"));
//     dispatch(fetchList("gas"));
//   }, [dispatch]);

//   const filtered = useMemo(
//     () =>
//       items.filter(
//         (r) =>
//           !q ||
//           `${r.entityName} ${r.buName} ${r.ga}`
//             .toLowerCase()
//             .includes(q.toLowerCase()),
//       ),
//     [items, q],
//   );
//   const pages = Math.max(1, Math.ceil(filtered.length / 8));
//   const rows = filtered.slice((page - 1) * 8, page * 8);

//   return (
//     <>
//       <Header title="Daily Progress Report" />
//       <div className="flex-1 p-5">
//         <div className="overflow-hidden rounded-xl bg-white shadow-sm">
//           <div className="flex items-center gap-3 p-4">
//             <input
//               className="tg-input max-w-xs"
//               placeholder="Search"
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//             />
//             <button
//               className="ml-auto tg-btn"
//               onClick={() =>
//                 setModal({ date: new Date().toISOString().slice(0, 10) })
//               }
//             >
//               + ADD REPORT
//             </button>
//           </div>
//           <table className="w-full text-left text-sm">
//             <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//               <tr>
//                 {[
//                   "S.No",
//                   "Date",
//                   "Entity",
//                   "BU",
//                   "GA",
//                   "Planned",
//                   "Actual",
//                   "Status",
//                   "Action",
//                 ].map((h) => (
//                   <th key={h} className="px-4 py-3 font-medium">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((r, i) => (
//                 <tr key={r.id} className="border-t">
//                   <td className="px-4 py-3">{(page - 1) * 8 + i + 1}</td>
//                   <td className="px-4 py-3">{r.date}</td>
//                   <td className="px-4 py-3">{r.entityName}</td>
//                   <td className="px-4 py-3">{r.buName}</td>
//                   <td className="px-4 py-3">{r.ga}</td>
//                   <td className="px-4 py-3">{r.planned}</td>
//                   <td className="px-4 py-3">{r.actual}</td>
//                   <td className="px-4 py-3">
//                     <StatusBadge value={r.status} />
//                   </td>
//                   <td className="px-4 py-3">
//                     <button
//                       className="mr-2 text-tg-green"
//                       onClick={() => setModal(r)}
//                     >
//                       <Pencil size={16} />
//                     </button>
//                     <button
//                       className="text-red-500"
//                       onClick={() =>
//                         dispatch(deleteItem({ key: "reports", id: r.id }))
//                       }
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <Pagination page={page} pages={pages} onPage={setPage} />
//         </div>
//       </div>
//       {modal && (
//         <ReportForm
//           initial={modal}
//           bus={bus}
//           gas={gas}
//           onClose={() => setModal(null)}
//           onSave={async (body) => {
//             if (modal.id)
//               await dispatch(
//                 updateItem({ key: "reports", id: modal.id, body }),
//               );
//             else await dispatch(createItem({ key: "reports", body }));
//             setModal(null);
//           }}
//         />
//       )}
//     </>
//   );
// }

// function ReportForm({ initial, bus, gas, onClose, onSave }) {
//   const [form, setForm] = useState({
//     date: initial.date || "",
//     entityName: initial.entityName || "HP",
//     buName: initial.buName || "",
//     ga: initial.ga || "",
//     planned: initial.planned || "",
//     actual: initial.actual || "",
//     status: initial.status || "On Track",
//   });
//   const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
//   return (
//     <Modal title={initial.id ? "Edit Report" : "Add Report"} onClose={onClose}>
//       <Field label="Date">
//         <input
//           className="tg-input"
//           type="date"
//           value={form.date}
//           onChange={(e) => set("date", e.target.value)}
//         />
//       </Field>
//       <Field label="Entity">
//         <input
//           className="tg-input"
//           value={form.entityName}
//           onChange={(e) => set("entityName", e.target.value)}
//         />
//       </Field>
//       <Field label="BU">
//         <select
//           className="tg-input"
//           value={form.buName}
//           onChange={(e) => set("buName", e.target.value)}
//         >
//           <option value="">Select</option>
//           {bus.map((b) => (
//             <option key={b.id}>{b.name}</option>
//           ))}
//         </select>
//       </Field>
//       <Field label="GA">
//         <select
//           className="tg-input"
//           value={form.ga}
//           onChange={(e) => set("ga", e.target.value)}
//         >
//           <option value="">Select</option>
//           {gas.map((g) => (
//             <option key={g.id}>{g.name}</option>
//           ))}
//         </select>
//       </Field>
//       <Field label="Planned">
//         <input
//           className="tg-input"
//           type="number"
//           value={form.planned}
//           onChange={(e) => set("planned", e.target.value)}
//         />
//       </Field>
//       <Field label="Actual">
//         <input
//           className="tg-input"
//           type="number"
//           value={form.actual}
//           onChange={(e) => set("actual", e.target.value)}
//         />
//       </Field>
//       <Field label="Status">
//         <select
//           className="tg-input"
//           value={form.status}
//           onChange={(e) => set("status", e.target.value)}
//         >
//           <option>On Track</option>
//           <option>Delayed</option>
//           <option>Completed</option>
//         </select>
//       </Field>
//       <button
//         className="tg-btn w-full"
//         onClick={() =>
//           onSave({
//             ...form,
//             planned: Number(form.planned) || 0,
//             actual: Number(form.actual) || 0,
//           })
//         }
//       >
//         SAVE
//       </button>
//     </Modal>
//   );
// }
