# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# SnackMaster Dashboard

A simple full-stack setup verifying frontend ↔ backend communication.

## Run Locally

### Backend

cd server
npm install
npm run dev

Server runs at → http://localhost:5000

Health Check → http://localhost:5000/api/health

### Frontend
cd client
npm install
npm run dev 

Frontend runs at → http://localhost:5173

### Verify Connection
Open your browser at http://localhost:5173

You should see:
Frontend ↔ Backend Connection Test
✅ Backend: ok @ <time>

If you see ❌ “Cannot reach backend”, ensure:

Backend is running on port 5000

CORS is enabled in server/index.js:
import cors from "cors";
app.use(cors());

.env file exists in client/ with:
VITE_API_BASE_URL=http://localhost:5000  

### Folder Structure
snackmaster-dashboard/
│
├── client/   → Frontend (Vite + React)
├── server/   → Backend (Express)
└── README.md

