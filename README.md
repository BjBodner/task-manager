<div dir="rtl">

# TaskFlow - לוח משימות אישי עם גיימיפיקציה

<div dir="ltr">

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

</div>

אפליקציית Kanban Board אישית בעברית עם מערכת XP, רמות, סטריקים ואנימציות.
גרור משימות בין עמודות, צבור ניקוד, עלה רמה - והפוך את ניהול המשימות למשחק.

---

## תכונות עיקריות

- **לוח קנבן** עם 4 עמודות: עדיין לא התחיל, בביצוע, צריך אישור, הושלם
- **Drag & Drop** - גרירת משימות חלקה בין עמודות
- **גיימיפיקציה** - XP, רמות, סטריקים יומיים ואבני דרך
- **אנימציות** - קונפטי בהשלמת משימה, אפקט מיוחד בעליית רמה
- **דשבורד סטטיסטיקות** - גרפים שבועיים/חודשיים, עוגה לפי קטגוריות, היסטוריית סטריקים
- **4 קטגוריות** - עבודה, בית, מערכות יחסים, לימודים
- **3 רמות עדיפות** - גבוהה (+30 XP), בינונית (+20 XP), נמוכה (+10 XP)
- **RTL מלא** - ממשק בעברית, מותאם מימין לשמאל
- **רספונסיבי** - Desktop-first עם תמיכה במסכים שונים

---

## טכנולוגיות

| תחום | טכנולוגיה |
|------|-----------|
| Frontend | React 18 + Vite |
| עיצוב | Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL) |
| Drag & Drop | @hello-pangea/dnd |
| גרפים | Recharts |
| אנימציות | canvas-confetti |

---

## התקנה והרצה

### דרישות מקדימות
- Node.js 18+
- חשבון [Supabase](https://supabase.com) (חינמי)

### 1. שכפול הפרויקט

</div>

```bash
git clone https://github.com/BjBodner/task-manager.git
cd task-manager
npm install
```

<div dir="rtl">

### 2. הגדרת Supabase

צרו פרויקט חדש ב-[Supabase](https://supabase.com) והריצו את ה-migrations שבפרויקט.

### 3. משתני סביבה

צרו קובץ `.env` בתיקיית השורש:

</div>

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

<div dir="rtl">

### 4. הרצה

</div>

```bash
npm run dev
```

<div dir="rtl">

האפליקציה תרוץ על `http://localhost:5173`

---

## מבנה הפרויקט

</div>

```
src/
  components/
    Board/          # לוח קנבן ראשי
    TaskCard/       # כרטיס משימה בודד
    Header/         # XP bar, רמה, סטריק
    Stats/          # דשבורד סטטיסטיקות
    AddTask/        # טופס הוספה מהירה
    Celebration/    # קונפטי ואנימציות
  hooks/
    useTasks.js     # ניהול משימות (CRUD + drag)
    useUserStats.js # XP, רמות, סטריקים
  lib/
    supabase.js     # Supabase client
```

<div dir="rtl">

---

## מערכת הגיימיפיקציה

### XP ורמות
- השלמת משימה מעניקה XP לפי עדיפות: נמוכה +10, בינונית +20, גבוהה +30
- בונוס סטריק: +5 XP נוספים בזמן סטריק פעיל
- כל רמה דורשת רמה x 100 XP (רמה 2 = 200, רמה 3 = 300...)

### סטריקים
- ספירת ימים רצופים עם לפחות משימה אחת מושלמת
- הסטריק נשבר ביום ללא השלמת משימה
- אבני דרך: 7 ימים, 30 ימים, 100 ימים

---

## מודל נתונים

### tasks
| שדה | סוג | תיאור |
|-----|------|-------|
| id | UUID | מזהה ייחודי |
| title | TEXT | כותרת המשימה |
| status | ENUM | todo / in_progress / needs_approval / done |
| category | ENUM | work / home / relationships / learning |
| priority | ENUM | high / medium / low |
| xp_earned | INTEGER | XP שהוענק בהשלמה |

### user_stats
| שדה | סוג | תיאור |
|-----|------|-------|
| total_xp | INTEGER | סה"כ XP שנצבר |
| level | INTEGER | רמה נוכחית |
| current_streak | INTEGER | סטריק נוכחי (ימים) |
| longest_streak | INTEGER | סטריק הכי ארוך |

---

## סקריפטים

</div>

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

<div dir="rtl">

---

## Claude Code

הפרויקט כולל תיקיית `.claude/` עם הגדרות ל-[Claude Code](https://claude.ai/code):
- `launch.json` - הגדרת dev server
- `commands/` - פקודות מותאמות (סיכום פרויקט, סטטוס)

---

## רישיון

MIT

</div>
