# 🚀 Dev Progress Tracker

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Supported-47A248?logo=mongodb)

A full-stack **Developer Learning Management Dashboard** designed to track daily programming and English study time, run Pomodoro focus sessions with ambient audio, manage learning roadmaps, organize side projects, and maintain structured markdown notes with PDF generation.

Built with a **hybrid offline-first architecture** featuring an Express/MongoDB backend (`server/`) with dynamic `LocalStorage` fallback.

---

## ✨ Feature Breakdown

- 📊 **Interactive Dashboard (`MvpDashboard`)**
  - **Greeting Header & Goal Tracker:** Personal progress overview with active study goal monitoring (`GoalCard`, `GreetingHeader`).
  - **Daily Learning Checklist:** Interactive routine checklist for daily habits (`DailyLearningChecklist`).
  - **Continue Learning Card:** Quick-resume entry point for unfinished roadmap modules (`ContinueLearningCard`).
  - **Analytics & Trends:** Daily/weekly learning statistics driven by `useStats`.

- ⏱️ **Pomodoro & Focus Tools**
  - **Focus Timer:** Ticker-driven timer system using `useTicker` with custom session management.
  - **Break Music Player:** Integrated background music player for focus sessions via `useBreakMusic`.
  - **Notifications:** Browser audio/visual alerts powered by `useNotification`.

- 🗺️ **Interactive Roadmap**
  - Interactive skill blueprints and lesson modules (`RoadmapSection`, `LessonCard`, `LessonModal`).
  - Pre-seeded curriculum data (`roadmapData.js`).

- 📁 **Project Tracker**
  - Side-project organization with task checklists, technology tags, and deadline tracking (`ProjectCard`, `ProjectForm`, `TaskChecklist`).

- 📝 **Notes & Vocabulary Export**
  - Rich Markdown notes editor (`NoteEditor`, `NoteCard`).
  - Integrated PDF exporter for vocabulary and note documentation (`vocabPdf.js`).
  - Media & YouTube embedding integrations (`youtube.js`).

- ⚡ **Data Persistence & Sync**
  - Dual-layer storage: Automatically syncs to MongoDB via Express API (`api.js`), with instant local fallback to `LocalStorage` (`useLocalStorage.js`).

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + PostCSS (Dynamic light/dark CSS variables)
- **Routing:** React Router v6
- **Icons:** Lucide React (`icons.svg`)
- **PDF Generation:** Custom PDF generator (`vocabPdf.js`)

### **Backend (`server/`)**
- **Runtime:** Node.js + Express
- **Database:** MongoDB (via Mongoose schema `AppState.js`)
- **Routes:** Single RESTful API state route (`routes/state.js`)

---

## 📂 Exact Project Structure
