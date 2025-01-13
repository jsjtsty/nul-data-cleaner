import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, store } from "./store";

// 1. Params for reducers.

interface NavigateParams {
  url: string;
  state?: object;
}

// 2. State and initial value definition.

interface RouterState {
  activated: boolean;
  navigation: NavigateParams;
}

const initialState: RouterState = {
  activated: false,
  navigation: {
    url: ''
  }
};

// 3. Slice definition.

const routerSlice = createSlice({
  name: 'router',
  initialState: initialState,
  reducers: {
    navigate: (state, action: PayloadAction<NavigateParams>) => {
      state.activated = true;
      state.navigation = action.payload;
    }
  }
});

// 4. Exports for this module.

export default routerSlice.reducer;
export const routerActions = routerSlice.actions;
export const selectRouterNavigation = (root: RootState) => root.routerReducer.navigation;
export const selectRouterActivated = (root: RootState) => root.routerReducer.activated;

// 5. Helper functions.

/**
 * Navigate to the specified url with params using the root navigator.
 * @param url the destination of the navigation
 * @param state state to handle to the destination, not necessary
 */
export const navigate = (url: string, state?: object): void => {
  store.dispatch(routerActions.navigate({ url, state }));
};