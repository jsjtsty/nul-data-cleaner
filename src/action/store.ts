import { configureStore } from '@reduxjs/toolkit';
import AgricultureMultipleReducer from './AgricultureMultiple';
import RouterReducer from './Router';
import AuthReducer from './Auth';
import GlobalAlertReducer from './GlobalAlert';

export const store = configureStore({
  reducer: {
    agricultureMultipleReducer: AgricultureMultipleReducer,
    routerReducer: RouterReducer,
    authReducer: AuthReducer,
    globalAlertReducer: GlobalAlertReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;