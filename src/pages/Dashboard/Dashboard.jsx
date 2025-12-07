/** Dashboard.jsx - דף ניהול הנכסים האישי.
 *
 * תפקידים:
 * --------
 * 1. הצגת רשימת הנכסים של המשתמש המחובר
 * 2. הוספת נכס חדש דרך Modal
 * 3. עריכת נכס קיים
 * 4. מחיקת נכס (עם אישור)
 * 5. שינוי סטטוס (זמין/נמכר)
 *
 * State Management:
 * -----------------
 * - קורא session ו-users מ-Redux לזיהוי המשתמש
 * - קורא assets ומסנן רק את הנכסים של המשתמש
 * - שולח actions: addProperty, updateProperty, deleteProperty, toggleStatus
 *
 * Local State:
 * -----------
 * - isOpen: האם ה-Modal פתוח
 * - editing: הנכס שנערך כרגע (null = הוספה חדשה)
 *
 * זרימת עבודה:
 * ------------
 * 1. לחיצה על "הוסף נכס" → פותח Modal ריק
 * 2. לחיצה על "ערוך" → פותח Modal עם נתוני הנכס
 * 3. שמירה → dispatch ל-Redux + סגירת Modal
 * 4. מחיקה → אישור + dispatch
 * 5. שינוי סטטוס → dispatch מיידי
 *
 * CSS Modules:
 * -----------
 * - styles.header: כותרת עם כפתור
 */

import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import PropertyCard from "../../components/PropertyCard/PropertyCard.jsx";
import PropertyForm from "../../components/PropertyForm/PropertyForm.jsx";
import { setProperties } from "../../store/propertiesSlice.js";
import { toast } from "react-toastify";
import api from "../../services/api.js";

// פונקציה: קומפוננטת ניהול נכסים - רשימה + הוספה/עריכה/מחיקה/סטטוס.
export default function Dashboard() {
  const dispatch = useDispatch();

  // קריאת נתוני אימות מ-localStorage (backend user)
  const [currentUser, setCurrentUser] = useState(null);
  const [myAssets, setMyAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // טעינת המשתמש המחובר
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    setCurrentUser(user);
  }, []);

  // טעינת נכסי המשתמש מהשרת
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchProperties = async () => {
      try {
        const res = await api.get(`/properties?userId=${currentUser.id}`);
        setMyAssets(res.data);
        dispatch(setProperties(res.data));
      } catch (error) {
        toast.error("שגיאה בטעינת נכסים");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentUser, dispatch]);

  // State מקומי לניהול Modal
  const [isOpen, setIsOpen] = useState(false); // האם Modal פתוח
  const [editing, setEditing] = useState(null); // נכס נוכחי לעריכה

  // פונקציה: פתיחת מודאל ליצירה.
  // מאפס את editing כדי שהטופס יהיה ריק.
  const openNew = () => {
    setEditing(null);
    setIsOpen(true);
  };

  // פונקציה: פתיחת מודאל לעריכה.
  // שומר את הנכס ב-editing כדי שהטופס יטען אותו.
  const openEdit = (item) => {
    setEditing(item);
    setIsOpen(true);
  };

  // פונקציה: שמירת טופס (הוספה/עדכון) וסגירה.
  const handleSubmit = async (data) => {
    if (!currentUser) return;

    try {
      if (editing) {
        // מצב עריכה - עדכן נכס קיים
        await api.put(`/properties/${editing._id}`, data);
        setMyAssets(prev => prev.map(p => p._id === editing._id ? { ...p, ...data } : p));
        toast.success("הנכס עודכן");
      } else {
        // מצב יצירה - הוסף נכס חדש
        const res = await api.post("/properties", data);
        setMyAssets(prev => [res.data, ...prev]);
        toast.success("הנכס נוסף");
      }
      setIsOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "שגיאה בשמירת הנכס");
    }
  };

  // פונקציה: מחיקת נכס.
  const handleDelete = async (item) => {
    if (!window.confirm("בטוח למחוק את הנכס?")) return;

    try {
      await api.delete(`/properties/${item._id}`);
      setMyAssets(prev => prev.filter(p => p._id !== item._id));
      toast.success("הנכס נמחק");
    } catch (error) {
      toast.error(error?.response?.data?.message || "שגיאה במחיקת הנכס");
    }
  };

  // פונקציה: החלפת סטטוס (זמין ↔ נמכר).
  const handleToggle = async (item) => {
    const newStatus = item.status === "available" ? "sold" : "available";
    
    try {
      await api.put(`/properties/${item._id}`, { status: newStatus });
      setMyAssets(prev => prev.map(p => p._id === item._id ? { ...p, status: newStatus } : p));
      toast.success("הסטטוס עודכן");
    } catch (error) {
      toast.error("שגיאה בעדכון סטטוס");
    }
  };

  if (loading) {
    return <div>טוען נכסים...</div>;
  }

  return (
    <div>
      {/* כותרת עם כפתור הוספה */}
      <div className={styles.header}>
        <h2>הנכסים שלי</h2>
        <button className="btn" onClick={openNew}>
          הוסף נכס חדש
        </button>
      </div>

      {/* הודעה אם אין נכסים */}
      {!myAssets.length && <p>אין נכסים עדיין. לחץ על "הוסף נכס חדש".</p>}

      {/* גריד כרטיסי הנכסים */}
      <div className="cardGrid">
        {myAssets.map((it) => (
          <PropertyCard
            key={it._id || it.id}
            item={it}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Modal לטופס הוספה/עריכה */}
      {isOpen && (
        <div className="modalBackdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <PropertyForm
              initial={editing}
              onCancel={() => setIsOpen(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
