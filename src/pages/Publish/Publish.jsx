// פונקציה: Publish – פרסום נכס (טופס) למשתמש מחובר.
import React, { useState } from "react";
import styles from "./Publish.module.css";
import { Link, useNavigate } from "react-router-dom";
import PropertyForm from "../../components/PropertyForm/PropertyForm.jsx";
import { toast } from "react-toastify";
import api from "../../services/api.js";

export default function Publish() {
  const navigate = useNavigate();
  const [key, setKey] = useState(Date.now());

  // פונקציה: שליחת טופס – יצירת נכס והודעת הצלחה.
  const handleSubmit = async (data) => {
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

      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "שגיאה בפרסום נכס";

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("נדרשת התחברות מחדש");
        navigate("/login");
      } else {
        toast.error(errorMsg);
      }
    }
  };

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
