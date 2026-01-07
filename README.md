# WholesaleMart - Enterprise-Grade B2B Wholesale Platform

**WholesaleMart** is a specialized, high-performance B2B platform designed for the **Indian Wholesale Market**. It bridges the gap between large distributors and local retailers with a premium, robust, and scalable technology stack.

This document serves as the comprehensive technical guide for developers, architects, and stakeholders.

---

## 🚀 Key Architectural Highlights

### 🇮🇳 Indian Market Localization
The application is deeply customized for the Indian retail landscape:
- **Currency**: All financial logic uses the **Indian Rupee (₹)**. Pricing, subtotals, and revenue stats are formatted to Indian standards.
- **Identity**: The platform enforces a **+91 Mobile Number** identity for all retailers. Login flows and headers are hardcoded to this context.
- **Design System**: "Ivory & Slate" aesthetics with a custom, sleek scrollbar (`index.css`) that provides a modern, premium feel suitable for high-value transactions.

### 📦 Professional Warehouse Workflow
The system implements sophisticated order logic for real-world operations:
- **Atomic Cancellation**: Full restocking when an order is cancelled by customer or admin.
- **Damage Control**: Admin-only partial cancellation for damaged items (defines "loss" vs "restock").
- **State Machine**: Enforces logical progression: `pending` → `processing` → `partially_shipped` → `shipped` → `delivered`.
- **Refund Logic**: Dynamic calculation of `total_fulfilled` vs `total_refundable` based on snapshot data.

### 🍱 Secure Product Context
- **Explicit Visibility**: Separation of public catalogs (`/catalog/public`) and admin management (`/manage/admin`).
- **Status Normalization**: Strict server-side validation for "active" vs "draft" states.
- **Pessimistic Locking**: Prevents overselling during high-concurrency cart checkouts.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Lightning-fast HMR and component-based UI. |
| **Styling** | Tailwind CSS + Shadcn | Utility-first styling with premium accessibility. |
| **Backend** | FastAPI (Python) | Async high-performance API with auto-generated docs. |
| **Database** | SQLAuth (PostgreSQL) | Robust relational integrity and ACID transactions. |
| **Auth** | JWT + OTP | Dual-strategy: Email/Pass for Admin, OTP for Retailers. |
| **State** | Context API | Lightweight global state for Cart and Session. |

---

## 📁 Project Structure

```text
WholesaleMart/
├── backend/              # FastAPI Application
│   ├── app/
│   │   ├── core/         # Security, Config, Hashing
│   │   ├── models/       # SQLAlchemy ORM (User, Product, Order)
│   │   ├── schemas/      # Pydantic Validation Models
│   │   ├── routers/      # API Endpoints (Auth, Products, Orders)
│   │   └── services/     # Business Logic (Notification, Inventory)
│   └── requirements.txt  # Python dependencies
│
└── frontend/             # React Application (TypeScript)
    ├── src/
    │   ├── components/   # UI Atoms (Buttons, Cards, Inputs)
    │   ├── pages/        # Route Views (Catalog, Dashboard)
    │   ├── context/      # Global State (AuthContext, CartContext)
    │   ├── services/     # Axios API Wrapper
    │   └── layouts/      # Master Templates (Retailer, Admin)
    └── tailwind.config.js
```

---

## 🔐 Authentication Ecosystem

WholesaleMart uses a strategic dual-authentication mechanism:

1.  **Admin Portal (Internal)**
    *   **Method**: Email & Password.
    *   **Access**: Full control over products, orders, and system settings.
    *   **Route**: `/admin/login`

2.  **Retailer Portal (Customer)**
    *   **Method**: OTP (One-Time Password) login.
    *   **Identity**: Mobile Number (+91).
    *   **Flow**:
        1.  User enters phone number (e.g., `7278936250`).
        2.  System adds `+91` prefix.
        3.  Standard OTP (`123456`) is used for verification (simulated).
        4.  JWT Token issued with `role: customer`.

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (Local or Cloud)

### 1. Database Initialization
Create a PostgreSQL database:
```sql
CREATE DATABASE wholesalemart;
```

### 2. Backend Setup
1. `cd backend`
2. `python -m venv venv`
3. `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
4. `pip install -r requirements.txt`
5. Configure `.env` with your `DATABASE_URL`.
6. Run server: `uvicorn app.main:app --reload`
   *   *Tables are auto-created on startup.*

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Application live at `http://localhost:5173`

---

## 📚 API Endpoints Summary

### Authentication
- `POST /auth/login`: Admin email/password login.
- `POST /auth/otp/send`: Trigger OTP for retailer phone.
- `POST /auth/otp/verify`: Exchange OTP for JWT.

### Products
- `GET /products/catalog/public`: Fetch active products (Retailer).
- `GET /products/manage/admin`: Fetch all products (Admin).
- `POST /products/`: Create new inventory item.
- `PATCH /products/{id}/status`: Toggle Active/Draft status.

### Orders
- `GET /orders/`: Role-based order history.
- `GET /orders/{id}`: Detailed view with line-item status.
- `POST /orders/`: Create order from cart.
- `POST /orders/{id}/cancel`: Full cancellation (Restock).
- `POST /orders/{id}/items/cancel`: Partial cancellation (Damage/Loss).

---

## 🔮 Future Roadmap
- [ ] **SMS Gateway**: Integration with Twilio/MSG91 for real OTPs.
- [ ] **Inventory WebSockets**: Real-time stock decrement updates across clients.
- [ ] **Invoice Generation**: PDF invoice generation for GST functionality.

---
**WholesaleMart** — *Redefining the Indian Wholesale Experience.*
