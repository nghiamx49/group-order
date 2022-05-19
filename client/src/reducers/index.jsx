import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authenticateReducer from "./authenticate";
import cartReducer from "./cart";
import groupOrderReducer from "./groupOrder";
import themeReducer from "./themeReducer";
const rootReducer = combineReducers({
  authenticateReducer,
  cartReducer,
  groupOrderReducer,
  themeReducer,
});

const persistsConfig = {
  key: "root",
  storage,
  whitelist: ["authenticateReducer", "groupOrderReducer", "themeReducer"],
};

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedReducer = persistReducer(persistsConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);
