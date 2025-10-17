# SnackMaster Dashboard - Setup

## Prerequisites
- Node.js v24+
- Git
- MongoDB Atlas account (create DB user & MONGO_URI)

---

##  Server (backend)
cd server
npm install
# Add .env file inside 'server' with MONGO_URI and PORT
npm run dev

---

##  Client (frontend)
cd client
npm install
# Add .env.local with:
VITE_API_URL=http://localhost:5000
npm run dev

---

##  Notes
- Do NOT commit .env or .env.local files.
- Use VITE_API_URL to switch between dev, staging, and prod servers.
