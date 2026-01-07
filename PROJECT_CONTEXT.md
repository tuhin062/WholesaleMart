# WholesaleMart – Project Context for AI Assistance

## Project Overview
WholesaleMart is a B2B wholesale ordering platform.

Roles:
- Admin (Wholesaler)
- Customer (Retailer)

Tech Stack:
- Frontend: React + TypeScript + Tailwind
- Backend: FastAPI (Python)
- ORM: SQLAlchemy
- Database: PostgreSQL
- Auth: JWT-based authentication
- Tooling: VS Code + GitHub Copilot

## Core Business Rules (DO NOT BREAK)
1. Customers can only see their own orders.
2. Admins can see all orders.
3. Inactive products must NEVER appear in customer catalog.
4. Order workflow must follow strict state transitions.
5. Inventory correctness is critical.
6. Partial order cancellation exists (damaged items).
7. Cancelled items due to damage do NOT return to stock.
8. Full order cancellation DOES return stock.
9. Delivered and cancelled orders are terminal.
10. Backend enforces business rules; frontend never filters data.

## Order Lifecycle (Authoritative)
Order statuses:
- pending
- processing
- partially_shipped
- shipped
- delivered
- cancelled

OrderItem statuses:
- active
- cancelled
- shipped
- delivered

## Current Known Issues
- Admin orders page sometimes shows empty despite existing orders.
- Order visibility logic must be reviewed carefully.
- No payment gateway integration yet (refund-ready only).

## Coding Guidelines
- Prefer clarity over cleverness
- Do NOT add new libraries without reason
- Do NOT refactor unrelated code
- Preserve API response shapes
- Follow existing folder structure

## AI Instruction
When assisting:
- First understand existing code
- Do NOT rewrite large sections blindly
- Explain changes clearly before suggesting them
- Respect business logic above convenience
