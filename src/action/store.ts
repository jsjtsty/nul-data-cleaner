import { configureStore } from '@reduxjs/toolkit';
import AgricultureMultipleReducer from './AgricultureMultiple';

export const store = configureStore({
  reducer: {
    agricultureMultipleReducer: AgricultureMultipleReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;