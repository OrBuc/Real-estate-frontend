// פונקציה: Publish – פרסום נכס (טופס) למשתמש מחובר.
import React, { useState } from "react";
import styles from "./Publish.module.css";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PropertyForm from "../../components/PropertyForm/PropertyForm.jsx";
import { toast } from "react-toastify";
import api from "../../services/api.js";

export default function Publish() {
  const navigate = useNavigate();
  const userId = useSelector((s) => s.auth.session?.userId);
  const [key, setKey] = useState(Date.now());

  // פונקציה: שליחת טופס – יצירת נכס והודעת הצלחה.
  const handleSubmit = async (data) => {
    // בדיקה אם יש token (אימות חדש)
    const token = localStorage.getItem("authToken");
    
    if (!token && !userId) {
      toast.error("יש להתחבר כדי לפרסם נכס");
      navigate("/login");
      return;
    }

    if (!token) {
      toast.error("אנא התחבר מחדש דרך המערכת");
      navigate("/login");
      return;
    }

    try {
      await api.post("/properties", data);
      toast.success("הנכס פורסם בהצלחה! מעבר לדף הנכסים שלך...");
      // ניקוי הטופס על ידי החלפת המפתח
      setKey(Date.now());
      // מעבר לדשבורד אחרי שנייה
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", error.response?.data?.message);
      console.error("Error error field:", error.response?.data?.error);
      
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "שגיאה בפרסום נכס";
      
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("נדרשת התחברות מחדש");
        navigate("/login");
      } else {
        toast.error(errorMsg);
      }
    }
  };

  // בדיקה אם יש token תקף
  const token = localStorage.getItem("authToken");

  // פונקציה: הצגת הודעה למשתמש לא מחובר.
  if (!token && !userId) {
    return (
      <div className={styles.wrap}>
        <div className={styles.notice}>
          <h2>פרסום נכס דורש התחברות</h2>
          <p>כדי לפרסם נכס, עליך להיות מחובר למערכת.</p>
          <div className={styles.actions}>
            <Link to="/login" className="btn">
              התחבר
            </Link>
            <Link to="/register" className="btn secondary">
              הרשם
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // אם יש userId אבל אין token - צריך להתחבר מחדש
  if (userId && !token) {
    return (
      <div className={styles.wrap}>
        <div className={styles.notice}>
          <h2>נדרשת התחברות מחדש</h2>
          <p>בגלל שיפורי אבטחה במערכת, נדרשת התחברות מחדש.</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            (הנתונים הישנים שלך נשמרו, רק צריך להתחבר מחדש)
          </p>
          <div className={styles.actions}>
            <Link to="/login" className="btn">
              התחבר מחדש
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h2>פרסם נכס</h2>
      <PropertyForm
        key={key}
        onCancel={() => navigate(-1)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
