# PharmaCare Pro – MERN Pharmacy Health Care Management System

A ready-to-run academic MERN starter implementation based on the **PharmaCare Pro** project proposal/SRS.

## Included modules
- JWT login with Owner, Cashier and Administrator roles
- Dashboard with sales, stock, low-stock and near-expiry indicators
- Medicine inventory: add/edit/deactivate/search
- Batch number, quantity, unit price and expiry tracking
- Supplier management
- POS billing with automatic stock deduction
- Sales history
- Sales, stock, expiry and low-stock reports
- Audit log
- Responsive React UI
- MongoDB/Mongoose backend with Express REST API

## Tech stack
- React + Vite
- Tailwind CSS
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Recharts

## Requirements
- Node.js 20+ recommended
- MongoDB Atlas or local MongoDB

## Run backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```
Backend runs at http://localhost:5000

## Run frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

## Demo accounts
All demo passwords are `Password123`.

- Owner: owner@pharmacarepro.com
- Cashier: cashier@pharmacarepro.com
- Admin: admin@pharmacarepro.com

## MongoDB
For MongoDB Atlas, replace `MONGO_URI` in `backend/.env` with your connection string.

## Important academic note
This package is a functional starter implementation for the project. Before production use, add HTTPS deployment, stronger account-lockout persistence, refresh-token/session strategy, production secrets, backups, PDF/CSV export hardening, barcode/receipt integrations, and full automated test coverage.
