import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState, store } from "./store";

// 1. Params for reducers.

interface GlobalAlertParams {
  severity?: 'info' | 'warning' | 'success';
  title: string;
  message: string;
}

// 2. State and initial value definition.

interface GlobalAlertState {
  activated: boolean;
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'success';
}

const initialState: GlobalAlertState = {
  activated: false,
  title: '',
  message: ''
}

// 3. Slice definition.

const globalAlertSlice = createSlice({
  name: 'globalAlert',
  initialState: initialState,
  reducers: {
    clear: (state) => {
      state.activated = false;
    },
    post: (state, action: PayloadAction<GlobalAlertParams>) => {
      state.activated = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    }
  }
});

export default globalAlertSlice.reducer;
export const globalAlertActions = globalAlertSlice.actions;
export const selectGlobalAlertActivated = (root: RootState) => root.globalAlertReducer.activated;
export const selectGlobalAlertTitle = (root: RootState) => root.globalAlertReducer.title;
export const selectGlobalAlertMessage = (root: RootState) => root.globalAlertReducer.message;
export const selectGlobalAlertSeverity = (root: RootState) => root.globalAlertReducer.severity;

export function postGlobalAlert(title: string, message: string, severity?: 'info' | 'warning' | 'success') {
  store.dispatch(globalAlertActions.post({ title, message, severity }));
}