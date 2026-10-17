# RushRescue Admin Dashboard

Admin dashboard for **RushRescue** — a roadside rescue platform that connects drivers with rescuers.

Live app: **[https://rush-rescue-qauh.vercel.app/](https://rush-rescue-qauh.vercel.app/)**  
Repository: **[github.com/Aya-Ashreey7/RushRescue](https://github.com/Aya-Ashreey7/RushRescue)**

---

## About

RushRescue helps manage rescue operations from one place. Admins can review driver and rescuer applications, track active requests, monitor reports, and view basic analytics.

The dashboard is protected: only authenticated users listed in the Firebase `admins` collection can sign in.

---

## Features

- **Admin login** with Firebase Authentication
- **Dashboard analytics** — user totals and monthly registration trends
- **Driver & rescuer requests** — review, approve, reject, or mark incomplete
- **Document review** on driver/rescuer detail pages
- **Drivers & rescuers lists** with export to Excel
- **Reports** — browse, filter, and inspect user reports
- **All requests** — track rescue requests, locations, and offers
- **Settings** — change admin password
- **Light / dark mode**

---

## Tech stack

| Area | Tools |
|------|--------|
| Frontend | React 19, TypeScript, Vite |
| UI | MUI 7, Emotion, Tailwind CSS |
| Routing | React Router |
| Backend / data | Firebase Auth, Cloud Firestore |
| Charts | Recharts |
| Forms | React Hook Form, Zod |
| Deploy | Vercel |

---

## Getting started

### Prerequisites

- Node.js 18+ (recommended)
- npm
- Access to the RushRescue Firebase project

### Install & run

```bash
npm install
npm run dev
```

App runs locally at `http://localhost:5173` (or the port Vite prints).

### Other scripts

```bash
npm run build    # Typecheck + production build
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

---

## Project structure (high level)

```
src/
  components/     # Layout, navbar, sidebar, shared UI
  pages/          # Dashboard pages (analytics, requests, reports, details)
  Drivers/        # Drivers list
  Rescuers/       # Rescuers list
  Requests/       # All rescue requests
  Settings/       # Admin settings
  login/          # Login screen
  theme/          # MUI theme tokens
  firebase.ts     # Firebase app config
```

---

## Environment / Firebase

Firebase config lives in `src/firebase.ts` and points to the `rushrescue` project.

Admin access requires:

1. A user in **Firebase Authentication**
2. A matching document in Firestore collection **`admins`** (document ID = user UID)

---

## Deployment

The production build is hosted on Vercel:

**https://rush-rescue-qauh.vercel.app/**

Typical flow:

1. Push changes through a pull request into `main` (direct pushes to `main` may be blocked by branch rules)
2. Vercel builds with `npm run build` and deploys automatically

---

## License

Private / project use — see repository settings for details.
