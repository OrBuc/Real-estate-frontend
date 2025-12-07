import { createSlice } from "@reduxjs/toolkit";

// State התחלתי - ריק, הכל יבוא מהשרת
const initialState = {
  assets: [], // רשימת נכסים (תיטען מהשרת)
};

// פונקציה: יצירת slice לניהול נכסים.
// Redux משמש כ-cache זמני בלבד, הנתונים האמיתיים ב-MongoDB
const slice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    // פונקציה: שמירת רשימת נכסים (מהשרת)
    setProperties(state, action) {
      state.assets = action.payload;
    },

    // פונקציה: ניקוי רשימת נכסים
    clearProperties(state) {
      state.assets = [];
    },
  },
});

export const { setProperties, clearProperties } = slice.actions;
export default slice.reducer;
