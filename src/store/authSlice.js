import { createSlice } from "@reduxjs/toolkit";

// State התחלתי - ריק, הכל יבוא מהשרת
const initialState = {
  currentUser: null, // המשתמש המחובר (מהשרת)
  isAuthenticated: false,
};

// פונקציה: יצירת slice עבור אימות משתמשים.
// Redux משמש כ-cache זמני בלבד, הנתונים האמיתיים ב-MongoDB
const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // פונקציה: שמירת פרטי משתמש מחובר (אחרי login)
    setUser(state, action) {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    // פונקציה: התנתקות - ניקוי state
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = slice.actions;
export default slice.reducer;
