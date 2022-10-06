import { configureStore } from "@reduxjs/toolkit";
import mapBoxReducer from "components/MapBox/store/mapBox.slice";
import wizardSessionsReducer from "screens/WizardSessions/store/wizardSessions.slice";

const localState = localStorage.getItem("reduxState");
const persistedState = localState ? JSON.parse(localState) : {};
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  next(action);
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
};

export type GlobalAppState = ReturnType<typeof store.getState>;
const store = configureStore({
  reducer: {
    mapBox: mapBoxReducer,
    wizardSessions: wizardSessionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
  preloadedState: persistedState,
});

// Inferred type: { mapBox: MapBoxState , ...rest }
export type AppDispatch = typeof store.dispatch;

export default store;
