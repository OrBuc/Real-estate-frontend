import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import api from "../../services/api";
import { setUser } from "../../store/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ולידציה בסיסית – כמו אצלך
  const validate = () => {
    if (!email || !password) {
      toast.error("יש למלא אימייל וסיסמה");
      return false;
    }
    return true;
  };

  // פונקציה: שליחת טופס והתחברות
  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      // אימות מול ה-backend
      const res = await api.post("/auth/login", { email, password });

      // שמירת JWT token וה-user ב-localStorage
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));

      // עדכון Redux (cache זמני)
      dispatch(setUser(res.data.user));

      toast.success("התחברת בהצלחה");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "שגיאה בהתחברות"
      );
    }
  };

  return (
    <section>
      <h2>התחברות</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label>אימייל</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>סיסמה</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">התחברות</button>
      </form>
    </section>
  );
}
