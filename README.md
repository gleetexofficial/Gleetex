# AHMURY — Luxury E-Commerce Platform

Full-stack luxury e-commerce website with admin panel.

## Stack
- **Frontend:** React + Vite + Tailwind CSS + Zustand
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT

## Project Structure
```
Ahmury/
├── backend/          # Express API
│   └── src/
│       ├── config/   # DB connection
│       ├── models/   # User, Product, Order
│       ├── controllers/
│       ├── routes/
│       └── middleware/
└── frontend/         # React + Vite
    └── src/
        ├── pages/    # Public pages
        ├── admin/    # Admin panel
        ├── components/
        ├── store/    # Zustand state
        └── utils/    # Axios instance
```

## Setup

### 1. Install MongoDB
Make sure MongoDB is running locally on port 27017.

### 2. Backend
```bash
cd backend
npm install
# Edit .env if needed
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 4. Create Admin User
Register a user normally, then update their role in MongoDB:
```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```
Then login and visit `/admin`.

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`
- `PUT  /api/auth/profile`

### Products
- `GET    /api/products`
- `GET    /api/products/:id`
- `POST   /api/products` (admin)
- `PUT    /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST   /api/products/:id/reviews` (auth)

### Orders
- `POST /api/orders`
- `GET  /api/orders/my`
- `GET  /api/orders/:id`
- `GET  /api/orders` (admin)
- `PUT  /api/orders/:id/status` (admin)

### Admin
- `GET    /api/admin/dashboard`
- `GET    /api/admin/users`
- `PUT    /api/admin/users/:id/role`
- `DELETE /api/admin/users/:id`
