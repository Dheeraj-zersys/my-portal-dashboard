import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PenBoxIcon, Eye } from "lucide-react";
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
      (rep.domesticCom && rep.domesticCom.toLowerCase().includes(term)) ||
      (rep.commercialCom && rep.commercialCom.toLowerCase().includes(term)) ||
      (rep.industrialCom && rep.industrialCom.toLowerCase().includes(term))
    );
  });
  const displayedReports = filteredReports.slice(0, pageSize);

  return (
    <div className="min-h-0 bg-gray-50 p-6">
      {view === "list" && (
        <div>
          <div className="flex justify-between items-center mr-8 mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              Daily Progress Report
            </h1>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search progress report"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 w-64"
              />
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
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#e5e5e5] text-xs font-semibold text-gray-800 border-b border-gray-200">
                    <th className="p-3">Sl No</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Domestic Connections</th>
                    <th className="p-3">Commercial</th>
                    <th className="p-3">Industrial</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((rep, idx) => (
                    <tr
                      key={rep.id}
                      className="border-b border-gray-100 hover:bg-gray-50 last:border-b-0"
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">{rep.date}</td>
                      <td className="p-3">{rep.domesticCom || "0"}</td>
                      <td className="p-3">{rep.commercialCom || "0"}</td>
                      <td className="p-3">{rep.industrialCom || "0"}</td>
                      <td className="p-3 flex items-center gap-3">
                        <button
                          onClick={() => dispatch(setView("preview"))}
                          className="text-emerald-600 hover:text-emerald-800"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => dispatch(startEditDpr(rep.id))}
                          className="text-emerald-600 hover:text-emerald-800"
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
                Showing {filteredReports.length > 0 ? 1 : 0} to{" "}
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
        <div className="bg-white rounded-lg border border-gray-200 p-5 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 pb-3">
            <h2 className="text-2xl font-bold text-gray-800">
              {editMode ? "Edit DPR" : "Add DPR"}
            </h2>
            <button
              onClick={() => dispatch(setView("list"))}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium"
            >
              Back
            </button>
          </div>

          <div className="mb-4">
            <p className="text-2xl font-semibold text-gray-700 mb-1">
              Step {currentStep} of 4{" "}
              {
                ["Infrastructure", "CNG Stations", "Pipelines & OFC", "Sales"][
                  currentStep - 1
                ]
              }
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
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    dispatch(
                      updateFormField({ field: "date", value: e.target.value }),
                    )
                  }
                  className="w-full md:w-1/3 border rounded p-2 text-sm"
                />
              </div>
              <h3 className="font-semibold text-md text-gray-800 pt-2">
                Domestic Connections
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-600">Registration*</label>
                  <input
                    type="text"
                    value={formData.domesticReg}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "domesticReg",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Last Mile Connectivity*
                  </label>
                  <input
                    type="text"
                    value={formData.domesticLmc}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "domesticLmc",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Commissioned*</label>
                  <input
                    type="text"
                    value={formData.domesticCom}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "domesticCom",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-md text-gray-800 pt-2">
                Commercial
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Registration*</label>
                  <input
                    type="text"
                    value={formData.commercialReg}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "commercialReg",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Commissioned*</label>
                  <input
                    type="text"
                    value={formData.commercialCom}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "commercialCom",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-md text-gray-800 pt-2">
                Industrial
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Registration*</label>
                  <input
                    type="text"
                    value={formData.industrialReg}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "industrialReg",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Commissioned*</label>
                  <input
                    type="text"
                    value={formData.industrialCom}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "industrialCom",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-gray-800">
                No. of CNG Stations
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">
                    OMC - Final PESO Applied*
                  </label>
                  <input
                    type="text"
                    value={formData.omcApplied}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "omcApplied",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Commissioned*</label>
                  <input
                    type="text"
                    value={formData.omcCom}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "omcCom",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    COCO/CODO/DODO - Final PESO Applied*
                  </label>
                  <input
                    type="text"
                    value={formData.cocoApplied}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "cocoApplied",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Commissioned*</label>
                  <input
                    type="text"
                    value={formData.cocoCom}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "cocoCom",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
              <h3 className="font-bold text-sm text-gray-800 pt-2">
                CNG Vehicle
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">OEM*</label>
                  <input
                    type="text"
                    value={formData.oem}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "oem",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Conversion*</label>
                  <input
                    type="text"
                    value={formData.conversion}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "conversion",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-gray-800">
                MDPE Pipeline (in Km.)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Laid*</label>
                  <input
                    type="text"
                    value={formData.mdpeLaid}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "mdpeLaid",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Commissioned*</label>
                  <input
                    type="text"
                    value={formData.mdpeCom}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "mdpeCom",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Laid - 20mm*</label>
                  <input
                    type="text"
                    value={formData.mdpe20Laid}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "mdpe20Laid",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Commissioned-20mm*
                  </label>
                  <input
                    type="text"
                    value={formData.mdpe20Com}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "mdpe20Com",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
              <h3 className="font-bold text-sm text-gray-800 pt-2">
                Steel Pipeline (in Km.)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Stringing*</label>
                  <input
                    type="text"
                    value={formData.steelStringing}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "steelStringing",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Commissioned*</label>
                  <input
                    type="text"
                    value={formData.steelCom}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "steelCom",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Stringing (in Inch Km.)*
                  </label>
                  <input
                    type="text"
                    value={formData.steelInchStringing}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "steelInchStringing",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Commissioned*</label>
                  <input
                    type="text"
                    value={formData.steelInchCom}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "steelInchCom",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
              <h3 className="font-bold text-sm text-gray-800 pt-2">
                OFC Duct Laying
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">
                    With Steel Pipeline(kms)*
                  </label>
                  <input
                    type="text"
                    value={formData.ofcPipeline}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "ofcPipeline",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    With MDPE(kms)*
                  </label>
                  <input
                    type="text"
                    value={formData.ofcMdpe}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "ofcMdpe",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-gray-800">
                Total Sales(SCM)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">
                    PNG Domestic Sales(SCM)*
                  </label>
                  <input
                    type="text"
                    value={formData.pngDomestic}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "pngDomestic",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    PNG Commercial Sales(SCM) est*
                  </label>
                  <input
                    type="text"
                    value={formData.pngCommercial}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "pngCommercial",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    PNG Industrial Sales*
                  </label>
                  <input
                    type="text"
                    value={formData.pngIndustrial}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "pngIndustrial",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">CNG Sales*</label>
                  <input
                    type="text"
                    value={formData.cngSales}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "cngSales",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
              <h3 className="font-bold text-sm text-gray-800 pt-2">
                Compression Services
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">
                    Direct LNG Sales*
                  </label>
                  <input
                    type="text"
                    value={formData.directLng}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "directLng",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Compression Services*
                  </label>
                  <input
                    type="text"
                    value={formData.compressionServices}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "compressionServices",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">For AG&PGA*</label>
                  <input
                    type="text"
                    value={formData.forAggPga}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "forAggPga",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">For Others*</label>
                  <input
                    type="text"
                    value={formData.forOthers}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "forOthers",
                          value: e.target.value,
                        }),
                      )
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wizard Action Controls */}
          <div className="flex justify-between items-center mt-8 pt-4">
            {currentStep > 1 ? (
              <button
                onClick={() => dispatch(setCurrentStep(currentStep - 1))}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                onClick={() => dispatch(setCurrentStep(currentStep + 1))}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded text-sm font-medium"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => dispatch(setView("previewPart1"))}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded text-sm font-medium"
              >
                Preview Sales
              </button>
            )}
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
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium"
            >
              Back
            </button>
          </div>
          <div className="text-center font-semibold text-xs text-gray-700 mb-4">
            Date: {formData.date}
          </div>
          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 border-r w-12 text-center">Sl No</th>
                  <th className="p-2 border-r w-36">Infrastructure</th>
                  <th className="p-2 border-r">For the Day</th>
                  <th className="p-2 border-r">Cumulative for the Month</th>
                  <th className="p-2 border-r">Cumulative CY 2025</th>
                  <th className="p-2 border-r">Cumulative CY 2024</th>
                  <th className="p-2 border-r">Cumulative till Dec 2023</th>
                  <th className="p-2">Cumulative till Dec 2023</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td
                    className="p-2 border-r text-center font-medium"
                    rowSpan="3"
                  >
                    1
                  </td>
                  <td className="p-2 border-r font-medium" rowSpan="3">
                    Domestic Connections
                  </td>
                  <td className="p-2 border-r">Registration</td>
                  <td className="p-2 border-r">{formData.domesticReg}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Last Mile Connectivity</td>
                  <td className="p-2 border-r">{formData.domesticLmc}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Commissioned</td>
                  <td className="p-2 border-r">{formData.domesticCom}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td
                    className="p-2 border-r text-center font-medium"
                    rowSpan="2"
                  >
                    2
                  </td>
                  <td className="p-2 border-r font-medium" rowSpan="2">
                    Commercial
                  </td>
                  <td className="p-2 border-r">Registration</td>
                  <td className="p-2 border-r">{formData.commercialReg}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Last Mile Connectivity</td>
                  <td className="p-2 border-r">
                    {formData.commercialLmc || "-"}
                  </td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td
                    className="p-2 border-r text-center font-medium"
                    rowSpan="2"
                  >
                    3
                  </td>
                  <td className="p-2 border-r font-medium" rowSpan="2">
                    Industrial
                  </td>
                  <td className="p-2 border-r">Registration</td>
                  <td className="p-2 border-r">{formData.industrialReg}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Last Mile Connectivity</td>
                  <td className="p-2 border-r">
                    {formData.industrialLmc || "-"}
                  </td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td
                    className="p-2 border-r text-center font-medium"
                    rowSpan="4"
                  >
                    4
                  </td>
                  <td className="p-2 border-r font-medium" rowSpan="4">
                    No. of CNG Stations
                  </td>
                  <td className="p-2 border-r">OMC Final PESO Applied</td>
                  <td className="p-2 border-r">{formData.omcApplied}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Commissioned</td>
                  <td className="p-2 border-r">{formData.omcCom}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">COCO/CODO Final PESO Applied</td>
                  <td className="p-2 border-r">{formData.cocoApplied}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Commissioned</td>
                  <td className="p-2 border-r">{formData.cocoCom}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td
                    className="p-2 border-r text-center font-medium"
                    rowSpan="3"
                  >
                    5
                  </td>
                  <td className="p-2 border-r font-medium" rowSpan="3">
                    CNG Vehicles
                  </td>
                  <td className="p-2 border-r">OEM</td>
                  <td className="p-2 border-r">{formData.oem}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Conversion</td>
                  <td className="p-2 border-r">{formData.conversion}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r font-semibold">Total</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td
                    className="p-2 border-r text-center font-medium"
                    rowSpan="4"
                  >
                    6
                  </td>
                  <td className="p-2 border-r font-medium" rowSpan="4">
                    MDPE Pipeline (kms.)
                  </td>
                  <td className="p-2 border-r">Laid</td>
                  <td className="p-2 border-r">{formData.mdpeLaid}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Commissioned</td>
                  <td className="p-2 border-r">{formData.mdpeCom}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Laid - 20mm</td>
                  <td className="p-2 border-r">{formData.mdpe20Laid}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Commissioned-20mm</td>
                  <td className="p-2 border-r">{formData.mdpe20Com}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td
                    className="p-2 border-r text-center font-medium"
                    rowSpan="2"
                  >
                    7
                  </td>
                  <td className="p-2 border-r font-medium" rowSpan="2">
                    Steel Pipeline (In Km.)
                  </td>
                  <td className="p-2 border-r">Stringing</td>
                  <td className="p-2 border-r">{formData.steelStringing}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Commissioned</td>
                  <td className="p-2 border-r">{formData.steelCom}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td
                    className="p-2 border-r text-center font-medium"
                    rowSpan="2"
                  >
                    8
                  </td>
                  <td className="p-2 border-r font-medium" rowSpan="2">
                    Steel Pipeline (In Inch Km.)
                  </td>
                  <td className="p-2 border-r">Stringing</td>
                  <td className="p-2 border-r">
                    {formData.steelInchStringing}
                  </td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r">Commissioned</td>
                  <td className="p-2 border-r">{formData.steelInchCom}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td
                    className="p-2 border-r text-center font-medium"
                    rowSpan="2"
                  >
                    9
                  </td>
                  <td className="p-2 border-r font-medium" rowSpan="2">
                    OFC Duct Laying
                  </td>
                  <td className="p-2 border-r">With Steel Pipeline (kms.)</td>
                  <td className="p-2 border-r">{formData.ofcPipeline}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr>
                  <td className="p-2 border-r">With MDPE (kms.)</td>
                  <td className="p-2 border-r">{formData.ofcMdpe}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
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
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium"
            >
              Back
            </button>
          </div>
          <div className="text-center font-semibold text-xs text-gray-700 mb-4">
            Date: {formData.date}
          </div>
          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 border-r w-12 text-center">Sl No</th>
                  <th className="p-2 border-r w-36">Sales</th>
                  <th className="p-2 border-r">For the Day</th>
                  <th className="p-2 border-r">Cumulative for the Month</th>
                  <th className="p-2 border-r">Cumulative CY 2025</th>
                  <th className="p-2 border-r">Cumulative CY 2024</th>
                  <th className="p-2 border-r">Cumulative till Dec 2023</th>
                  <th className="p-2">Cumulative till Dec 2023</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 border-r text-center font-medium">10</td>
                  <td className="p-2 border-r font-medium">
                    PNG Domestic Sales (SCM)
                  </td>
                  <td className="p-2 border-r">{formData.pngDomestic}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r text-center font-medium">11</td>
                  <td className="p-2 border-r font-medium">
                    PNG Commercial Sales (SCM)
                  </td>
                  <td className="p-2 border-r">{formData.pngCommercial}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r text-center font-medium">12</td>
                  <td className="p-2 border-r font-medium">
                    PNG Industrial Sales
                  </td>
                  <td className="p-2 border-r">{formData.pngIndustrial}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r text-center font-medium">13</td>
                  <td className="p-2 border-r font-medium">CNG Sales</td>
                  <td className="p-2 border-r">{formData.cngSales}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r text-center font-medium">14</td>
                  <td className="p-2 border-r font-medium">Direct LNG Sales</td>
                  <td className="p-2 border-r">{formData.directLng}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r text-center font-medium">15</td>
                  <td className="p-2 border-r font-medium">
                    Compression Services
                  </td>
                  <td className="p-2 border-r">
                    {formData.compressionServices}
                  </td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r text-center font-medium">16</td>
                  <td className="p-2 border-r font-medium">For AG&PGA</td>
                  <td className="p-2 border-r">{formData.forAggPga}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr>
                  <td className="p-2 border-r text-center font-medium">17</td>
                  <td className="p-2 border-r font-medium">For Others</td>
                  <td className="p-2 border-r">{formData.forOthers}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
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
              className="text-gray-500 hover:text-gray-700 font-semibold text-sm"
            >
              Back to List
            </button>
          </div>
          <div className="text-center font-semibold text-sm text-gray-700 mb-4">
            Date: {formData.date}
          </div>
          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 border-r">Infrastructure</th>
                  <th className="p-2 border-r">For the Day</th>
                  <th className="p-2 border-r">Cumulative for the Month</th>
                  <th className="p-2 border-r">Cumulative CY 2025</th>
                  <th className="p-2 border-r">Cumulative CY 2024</th>
                  <th className="p-2">Cumulative till Dec 2023</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 border-r font-medium">Domestic LMC</td>
                  <td className="p-2 border-r">{formData.domesticLmc}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r font-medium">
                    Commercial Commissioned
                  </td>
                  <td className="p-2 border-r">{formData.commercialCom}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r font-medium">
                    Industrial Commissioned
                  </td>
                  <td className="p-2 border-r">{formData.industrialCom}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r font-medium">
                    CNG Station (OMC)
                  </td>
                  <td className="p-2 border-r">{formData.omcCom}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 border-r font-medium">MDPE Laid (Km)</td>
                  <td className="p-2 border-r">{formData.mdpeLaid}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2">-</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-medium">CNG Sales (SCM)</td>
                  <td className="p-2 border-r">{formData.cngSales}</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
                  <td className="p-2 border-r">-</td>
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
