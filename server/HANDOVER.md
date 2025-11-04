# SnackMaster - Handover Document

Summary
- Project: SnackMaster (vending machine dashboard + API)
- Location: /workspaces/snackmaster-dashboard
- Last update: 2025-11-03
- Contact (owner): (replace with your name / email)
- Test status at handover: All unit & integration tests pass locally (see Tests section)

Quick overview
- Backend: Node.js (ESM) + Express, Mongoose (MongoDB)
- Frontend: React (client/), simple dashboard components
- Tests: Jest + mongodb-memory-server + supertest
- Dev environment: Development container (Ubuntu 24.04.2 LTS)
- Port: 5000 (default)

Repository layout (key folders)
- server/
  - index.js — app bootstrap and start/shutdown
  - app.js — express app (exported for tests)
  - controllers/ — API controllers (auth, refill, vending machine, products)
  - models/ — Mongoose models (Product, VendingMachine, RefillLog, User)
  - routes/ — Express routes
  - config/ — DB and environment config
  - tests/ — Jest tests
- client/ — React front-end (pages, services, components)

Environment & secrets
- Local env file: server/.env (NOT committed with secret values)
- Example variables:
  - MONGO_URI (do NOT commit production credentials)
  - JWT_SECRET
- IMPORTANT: Rotate any credentials shown in .env before handing over. Do not share production credentials in the repo or chat.

Dev setup (first-time)
1. Open the project in the dev container (recommended).
2. From server/:
   - npm install
   - export any required env vars in .env (copy from .env.example if present)
3. Start dev server (inside container):
   - npm run dev
   - The app listens on port 5000 (binds 0.0.0.0). If using Codespaces / devcontainer, forward port 5000 to host.

Open app health:
- In the dev container terminal:
  - $BROWSER http://127.0.0.1:5000/api/health

Running tests
- From server/:
  - NODE_ENV=test npm test
- To run a single test file:
  - NODE_ENV=test npx jest tests/refill.atomic.test.js --runInBand --verbose

Notes about tests
- Tests use mongodb-memory-server => transactions are not supported in-memory (controller has fallback code).
- Tests include both unit and integration tests for refill, auth, products, vendingMachine.

Common commands
- Start server (dev): npm run dev
- Run tests: npm test
- Lint: npm run lint
- Format: use project-preferred formatter (none enforced automatically)

Key behaviors & design notes
- Refill flow:
  - create a RefillLog, increment Product.quantity, update VendingMachine.stock
  - For production, code attempts MongoDB transactions and retries; fallback to non-transactional updates when transactions unavailable.
  - Tests rely on deterministic non-transactional path and a `force-fail` value to simulate failure-before-writes.
- VendingMachine.stock schema:
  - stock items store productId (ObjectId). The model supports an alias `product` for compatibility across code/tests.
- RefillLog post-save hook:
  - Hook is opt-in via USE_REFILL_HOOK env var to avoid duplicate increments (default disabled).

Auth
- Lightweight JWT-based auth implemented for tests and development
- app.js exposes endpoints:
  - POST /api/auth/register
  - POST /api/auth/login
- JWT secret comes from JWT_SECRET env var.

Ports / connectivity
- Bind address: 0.0.0.0 (explicit in index.js). If running in Codespace/DevContainer, forward port 5000 to host using VS Code Ports view.
- To verify server from the container:
  - curl -v http://127.0.0.1:5000/
- If Postman on host cannot reach the API: make sure port 5000 is forwarded/exposed.

Troubleshooting common issues
- Tests failing due to transactions unsupported
  - This is expected on mongodb-memory-server; the controller handles fallback. See tests that depend on `force-fail`.
- `Cannot find module 'bcrypt'` or similar
  - Ensure dependencies installed (`npm install`), and bcryptjs is present. The repo uses bcryptjs in some files and bcrypt in others; we standardized on bcryptjs for tests. If you see both, change imports to bcryptjs.
- Port not reachable from host
  - Forward the port in VS Code Codespaces/DevContainer or run container with -p 5000:5000.

Security and secrets
- DO NOT commit production MONGO_URI or JWT_SECRET to the repo.
- Rotate DB credentials before transfer.
- Add secrets to a vault or environment variables on the deployment host.

Onboarding checklist for the incoming developer
1. Clone repository and open in Codespaces / devcontainer.
2. Run `npm install` inside server/.
3. Create .env file from template (add JWT_SECRET, local Mongo URI if needed).
4. Run tests: NODE_ENV=test npm test (resolve any failing tests).
5. Start server: npm run dev and forward port 5000 for Postman usage.
6. Review HANDOVER.md and run through common commands.
7. Review key controllers: refillController.js, authController.js, and VendingMachine.js.
8. Rotate/confirm credentials and document deployment steps.

CI / Deployment recommendations
- Add GitHub Actions workflow to run tests and lint on PRs.
- Use a staging MongoDB (replica set) for testing transactions in CI if transactional behavior is required.
- Store secrets in GitHub Secrets / Vault.

Outstanding work / suggestions (priority)
- Add protected endpoint tests that assert JWT authentication/authorization.
- Consolidate bcrypt usage to bcryptjs across controllers.
- Add API docs (OpenAPI/Swagger) and a Postman collection.
- Add CI (GitHub Actions) with mongodb-memory-server setup.
- Optionally, remove legacy RefillLog post-save hook or document strict behavior.

Appendix: Useful commands summary
- Install deps:
  - cd server && npm install
- Run tests:
  - NODE_ENV=test npm test
- Start server:
  - npm run dev
- Health check:
  - $BROWSER http://127.0.0.1:5000/api/health
- Run a single Jest test file:
  - NODE_ENV=test npx jest tests/refill.atomic.test.js --runInBand --verbose

End of handover.