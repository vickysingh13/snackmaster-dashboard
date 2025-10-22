# SnackMaster Dashboard — API docs (summary)

Base URL: http://localhost:5000

Endpoints
- GET /api/machines
  - Response: list of vending machines with stock populated.
- GET /api/machines/{id}
  - Response: single machine with stock.
- POST /api/machines
  - Body: { machineCode, location, totalSlots, stock? }
- PUT /api/machines/{id}
- DELETE /api/machines/{id}

- GET /api/refills
  - Response: RefillLog[] (populated)
- POST /api/refills
  - Body example:
```json
{
  "machine":"<machineId>",
  "refilledBy":"tech1",
  "items":[{"product":"<productId>","quantityAdded":5}]
}
```

Notes
- Refill logs are stored in RefillLog model. Creating refill logs updates Product.quantity and VendingMachine.stock.
- Before running real migration, back up DB (mongodump or Atlas snapshot).
- For local development use Docker Mongo: see server/README.md

How to serve interactive docs
- Install swagger-ui-express in server:
  npm install swagger-ui-express yamljs
- Mount /api/docs to serve docs (example server/swagger.js below).