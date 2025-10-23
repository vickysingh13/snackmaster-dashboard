# SnackMaster — Architecture & Flow (one-page summary)

Diagrams
- docs/architecture.puml — UML class diagram (Models, Controllers, Infra)
- docs/sequence_startup_and_refill.puml — sequence diagram for startup, refill request, migration

File-to-file flow (high level)
- server/index.js: entry point; loads dotenv, calls connectDB(), mounts routes, starts Express, supports graceful shutdown and exports app.
- server/config/db.js: validates MONGO_URI, connects using mongoose; consider retry/backoff.
- server/routes/*: map HTTP endpoints to controllers.
- server/controllers/*: implement request handling:
  - refillController.createRefill: creates RefillLog(s), updates VendingMachine.stock.
  - vendingMachineController.getMachines: returns machines with populated stock and products.
- server/models/*: Mongoose schemas:
  - Product — required machineId, quantity, category; pre-save updates inStock.
  - VendingMachine — validates totalSlots vs total stock amount; helper updateStock().
  - RefillLog — post-save hook increments Product.quantity.
- server/scripts/migrateRefillSchema.js: migration utility: reads legacy refills, creates RefillLog documents, updates machine stock, moves legacy docs to `refills_migrated`.

Notes & gotchas
- RefillLog.post('save') increments Product.quantity; migration must not cause double-counting.
- Use `127.0.0.1` in local MONGO_URI to avoid IPv6 ::1 issues.
- Back up DB before running migration (mongodump or Atlas snapshot).
- Tests use mongodb-memory-server; CI uses node --experimental-vm-modules + babel-jest.

Generated assets
- After rendering, docs/*.png and docs/*.svg and docs/SnackMaster-architecture.pdf will be created.