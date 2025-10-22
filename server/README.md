# Server — SnackMaster Dashboard

Quick commands:

Install deps:
  cd server
  npm ci

Run tests:
  npm test

Start local MongoDB (Docker):
  docker run -d --name snackmaster-mongo -p 127.0.0.1:27017:27017 -v snackmaster-mongo-data:/data/db -e MONGO_INITDB_DATABASE=snackmaster mongo:6.0

Run migration:
  MONGO_URI="mongodb://127.0.0.1:27017/snackmaster" node scripts/migrateRefillSchema.js

Backup example:
  mongodump --uri "mongodb://127.0.0.1:27017/snackmaster" --out ./backup-$(date +%F)
