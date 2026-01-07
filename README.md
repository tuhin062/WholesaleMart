# WholesaleMart - Enterprise-Grade B2B Wholesale Platform

A robust, enterprise-ready B2B grocery wholesale ordering platform. This application features separate, highly-polished portals for Admins and Retailers (Customers), built with a focus on clean architecture, type safety, and professional warehouse operations.

---

## 🚀 Key Architectural Highlights

### 📦 Professional Order Workflow (Warehouse Ready)
The system implements a sophisticated order management logic designed for real-world scenarios:
- **Full Order Cancellation**: Atomic restocking of all items when an order is cancelled by the customer (pending only) or admin.
- **Partial Cancellation (Damage Scenarios)**: Admins can cancel specific items if they are found damaged in the warehouse. These items are marked as loss and do **not** return to inventory.
- **Item-Level Status Tracking**: Each order item moves through its own lifecycle (`active`, `cancelled`, `shipped`, `delivered`).
- **Strict State Machine**: Enforces logical order progression: `pending` → `processing` → `partially_shipped` → `shipped` → `delivered`.
- **Refund-Ready Data Modelling**: Dynamically calculates `total_fulfilled` and `total_refundable` amounts, derived from snapshots taken at order time.

### 🍱 Secure Product Management
- **Architectural Visibility**: Explicit separation of public catalogs (`/products/catalog/public`) and administrative management (`/products/manage/admin`).
- **Status Normalization**: Strict server-side validation and normalization of product statuses ("active", "inactive").
- **SKU Management**: Unique SKU enforcement for all products.

---

## 🧰 Technology Stack

### Backend (Python/FastAPI)
- **FastAPI**: Modern, high-performance web framework.
- **SQLAlchemy 2.0**: Typed ORM for robust database interactions.
- **PostgreSQL**: Production-grade relational database.
- **JWT Authentication**: Secure, role-based access control.
- **Pydantic V2**: Strict data validation and settings management.

### Frontend (React/TypeScript)
- **Vite + TypeScript**: Lean, type-safe development environment.
- **Tailwind CSS + Shadcn UI**: Enterprise-grade, premium design system.
- **Lucide React**: Beautiful, consistent iconography.
- **Axios**: Interceptor-based API service layer for seamless auth handling.

---

## 📁 Project Structure

```text
WholesaleMart/
├── backend/              # FastAPI Application
│   ├── app/
│   │   ├── core/         # Security, Dependencies, Config
│   │   ├── models/       # SQLAlchemy (User, Product, Order)
│   │   ├── schemas/      # Pydantic (Request/Response)
│   │   ├── routers/      # API Routes (Auth, Products, Orders)
│   │   └── database.py   # Connection & Session management
│   ├── requirements.txt  # Python dependencies
│   └── .env              # Configuration variables
│
└── frontend/             # React Application (TypeScript)
    ├── src/
    │   ├── components/   # UI & Shared Components (Shadcn)
    │   ├── pages/        # Admin/Retailer Views
    │   ├── services/     # API interaction layer (axios)
    │   ├── types/        # TypeScript interfaces
    │   └── layouts/      # Layout wrappers (Sidebar, Dashboard)
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (ensure it's running locally)

### 1. Database Setup
Create a database named `wholesalemart` in your PostgreSQL instance:
```sql
CREATE DATABASE wholesalemart;
```

### 2. Backend Configuration
1. Navigate to `/backend`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Configure `.env` (use `.env.example` as a template). Ensure `DATABASE_URL` is correct.
4. Run the server: `uvicorn app.main:app --reload`.
5. **Tables are created automatically** on first startup.

### 3. Frontend Configuration
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev`.
4. Access the app at `http://localhost:5173`.

---

## 🔑 Use Cases & Flows

### Admin Workflow
1. **Login**: Authenticate at the Admin portal.
2. **Product Control**: Toggle visibility, manage stock, and edit details with immediate backend normalization.
3. **Order Management**: 
   - View all orders system-wide.
   - Advance order status through the strict state machine.
   - Handle partial cancellations for damaged warehouse items.

### Retailer Workflow
1. **Easy Access**: Phone-based simulated OTP login.
2. **Catalog Browsing**: Browse only "active" products in a high-performance grid.
3. **Dynamic Ordering**: Build carts and place orders with real-time stock validation and pessimistic locking.
4. **Order Tracking**: View detailed history with derived refund and fulfillment totals.

---

## 📚 API Endpoints Summary

- **Auth**: `POST /auth/login`, `POST /auth/otp/send`, `POST /auth/otp/verify`
- **Products**: 
  - `GET /products/catalog/public` (Public)
  - `GET /products/manage/admin` (Admin)
  - `PATCH /products/{id}/status` (Toggle)
- **Orders**:
  - `GET /orders/` (Role-based list)
  - `GET /orders/{id}` (Detail)
  - `POST /orders/{id}/cancel` (Full)
  - `POST /orders/{id}/items/cancel` (Partial/Damage)

---

## 👨‍💻 Author
**Your Name/Project Group**  
WholesaleMart - Enterprise Solution
