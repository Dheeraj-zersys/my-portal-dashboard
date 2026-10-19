import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setView,
  startAddDpr,
  startEditDpr,
  setCurrentStep,
  updateFormField,
  saveDpr,
} from "../app/dpr";
// const [searchTerm, setSearchTerm] = React.useState("");
export default function DprModule() {
  const dispatch = useDispatch();
  const { view, currentStep, editMode, reports, formData } = useSelector(
    (state) => state.dpr,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {view === "list" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">
              Daily Progress Report
            </h1>
            <button
              onClick={() => dispatch(startAddDpr())}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
            >
              + Add DPR
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
                  <th className="p-3">Sl No</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Domestic Connections</th>
                  <th className="p-3">Commercial</th>
                  <th className="p-3">Industrial</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((rep, idx) => (
                  <tr
                    key={rep.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">{rep.date}</td>
                    <td className="p-3">{rep.domesticCom || "0"}</td>
                    <td className="p-3">{rep.commercialCom || "0"}</td>
                    <td className="p-3">{rep.industrialCom || "0"}</td>
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => dispatch(startEditDpr(rep.id))}
                        className="text-emerald-600 hover:text-emerald-800"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => dispatch(setView("preview"))}
                        className="text-blue-600 hover:text-blue-800"
                        title="Preview"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "wizard" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-lg font-bold text-gray-800">
              {editMode ? "Edit DPR" : "Add DPR"}
            </h2>
            <button
              onClick={() => dispatch(setView("list"))}
              className="text-gray-500 hover:text-gray-700 font-semibold text-sm"
            >
              Back
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Step {currentStep} of 4:{" "}
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
                <label className="block text-xs font-semibold text-gray-600 mb-1">
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
              <h3 className="font-bold text-sm text-gray-800 pt-2">
                Domestic Connections
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Registration*</label>
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
              <h3 className="font-bold text-sm text-gray-800 pt-2">
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
              <h3 className="font-bold text-sm text-gray-800 pt-2">
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
          <div className="flex justify-between items-center mt-8 pt-4 border-t">
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
                onClick={() => {
                  dispatch(saveDpr());
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded text-sm font-medium"
              >
                Preview / Save
              </button>
            )}
          </div>
        </div>
      )}

      {view === "preview" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-5xl mx-auto">
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
