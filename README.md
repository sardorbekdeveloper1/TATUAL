# TATU Akademik Litseyi — Dars Jadvali

**TATU Academic Lyceum Lesson Schedule Platform**

A modern, mobile-first web platform for TATU Academic Lyceum students to access their lesson schedules via QR codes.

🌐 **Live**: [Deploy to Vercel](#deployment)

---

## ✨ Features

- 📱 **Mobile-first** responsive design (320px–1920px)
- 📅 **Complete schedules** for 1-kurs (101–109) and 2-kurs (201–210)
- 🔍 **Fast group search** — find your group in 2–3 taps
- 📊 **Today's lessons** with real-time status (Hozir / Keyingi / Tugagan)
- 🌙 **Dark mode** with system preference detection
- 🌐 **Bilingual** — Uzbek (UZ) and Russian (RU)
- 📲 **QR codes** — scan to open your course schedule
- 🖨️ **Printable QR poster** — A4 layout for academy walls
- ⭐ **Favorite group** — saves your group locally
- 🗓️ **Day & Week views** — cards on mobile, table on desktop
- ⏰ **Asia/Tashkent timezone** — accurate "today" detection
- ♿ **Accessible** — semantic HTML, ARIA labels, keyboard navigation

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 6 | Build tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| Lucide React | Icons |
| qrcode.react | QR code generation |
| Inter font | Typography |

---

## 📁 Project Structure

```
src/
  assets/logo/         — Official TATU AL logo
  components/          — Reusable UI components
    Header, Footer, ThemeToggle, LanguageSwitcher,
    CourseCard, GroupSelector, DayTabs,
    LessonCard, ScheduleTable, QRCard
  data/                — Schedule data (extracted from Word docs)
    firstCourse.json, secondCourse.json, types.ts
  hooks/               — React hooks
    useTheme, useLanguage, useCurrentLesson
  locales/             — Translations (uz.ts, ru.ts, subjects.ts)
  pages/               — Route pages
    HomePage, CoursePage, GroupSchedulePage, QRPage, NotFoundPage
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📋 Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/1-kurs` | First year groups (101–109) |
| `/2-kurs` | Second year groups (201–210) |
| `/1-kurs/101` ... `/1-kurs/109` | Group schedule |
| `/2-kurs/201` ... `/2-kurs/210` | Group schedule |
| `/qr` | QR codes + printable poster |

---

## 🔧 Environment Variables

```env
# Set before generating QR codes for production
VITE_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

---

## 🚢 Deployment

Deploy directly to **Vercel**:

1. Push to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Set `VITE_PUBLIC_SITE_URL` environment variable
4. Deploy

SPA routing is configured via `vercel.json`.

---

## 📊 Data Sources

Schedule data is extracted from official TATU Academic Lyceum Word documents:

- `1-kurs.2026-2027.docx` — First year (9 groups)
- `2-kurs 2026-2027.docx` — Second year (10 groups)

**19 groups** • **380 lesson periods** • **588 lesson entries** verified against source documents.

---

## 📄 License

© 2026 TATU Akademik Litseyi. All rights reserved.
