import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authSlice from "./features/authSlice";
import entriesSlice from "./features/entriesSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  entries: entriesSlice,
})
export const store = configureStore({
  // reducer: {
  //   auth: authSlice,
  // },
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
