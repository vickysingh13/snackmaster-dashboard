# Database setup (quick)

1. Create or choose a MongoDB:
   - Local (Docker): docker run -d --name snackmaster-mongo -p 27017:27017 -e MONGO_INITDB_DATABASE=snackmaster mongo:6
   - Atlas: create cluster, DB user, whitelist your IP (0.0.0.0/0 for dev), copy connection string.

2. Put connection string into server/.env (use .env.example as template). If password has special chars, URL-encode:
   node -e "console.log(encodeURIComponent('yourPassword'))"

3. Verify:
   cd server
   node scripts/testMongo.js

4. Seed (dev only):
   node scripts/seed.js

5. Start server:
   npm run dev

Notes:
- The app uses server/config/index.js to pick up MONGO_URI. In development if MONGO_URI is not set it will attempt a local fallback to mongodb://127.0.0.1:27017/snackmaster.
- Do not use fallback in production; MONGO_URI must be set in production.