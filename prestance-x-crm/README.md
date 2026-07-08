# Prestance X — Mini CRM

A full-stack Mini CRM built for **Prestance X**, a small second-hand fashion
business, to manage leads coming from WhatsApp, Facebook, Instagram, the
website, referrals and walk-ins.

Built as part of the **Future Interns — Full Stack Web Development
Internship**.

---

## ✨ Features

- 🔐 Simple JWT authentication (no public registration — accounts are seeded/managed by an Admin)
- 👥 Two roles: **Admin** (full access) and **Commercial** (view leads, update status, add notes)
- 📋 Full Lead CRUD with status pipeline: `New → Contacted → Converted`
- 📝 Follow-up notes per lead (author + timestamp)
- 📊 Dashboard with live stats (total / new / contacted / converted + recent leads)
- 🔍 Search & filter leads by status, source, product, or keyword
- 📱 Fully responsive Tailwind UI (desktop sidebar / mobile top nav)
- 🍞 Toast notifications, loading states, and clean error handling throughout
- 🧱 Clean MVC backend architecture, ready to plug into a real website contact form
- 🎨 Custom "ink / gold / cream / leather" design system (see below)
- 🌍 Bilingual UI — **French (default) and English**, switchable at any time

---

## 🎨 Design System

The UI uses a bespoke Tailwind palette instead of a generic template look,
defined in `frontend/tailwind.config.js`:

| Token     | Role                                              |
|-----------|-----------------------------------------------------|
| `ink`     | Deep black/charcoal tones — `900` dark backgrounds (sidebar, login screen), `50` near-white for light text/borders |
| `gold`    | Subtle gold accent — `500`/`600` primary buttons, active states, highlights |
| `cream`   | Off-white / broken white — page background, card surfaces |
| `leather` | Warm brown — destructive actions, secondary accents |

All custom buttons/inputs/cards are defined once as reusable classes in
`frontend/src/index.css` (`.btn-primary`, `.card`, `.input`, `.badge`, etc.),
so the palette can be restyled from a single place if needed.

---

## 🌍 Bilingual (French / English)

The interface defaults to **French** and can be switched to English at any
time via the language toggle (top-right on the login screen, sidebar on
desktop, top nav on mobile).

- All UI strings live in `frontend/src/i18n/translations.js`, organized by
  page/section (`login`, `dashboard`, `leads`, `users`, `enums`, …).
- Language preference is handled by `frontend/src/context/LanguageContext.jsx`
  via a lightweight custom `t(key, params)` function (no extra runtime
  dependency) and persisted in `localStorage` so it's remembered across visits.
- Enum values coming from the database (lead status, source, product) are
  translated for display via `t('enums.statuses.New')`, etc. — the underlying
  stored values in MySQL stay in English so the API/database contract never
  changes.
- To add a new language, duplicate the `fr` (or `en`) block in
  `translations.js`, translate the strings, and add a button to
  `LanguageSwitcher.jsx`.

---

## 🏗️ Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Frontend   | React, Vite, Tailwind CSS, React Router, Axios |
| Backend    | Node.js, Express.js                           |
| Database   | MySQL (via XAMPP), mysql2                     |
| Auth       | JWT, bcrypt                                   |

---

## 📁 Folder Structure

```
prestance-x-crm/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool
│   ├── controllers/               # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── leadController.js
│   │   ├── noteController.js
│   │   └── dashboardController.js
│   ├── database/
│   │   ├── schema.sql             # Full DB schema
│   │   └── seed.js                # Seeds Admin + sample data
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── roleMiddleware.js      # Role-based access control
│   │   ├── errorMiddleware.js     # Centralized error handling
│   │   └── validateMiddleware.js  # express-validator wrapper
│   ├── models/                    # Raw SQL data-access layer
│   │   ├── userModel.js
│   │   ├── leadModel.js
│   │   └── noteModel.js
│   ├── routes/                    # REST API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── leadRoutes.js
│   │   ├── noteRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/axios.js            # Axios instance + interceptors
    │   ├── context/AuthContext.jsx # Auth state via Context API
    │   ├── components/             # Reusable UI components
    │   ├── pages/                  # Route-level pages
    │   ├── utils/constants.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [XAMPP](https://www.apachefriends.org/) (for MySQL) — or any local MySQL server
- npm (comes with Node.js)

---

## 🚀 Installation Guide

### 1. Start MySQL

Open XAMPP Control Panel and start the **MySQL** module. (You can leave
Apache off — the backend runs on Node directly.)

### 2. Create the database

Import the schema using phpMyAdmin, or run from a terminal:

```bash
mysql -u root -p < backend/database/schema.sql
```

> If your `root` user has no password (default XAMPP setup), just run
> `mysql -u root < backend/database/schema.sql`.

This creates the `prestance_x_crm` database with the `users`, `leads`, and
`notes` tables.

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and adjust `DB_USER` / `DB_PASSWORD` / `JWT_SECRET` if needed
(defaults match a fresh XAMPP install: user `root`, empty password).

Seed the database with one Admin account, one sample Commercial account, and
a few sample leads:

```bash
npm run seed
```

You'll see the generated credentials printed in the terminal, e.g.:

```
✅ Admin account created -> email: admin@prestancex.com | password: Admin@12345
✅ Commercial account created -> email: commercial@prestancex.com | password: Commercial@12345
```

Start the API server:

```bash
npm run dev
```

The API will run at **http://localhost:5000**. Test it with:
`GET http://localhost:5000/api/health`

### 4. Frontend setup

Open a **new terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will run at **http://localhost:5173**.

### 5. Log in

Go to `http://localhost:5173/login` and sign in with the seeded Admin
credentials printed in step 3.

---

## 🔑 Default Seeded Accounts

| Role       | Email                       | Password         |
|------------|------------------------------|-------------------|
| Admin      | admin@prestancex.com        | Admin@12345       |
| Commercial | commercial@prestancex.com   | Commercial@12345  |

> ⚠️ These are development defaults defined in `backend/.env.example`.
> Change `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in your own `.env`
> before seeding a production database, and rotate the password after
> first login.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

All protected routes require a header: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint         | Access | Description            |
|--------|------------------|--------|-------------------------|
| POST   | `/auth/login`    | Public | Login, returns JWT      |
| GET    | `/auth/me`       | Private| Get current user        |

### Users (Admin only)

| Method | Endpoint              | Description          |
|--------|------------------------|-----------------------|
| GET    | `/users`               | List all users        |
| GET    | `/users/:id`           | Get single user       |
| POST   | `/users`               | Create user           |
| PUT    | `/users/:id`           | Update user           |
| PUT    | `/users/:id/password`  | Reset user password   |
| DELETE | `/users/:id`           | Delete user           |

### Leads (Admin + Commercial, unless noted)

| Method | Endpoint              | Access          | Description                    |
|--------|------------------------|-----------------|----------------------------------|
| GET    | `/leads`               | Private         | List leads (filters, search, pagination) |
| GET    | `/leads/:id`           | Private         | Get single lead + notes         |
| POST   | `/leads`               | Private         | Create a lead                   |
| PUT    | `/leads/:id`           | Private         | Update a lead                   |
| PATCH  | `/leads/:id/status`    | Private         | Update only the status          |
| DELETE | `/leads/:id`           | **Admin only**  | Delete a lead                   |

Query params supported on `GET /leads`: `status`, `lead_source`,
`interested_product`, `search`, `page`, `limit`.

### Notes

| Method | Endpoint                     | Access          | Description             |
|--------|-------------------------------|-----------------|---------------------------|
| GET    | `/leads/:leadId/notes`        | Private         | List notes for a lead     |
| POST   | `/leads/:leadId/notes`        | Private         | Add a note to a lead      |
| DELETE | `/notes/:id`                  | **Admin only**  | Delete a note              |

### Dashboard

| Method | Endpoint             | Description                              |
|--------|-----------------------|--------------------------------------------|
| GET    | `/dashboard/stats`    | Total / new / contacted / converted + recent leads |

---

## 🔌 Future Integration: Website Contact Form

The API was intentionally designed so the public website's contact form can
be connected later with minimal changes:

- `POST /api/leads` already accepts all the fields a contact form would
  submit (`first_name`, `last_name`, `phone`, `email`, `city`,
  `interested_product`, `message`), and `lead_source` defaults to
  `'Website'` if omitted.
- To expose it publicly, add a lightweight **public route** (e.g.
  `POST /api/public/leads`) that reuses `LeadModel.create` without the
  `protect` middleware, ideally behind rate-limiting and a spam-honeypot
  field.
- All validation rules live in `routes/leadRoutes.js` and can be reused
  as-is for the public endpoint.

---

## 🧪 Useful Commands

```bash
# Backend
cd backend
npm run dev      # start with nodemon (auto-restart)
npm start        # start in production mode
npm run seed      # seed admin + sample data

# Frontend
cd frontend
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview production build
```

---

## 🛡️ Security Notes

- Passwords are hashed with **bcrypt** (10 salt rounds) — never stored in plain text.
- JWT tokens expire based on `JWT_EXPIRES_IN` (default `1d`).
- Role-based middleware (`roleMiddleware.js`) enforces Admin-only actions
  (user management, lead deletion, note deletion) at the API level — not
  just hidden in the UI.
- All inputs are validated server-side with `express-validator` in addition
  to client-side validation.

---

## 📄 License

Built for educational purposes as part of the Future Interns Full Stack Web
Development Internship. Free to use and adapt.
