# Server — SnackMaster Dashboard

Quick commands and notes.

Prereqs
- Node.js 20+
- npm
- Docker (optional, recommended for local MongoDB)

1) Install dependencies
```bash
cd server
npm ci
```

2) Run tests (uses mongodb-memory-server)
```bash
npm test
```

3) Start local MongoDB (Docker) — recommended for migration
```bash
docker run -d --name snackmaster-mongo \
  -p 127.0.0.1:27017:27017 \
  -v snackmaster-mongo-data:/data/db \
  -e MONGO_INITDB_DATABASE=snackmaster \
  mongo:6.0
```

4) Migration (legacy to RefillLog)
- Ensure MONGO_URI points to your DB (use 127.0.0.1 to avoid IPv6 issues)
```bash
# example
MONGO_URI="mongodb://127.0.0.1:27017/snackmaster" node scripts/migrateRefillSchema.js
```

5) Backup before migration (important)
```bash
# using mongodump (host)
mongodump --uri "mongodb://127.0.0.1:27017/snackmaster" --out ./backup-$(date +%F)

# using mongodump inside docker container
docker exec -it snackmaster-mongo mongodump --db snackmaster --out /data/backup-$(date +%F)
```

6) Run dev server
```bash
npm run dev
# default port from index.js is 5000
```

Troubleshooting
- If migration fails with ECONNREFUSED, ensure Mongo is running and MONGO_URI uses 127.0.0.1.
- CI uses in-memory MongoDB so no external DB required for tests.
