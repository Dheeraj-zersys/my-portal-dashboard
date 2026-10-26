import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PenBoxIcon, Eye, ChevronLeft, Search } from "lucide-react";
import {
  setView,
  startAddDpr,
  startEditDpr,
  setCurrentStep,
  updateFormField,
  saveDpr,
} from "../app/dpr";

export default function DprModule() {
  const dispatch = useDispatch();
  const { view, currentStep, editMode, reports, formData } = useSelector(
    (state) => state.dpr,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);

  const filteredReports = reports.filter((rep) => {
    const term = searchTerm.toLowerCase();
    return (
      (rep.date && rep.date.toLowerCase().includes(term)) ||
      (rep.domesticReg && rep.domesticReg.toLowerCase().includes(term)) ||
      (rep.domesticLmc && rep.domesticLmc.toLowerCase().includes(term)) ||
      (rep.domesticCom && rep.domesticCom.toLowerCase().includes(term)) ||
      (rep.commercialReg && rep.commercialReg.toLowerCase().includes(term)) ||
      (rep.commercialCom && rep.commercialCom.toLowerCase().includes(term)) ||
      (rep.industrialReg && rep.industrialReg.toLowerCase().includes(term)) ||
      (rep.industrialCom && rep.industrialCom.toLowerCase().includes(term))
    );
  });
  const displayedReports = filteredReports.slice(0, pageSize);

  const inputClassName =
    "w-full bg-gray-50/50 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-colors";

  return (
    <div className="min-h-0 bg-gray-50 p-6">
      {view === "list" && (
        <div>
          <div className="flex justify-between items-center mr-8 mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              Daily Progress Report
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <Search
                  size={17}
                  aria-hidden="true"
                  className="absolute left-3 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 w-64 bg-white"
                />
              </div>
              <button
                onClick={() => dispatch(startAddDpr())}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
              >
                + Add DPR
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm ">
                <thead>
                  <tr className="bg-[#e5e5e5] text-xs font-semibold text-gray-800 border-b border-gray-300 text-center">
                    <th className="p-3 border-r border-gray-300" rowSpan="2">
                      Sl. No
                    </th>
                    <th className="p-3 border-r border-gray-300" rowSpan="2">
                      Date
                    </th>
                    <th className="p-3 border-r border-gray-300" colSpan="3">
                      Domestic Connections
                    </th>
                    <th className="p-3 border-r border-gray-300" colSpan="2">
                      Commercial
                    </th>
                    <th className="p-3 border-r border-gray-300" colSpan="2">
                      Industrial
                    </th>
                    <th className="p-3" rowSpan="2">
                      Action
                    </th>
                  </tr>
                  <tr className="bg-[#e5e5e5] text-xs font-semibold text-gray-800 border-b border-gray-300">
                    <th className="p-2 border-r border-gray-300 font-medium">
                      Registration
                    </th>
                    <th className="p-2 border-r border-gray-300 font-medium">
                      Last Mile Connectivity
                    </th>
                    <th className="p-2 border-r border-gray-300 font-medium">
                      Commissioned
                    </th>
                    <th className="p-2 border-r border-gray-300 font-medium">
                      Registration
                    </th>
                    <th className="p-2 border-r border-gray-300 font-medium">
                      Commissioned
                    </th>
                    <th className="p-2 border-r border-gray-300 font-medium">
                      Registration
                    </th>
                    <th className="p-2 border-r border-gray-300 font-medium">
                      Commissioned
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((rep, idx) => (
                    <tr
                      key={rep.id}
                      className="border-b border-gray-300 hover:bg-gray-50 last:border-b-0"
                    >
                      <td className="p-3 border-r border-gray-300 text-center">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {rep.date}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {rep.domesticReg || "0"}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {rep.domesticLmc || "0"}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {rep.domesticCom || "0"}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {rep.commercialReg || "0"}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {rep.commercialCom || "0"}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {rep.industrialReg || "0"}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {rep.industrialCom || "0"}
                      </td>
                      <td className="p-3 flex items-center gap-3">
                        <button
                          onClick={() => dispatch(setView("preview"))}
                          className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 p-1.5 rounded"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => dispatch(startEditDpr(rep.id))}
                          className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 p-1.5 rounded"
                          title="Edit"
                        >
                          <PenBoxIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 p-4 border-t border-gray-100 bg-white">
              <div>
                Showing data {filteredReports.length > 0 ? 1 : 0} to{" "}
                {filteredReports.length} of {reports.length} entries
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="px-2 py-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled
                >
                  &lt;
                </button>
                <button className="bg-emerald-700 text-white px-3 py-1 rounded text-xs font-medium">
                  1
                </button>
                <button
                  className="px-2 py-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "wizard" && (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 mr-8">
            <h2 className="text-3xl font-semibold text-gray-800">
              {editMode ? "Edit DPR" : "Add DPR"}
            </h2>
            <button
              type="button"
              onClick={() => dispatch(setView("list"))}
              className="flex items-center gap-1.5 rounded-lg border border-gray-600 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              <span>Back</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-800 mb-2">
                Step {currentStep} of 4{" "}
                <span className="text-gray-800 font-normal ml-6">
                  {
                    [
                      "Infrastructure",
                      "CNG Stations",
                      "Pipelines & OFC",
                      "Sales",
                    ][currentStep - 1]
                  }
                </span>
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "date",
                          value: e.target.value,
                        }),
                      )
                    }
                    className={`w-full md:w-1/3 ${inputClassName}`}
                  />
                </div>
                <h3 className="font-semibold text-sm text-gray-800 pt-2">
                  Domestic Connections
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Registration*
                    </label>
                    <input
                      type="text"
                      placeholder="Registration"
                      value={formData.domesticReg}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "domesticReg",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Last Mile Connectivity*
                    </label>
                    <input
                      type="text"
                      placeholder="Last Mile Connectivity"
                      value={formData.domesticLmc}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "domesticLmc",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Commissioned*
                    </label>
                    <input
                      type="text"
                      placeholder="Commissioned"
                      value={formData.domesticCom}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "domesticCom",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-gray-800 pt-2">
                  Commercial
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Registration*
                    </label>
                    <input
                      type="text"
                      placeholder="Registration"
                      value={formData.commercialReg}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "commercialReg",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Commissioned*
                    </label>
                    <input
                      type="text"
                      placeholder="Commissioned"
                      value={formData.commercialCom}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "commercialCom",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-gray-800 pt-2">
                  Industrial
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Registration*
                    </label>
                    <input
                      type="text"
                      placeholder="Registration"
                      value={formData.industrialReg}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "industrialReg",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Commissioned*
                    </label>
                    <input
                      type="text"
                      placeholder="Commissioned"
                      value={formData.industrialCom}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "industrialCom",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-800">
                  No. of CNG Stations
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      OMC - Final PESO Applied*
                    </label>
                    <input
                      type="text"
                      placeholder="Final PESO Applied"
                      value={formData.omcApplied}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "omcApplied",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Commissioned*
                    </label>
                    <input
                      type="text"
                      placeholder="Commissioned"
                      value={formData.omcCom}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "omcCom",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      COCO/CODO/DODO - Final PESO Applied*
                    </label>
                    <input
                      type="text"
                      placeholder="Final PESO Applied"
                      value={formData.cocoApplied}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "cocoApplied",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Commissioned*
                    </label>
                    <input
                      type="text"
                      placeholder="Commissioned"
                      value={formData.cocoCom}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "cocoCom",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-gray-800 pt-2">
                  CNG Vehicle
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      OEM*
                    </label>
                    <input
                      type="text"
                      placeholder="OEM"
                      value={formData.oem}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "oem",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Conversion*
                    </label>
                    <input
                      type="text"
                      placeholder="Conversion"
                      value={formData.conversion}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "conversion",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-800">
                  MDPE Pipeline (in Km.)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Laid*
                    </label>
                    <input
                      type="text"
                      placeholder="Laid"
                      value={formData.mdpeLaid}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "mdpeLaid",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Commissioned*
                    </label>
                    <input
                      type="text"
                      placeholder="Commissioned"
                      value={formData.mdpeCom}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "mdpeCom",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Laid - 20mm*
                    </label>
                    <input
                      type="text"
                      placeholder="Laid - 20mm"
                      value={formData.mdpe20Laid}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "mdpe20Laid",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Commissioned-20mm*
                    </label>
                    <input
                      type="text"
                      placeholder="Commissioned-20mm"
                      value={formData.mdpe20Com}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "mdpe20Com",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-gray-800 pt-2">
                  Steel Pipeline (in Km.)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Stringing*
                    </label>
                    <input
                      type="text"
                      placeholder="Stringing"
                      value={formData.steelStringing}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "steelStringing",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Commissioned*
                    </label>
                    <input
                      type="text"
                      placeholder="Commissioned"
                      value={formData.steelCom}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "steelCom",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Stringing (in Inch Km.)*
                    </label>
                    <input
                      type="text"
                      placeholder="Stringing (in Inch Km.)"
                      value={formData.steelInchStringing}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "steelInchStringing",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Commissioned*
                    </label>
                    <input
                      type="text"
                      placeholder="Commissioned"
                      value={formData.steelInchCom}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "steelInchCom",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-gray-800 pt-2">
                  OFC Duct Laying
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      With Steel Pipeline(kms)*
                    </label>
                    <input
                      type="text"
                      placeholder="With Steel Pipeline(kms)"
                      value={formData.ofcPipeline}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "ofcPipeline",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      With MDPE(kms)*
                    </label>
                    <input
                      type="text"
                      placeholder="With MDPE(kms)"
                      value={formData.ofcMdpe}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "ofcMdpe",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-800">
                  Total Sales(SCM)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      PNG Domestic Sales(SCM)*
                    </label>
                    <input
                      type="text"
                      placeholder="PNG Domestic Sales(SCM)"
                      value={formData.pngDomestic}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "pngDomestic",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      PNG Commercial Sales(SCM) est*
                    </label>
                    <input
                      type="text"
                      placeholder="PNG Commercial Sales(SCM) est"
                      value={formData.pngCommercial}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "pngCommercial",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      PNG Industrial Sales*
                    </label>
                    <input
                      type="text"
                      placeholder="PNG Industrial Sales"
                      value={formData.pngIndustrial}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "pngIndustrial",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      CNG Sales*
                    </label>
                    <input
                      type="text"
                      placeholder="CNG Sales"
                      value={formData.cngSales}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "cngSales",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-gray-800 pt-2">
                  Compression Services
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Direct LNG Sales*
                    </label>
                    <input
                      type="text"
                      placeholder="Direct LNG Sales"
                      value={formData.directLng}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "directLng",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Compression Services*
                    </label>
                    <input
                      type="text"
                      placeholder="Compression Services"
                      value={formData.compressionServices}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "compressionServices",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      For AG&PGA*
                    </label>
                    <input
                      type="text"
                      placeholder="For AG&PGA"
                      value={formData.forAggPga}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "forAggPga",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      For Others*
                    </label>
                    <input
                      type="text"
                      placeholder="For Others"
                      value={formData.forOthers}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "forOthers",
                            value: e.target.value,
                          }),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Action Controls */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
              {currentStep > 1 ? (
                <button
                  onClick={() => dispatch(setCurrentStep(currentStep - 1))}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-600 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={() => dispatch(setCurrentStep(currentStep + 1))}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded text-sm font-medium transition-colors ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => dispatch(setView("previewPart1"))}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded text-sm font-medium transition-colors ml-auto"
                >
                  Preview Sales
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW PART 1 */}
      {view === "previewPart1" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-lg font-bold text-gray-800">Preview</h2>
            <button
              onClick={() => dispatch(setView("wizard"))}
              className="flex items-center gap-1.5 rounded-lg border border-gray-600 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Back
            </button>
          </div>
          <div className="text-center font-semibold text-xs text-gray-700 mb-4">
            Date: {formData.date}
          </div>
          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-xs text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-2 border-r border-gray-300 w-12 text-center">
                    Sl No
                  </th>
                  <th className="p-2 border-r border-gray-300 w-36">
                    Infrastructure
                  </th>
                  <th className="p-2 border-r border-gray-300">For the Day</th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative for the Month
                  </th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative CY 2025
                  </th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative CY 2024
                  </th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative till Dec 2023
                  </th>
                  <th className="p-2">Cumulative till Dec 2023</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td
                    className="p-2 border-r border-gray-300 text-center font-medium"
                    rowSpan="3"
                  >
                    1
                  </td>
                  <td
                    className="p-2 border-r border-gray-300 font-medium"
                    rowSpan="3"
                  >
                    Domestic Connections
                  </td>
                  <td className="p-2 border-r border-gray-300">Registration</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.domesticReg}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">
                    Last Mile Connectivity
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.domesticLmc}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">Commissioned</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.domesticCom}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td
                    className="p-2 border-r border-gray-300 text-center font-medium"
                    rowSpan="2"
                  >
                    2
                  </td>
                  <td
                    className="p-2 border-r border-gray-300 font-medium"
                    rowSpan="2"
                  >
                    Commercial
                  </td>
                  <td className="p-2 border-r border-gray-300">Registration</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.commercialReg}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">
                    Last Mile Connectivity
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.commercialLmc || "-"}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td
                    className="p-2 border-r border-gray-300 text-center font-medium"
                    rowSpan="2"
                  >
                    3
                  </td>
                  <td
                    className="p-2 border-r border-gray-300 font-medium"
                    rowSpan="2"
                  >
                    Industrial
                  </td>
                  <td className="p-2 border-r border-gray-300">Registration</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.industrialReg}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">
                    Last Mile Connectivity
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.industrialLmc || "-"}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td
                    className="p-2 border-r border-gray-300 text-center font-medium"
                    rowSpan="4"
                  >
                    4
                  </td>
                  <td
                    className="p-2 border-r border-gray-300 font-medium"
                    rowSpan="4"
                  >
                    No. of CNG Stations
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    OMC Final PESO Applied
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.omcApplied}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">Commissioned</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.omcCom}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">
                    COCO/CODO Final PESO Applied
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.cocoApplied}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">Commissioned</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.cocoCom}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td
                    className="p-2 border-r border-gray-300 text-center font-medium"
                    rowSpan="3"
                  >
                    5
                  </td>
                  <td
                    className="p-2 border-r border-gray-300 font-medium"
                    rowSpan="3"
                  >
                    CNG Vehicles
                  </td>
                  <td className="p-2 border-r border-gray-300">OEM</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.oem}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">Conversion</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.conversion}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 font-semibold">
                    Total
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td
                    className="p-2 border-r border-gray-300 text-center font-medium"
                    rowSpan="4"
                  >
                    6
                  </td>
                  <td
                    className="p-2 border-r border-gray-300 font-medium"
                    rowSpan="4"
                  >
                    MDPE Pipeline (kms.)
                  </td>
                  <td className="p-2 border-r border-gray-300">Laid</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.mdpeLaid}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">Commissioned</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.mdpeCom}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">Laid - 20mm</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.mdpe20Laid}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">
                    Commissioned-20mm
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.mdpe20Com}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td
                    className="p-2 border-r border-gray-300 text-center font-medium"
                    rowSpan="2"
                  >
                    7
                  </td>
                  <td
                    className="p-2 border-r border-gray-300 font-medium"
                    rowSpan="2"
                  >
                    Steel Pipeline (In Km.)
                  </td>
                  <td className="p-2 border-r border-gray-300">Stringing</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.steelStringing}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">Commissioned</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.steelCom}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td
                    className="p-2 border-r border-gray-300 text-center font-medium"
                    rowSpan="2"
                  >
                    8
                  </td>
                  <td
                    className="p-2 border-r border-gray-300 font-medium"
                    rowSpan="2"
                  >
                    Steel Pipeline (In Inch Km.)
                  </td>
                  <td className="p-2 border-r border-gray-300">Stringing</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.steelInchStringing}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">Commissioned</td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.steelInchCom}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td
                    className="p-2 border-r border-gray-300 text-center font-medium"
                    rowSpan="2"
                  >
                    9
                  </td>
                  <td
                    className="p-2 border-r border-gray-300 font-medium"
                    rowSpan="2"
                  >
                    OFC Duct Laying
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    With Steel Pipeline (kms.)
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.ofcPipeline}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-gray-300">
                    With MDPE (kms.)
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.ofcMdpe}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => dispatch(setView("previewPart2"))}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded text-sm font-medium"
            >
              Preview Sales
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW PART 2 */}
      {view === "previewPart2" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-lg font-bold text-gray-800">Preview</h2>
            <button
              onClick={() => dispatch(setView("previewPart1"))}
              className="flex items-center gap-1.5 rounded-lg border border-gray-600 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Back
            </button>
          </div>
          <div className="text-center font-semibold text-xs text-gray-700 mb-4">
            Date: {formData.date}
          </div>
          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-xs text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-2 border-r border-gray-300 w-12 text-center">
                    Sl No
                  </th>
                  <th className="p-2 border-r border-gray-300 w-36">Sales</th>
                  <th className="p-2 border-r border-gray-300">For the Day</th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative for the Month
                  </th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative CY 2025
                  </th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative CY 2024
                  </th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative till Dec 2023
                  </th>
                  <th className="p-2">Cumulative till Dec 2023</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 text-center font-medium">
                    10
                  </td>
                  <td className="p-2 border-r border-gray-300 font-medium">
                    PNG Domestic Sales (SCM)
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.pngDomestic}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 text-center font-medium">
                    11
                  </td>
                  <td className="p-2 border-r border-gray-300 font-medium">
                    PNG Commercial Sales (SCM)
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.pngCommercial}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 text-center font-medium">
                    12
                  </td>
                  <td className="p-2 border-r border-gray-300 font-medium">
                    PNG Industrial Sales
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.pngIndustrial}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 text-center font-medium">
                    13
                  </td>
                  <td className="p-2 border-r border-gray-300 font-medium">
                    CNG Sales
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.cngSales}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 text-center font-medium">
                    14
                  </td>
                  <td className="p-2 border-r border-gray-300 font-medium">
                    Direct LNG Sales
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.directLng}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 text-center font-medium">
                    15
                  </td>
                  <td className="p-2 border-r border-gray-300 font-medium">
                    Compression Services
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.compressionServices}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 text-center font-medium">
                    16
                  </td>
                  <td className="p-2 border-r border-gray-300 font-medium">
                    For AG&PGA
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.forAggPga}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-gray-300 text-center font-medium">
                    17
                  </td>
                  <td className="p-2 border-r border-gray-300 font-medium">
                    For Others
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.forOthers}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => dispatch(saveDpr())}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded text-sm font-medium"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* SINGLE VIEW PREVIEW FALLBACK */}
      {view === "preview" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-lg font-bold text-gray-800">
              Preview DPR Report
            </h2>
            <button
              onClick={() => dispatch(setView("list"))}
              className="flex items-center gap-1.5 rounded-lg border border-gray-600 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Back
            </button>
          </div>
          <div className="text-center font-semibold text-sm text-gray-700 mb-4">
            Date: {formData.date}
          </div>
          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-xs text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-2 border-r border-gray-300">
                    Infrastructure
                  </th>
                  <th className="p-2 border-r border-gray-300">For the Day</th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative for the Month
                  </th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative CY 2025
                  </th>
                  <th className="p-2 border-r border-gray-300">
                    Cumulative CY 2024
                  </th>
                  <th className="p-2">Cumulative till Dec 2023</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 font-medium">
                    Domestic LMC
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.domesticLmc}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 font-medium">
                    Commercial Commissioned
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.commercialCom}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 font-medium">
                    Industrial Commissioned
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.industrialCom}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 font-medium">
                    CNG Station (OMC)
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.omcCom}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300 font-medium">
                    MDPE Laid (Km)
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.mdpeLaid}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-gray-300 font-medium">
                    CNG Sales (SCM)
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {formData.cngSales}
                  </td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2 border-r border-gray-300">-</td>
                  <td className="p-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => dispatch(saveDpr())}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded text-sm font-medium"
            >
              Submit Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
