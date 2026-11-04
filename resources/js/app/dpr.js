import { createSlice } from "@reduxjs/toolkit";

const emptyForm = {
    date: "",
    geographicalAreaId: null,
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
};

const initialState = {
    view: "list",
    editMode: false,
    currentStep: 1,
    selectedReportId: null,
    formData: { ...emptyForm },
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
            state.selectedReportId = null;
            state.formData = { ...emptyForm };
            state.view = "wizard";
        },
        startEditDpr: (state, action) => {
            const report = action.payload;
            state.editMode = true;
            state.selectedReportId = report.id;
            state.formData = { ...emptyForm, ...report };
            state.currentStep = 1;
            state.view = "wizard";
        },
    },
});

export const {
    setView,
    setCurrentStep,
    updateFormField,
    startAddDpr,
    startEditDpr,
} = dprSlice.actions;
export default dprSlice.reducer;
