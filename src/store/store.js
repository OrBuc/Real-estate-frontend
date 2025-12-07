import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import propertiesReducer from "./propertiesSlice.js";

// פונקציה: יצירת store ואיחוד reducers.
// configureStore אוטומטית מגדיר Redux DevTools ו-middleware.
const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
  },
});

// הערה: localStorage מנוהל ידנית רק עבור JWT token ב-api.js
// כל שאר הנתונים נשמרים ב-MongoDB

export default store;
