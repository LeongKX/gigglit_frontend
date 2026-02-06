# Gigglit (Frontend)

This is the **React** frontend for **Gigglit**.

If you’re looking for backend setup (MongoDB, env vars, API overview), see the project root README:

- `../README.md`

---

## Tech stack

- React (Create React App)
- React Router
- Material UI (MUI)
- Axios
- SweetAlert2
- react-cookie

---

## Prerequisites

- Node.js (recommended: latest LTS)
- npm

---

## Setup

From this folder (`gigglit/`):

```bash
npm install
```

---

## Run (development)

```bash
npm start
```

By default, the app runs at:

- `http://localhost:3000`

---

## API base URL

The API base URL is configured in `src/constant.js`:

- **Development**: `http://localhost:5555/api`
- **Production**: `https://b13-leong24.mak3r.dev/api`

That means for local dev you’ll usually want the backend running on port **5555**.

---

## Useful scripts

```bash
npm test
npm run build
```

---

## Pages / routes

Defined in `src/App.js`:

- `/` — Home
- `/login` — Login
- `/signup` — Signup
- `/posts/new` — Create post
- `/posts/:id/edit` — Edit post
- `/topics/new` — Create topic
- `/topics/:id/edit` — Edit topic
- `/bookmark` — Bookmarks
- `/adminPosts` — Admin posts list
