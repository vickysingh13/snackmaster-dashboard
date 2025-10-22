...existing code...

## CI

![Server tests](https://github.com/${{ github.repository }}/actions/workflows/nodejs.yml/badge.svg)

> The badge above shows the status of the `Server CI` workflow (runs server tests).

## Migration & Testing (quick)

- Run unit tests (server)
  - cd server
  - npm ci
  - npm test

- Run migration (ensure a reachable MongoDB and set MONGO_URI)
  - Example (local Docker): MONGO_URI="mongodb://127.0.0.1:27017/snackmaster" node server/scripts/migrateRefillSchema.js

## Backups (strongly recommended before running migration on production)

- Local / Docker mongodump example:
  - docker exec -it <mongo_container> bash
  - mongodump --db snackmaster --out /data/backup-$(date +%F)
  - Or using host: mongodump --uri "mongodb://127.0.0.1:27017/snackmaster" --out ./backup-$(date +%F)

- Atlas / remote:
  - Use Atlas snapshot features or mongodump with the Atlas connection string:
    - mongodump --uri "mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/snackmaster" --out ./backup-$(date +%F)

## Notes

- Do NOT commit `.env` or secrets.
- CI runs server tests only (server/tests uses an in-memory MongoDB).