import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  view: "list", // 'list' | 'wizard' | 'preview'
  editMode: false,
  currentStep: 1,
  selectedReportId: null,
  reports: [
    {
      id: 1,
      date: "01/06/2025",
      // Step 1: Infrastructure
      domesticReg: "7054587",
      domesticLmc: "54831957",
      domesticCom: "1435",
      commercialReg: "7054587",
      commercialLmc: "54831957",
      commercialCom: "1435",
      industrialReg: "7054587",
      industrialLmc: "54831957",
      industrialCom: "1435",
      // Step 2: CNG Stations
      omcApplied: "587645",
      omcCom: "43467",
      cocoApplied: "3495756",
      cocoCom: "2421",
      oem: "43455",
      conversion: "35787989",
      // Step 3: Pipelines & OFC
      mdpeLaid: "64544",
      mdpeCom: "1320",
      mdpe20Laid: "24297886",
      mdpe20Com: "183653",
      steelStringing: "54767",
      steelCom: "24134",
      steelInchStringing: "49358785",
      steelInchCom: "3354",
      ofcPipeline: "647634",
      ofcMdpe: "234467",
      // Step 4: Sales
      pngDomestic: "43467",
      pngCommercial: "7553425",
      pngIndustrial: "76432",
      cngSales: "2421817553",
      directLng: "70543",
      compressionServices: "2431875654",
      forAggPga: "64936",
      forOthers: "3247",
    },
  ],
  formData: {
    date: "01/06/2025",
    domesticReg: "",
    domesticLmc: "",
    domesticCom: "",
    commercialReg: "",
    commercialLmc: "",
    commercialCom: "",
    industrialReg: "",
    industrialLmc: "",
    industrialCom: "",
    omcApplied: "",
    omcCom: "",
    cocoApplied: "",
    cocoCom: "",
    oem: "",
    conversion: "",
    mdpeLaid: "",
    mdpeCom: "",
    mdpe20Laid: "",
    mdpe20Com: "",
    steelStringing: "",
    steelCom: "",
    steelInchStringing: "",
    steelInchCom: "",
    ofcPipeline: "",
    ofcMdpe: "",
    pngDomestic: "",
    pngCommercial: "",
    pngIndustrial: "",
    cngSales: "",
    directLng: "",
    compressionServices: "",
    forAggPga: "",
    forOthers: "",
  },
};

const dprSlice = createSlice({
  name: "dpr",
  initialState,
  reducers: {
    setView: (state, action) => {
      state.view = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    startAddDpr: (state) => {
      state.editMode = false;
      state.currentStep = 1;
      state.formData = initialState.formData;
      state.view = "wizard";
    },
    startEditDpr: (state, action) => {
      const report = state.reports.find((r) => r.id === action.payload);
      if (report) {
        state.editMode = true;
        state.selectedReportId = report.id;
        state.formData = { ...report };
        state.currentStep = 1;
        state.view = "wizard";
      }
    },
    saveDpr: (state) => {
      if (state.editMode) {
        const index = state.reports.findIndex(
          (r) => r.id === state.selectedReportId,
        );
        if (index !== -1) {
          state.reports[index] = {
            id: state.selectedReportId,
            ...state.formData,
          };
        }
      } else {
        const newId =
          state.reports.length > 0
            ? Math.max(...state.reports.map((r) => r.id)) + 1
            : 1;
        state.reports.push({ id: newId, ...state.formData });
      }
      state.view = "list";
    },
  },
});

export const {
  setView,
  setCurrentStep,
  updateFormField,
  startAddDpr,
  startEditDpr,
  saveDpr,
} = dprSlice.actions;
export default dprSlice.reducer;
