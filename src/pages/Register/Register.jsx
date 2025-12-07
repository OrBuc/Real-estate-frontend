import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validate = () => {
    if (!username || !email || !password) {
      toast.error("יש למלא את כל השדות");
      return false;
    }
    return true;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      const res = await api.post("/auth/register", {
        name: username,
        email,
        password,
      });

      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));

      toast.success("נרשמת בהצלחה! אפשר להתחבר");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "שגיאה בהרשמה"
      );
    }
  };

  return (
    <section>
      <h2>הרשמה</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label>שם משתמש</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

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

        <button type="submit">הרשמה</button>
      </form>
    </section>
  );
}
