
# QuicStay — Fast Hotel Booking Platform

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![Language](https://img.shields.io/badge/stack-React%20%2B%20Node-blue)

Short, dependable hotel booking web app that demonstrates a full-stack production workflow: client with React + Vite and Tailwind, API with Node.js + Express, MongoDB persistence, image uploads via Cloudinary, payments via Stripe, and authentication via Clerk. Designed for real-world bookings, owner dashboards, and availability checks.

**Live demo:**(https://quickstay-dusky-kappa.vercel.app/).

**Highlights:**
- Production-style folder structure for clear separation of concerns.
- End-to-end booking flow including availability checks and Stripe payments.
- Owner features: add/list rooms, toggle availability, view hotel bookings.
- Integrations: Cloudinary (images), Stripe (payments), Clerk (auth), Nodemailer (emails).

**Tech stack:**
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js (ESM), Express
- Database: MongoDB (Mongoose)
- Other: Cloudinary, Stripe, Clerk, Nodemailer

---

**Quick links**
- Client: `client/`
- Server: `server/`
- Key server routes: `/api/hotels`, `/api/rooms`, `/api/bookings`, `/api/users`

---

**Table of contents**
- Project overview
- How it works (simple steps)
- Architecture
- Setup & run (example commands)
- Environment variables
- API highlights
- Challenges & learnings
- Contributing

---

**Project overview**

QuicStay is a minimal, production-minded hotel booking system built to showcase a complete developer flow: client app, secured APIs, media handling, third-party integrations (payments & auth), and owner workflows. It's suitable as a portfolio project to demonstrate system design and practical engineering decisions.

**Impact / real world use**

- Enables property owners to list rooms with images and manage availability.
- Allows travelers to search availability, book securely, and receive email confirmations.
- Demonstrates handling of crucial production concerns: file uploads, background webhooks, secure payments, and protected endpoints.

---

**How it works — simple steps**

1. Owner registers and creates hotels/rooms (images uploaded to Cloudinary).
2. Traveler searches or views rooms — app calls `/api/rooms` and `/api/hotels`.
3. Availability is checked via `/api/bookings/check-availability`.
4. On book, the backend creates a booking and processes payment via Stripe (`/api/bookings/stripe-payment`).
5. Email confirmation sent via Nodemailer and records stored in MongoDB.

---

**Architecture**

High-level components:

- Client (`client/`): React SPA built with Vite. Routes, pages, and components handle UI, forms, and client-side calls to the API.
- Server (`server/`): Express API handling auth-protected endpoints, image uploads, Stripe integrations, and webhook handlers.
- Persistence: MongoDB database (`/hotel-booking` database) via the `MONGODB_URI` environment variable.
- Media: Cloudinary for storing room images.
- Auth: Clerk for user sign-in, with protected Express middleware guarding owner-only endpoints.

Sequence diagram (simplified):

Client -> API: fetch rooms / check availability
Client -> API: create booking (protected)
API -> Stripe: create payment intent
API -> Cloudinary: upload images (owner flows)
API -> MongoDB: store bookings / rooms / users

---

**Setup & run (example commands)**

Prerequisites: Node 18+, npm, MongoDB connection (Atlas or local), Stripe account (for payments), Cloudinary account.

1) Clone repo and install dependencies:

```bash
# from repo root
cd client
npm install

cd ../server
npm install
```

2) Run locally (dev mode):

```bash
# Start server (dev with nodemon)
cd server
npm run server

# Start client (Vite dev server)
cd ../client
npm run dev
```

3) Production build (client):

```bash
cd client
npm run build
```

---

**Environment variables (server/.env)**

Provide these values before starting the server:

- `MONGODB_URI` — MongoDB connection string (without trailing DB name; server appends `/hotel-booking`).
- `PORT` — API port (optional, defaults to 3000).
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials for image uploads.
- `STRIPE_SECRET_KEY` — Server-side Stripe secret key for payments.
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret (for webhook endpoints).
- `CLERK_WEBHOOK_SECRET` — Clerk webhook secret if using Clerk webhooks.
- `SMTP_USER`, `SMTP_PASS`, `SENDER_EMAIL` — SMTP credentials for sending booking emails.

Keep these secrets safe and do not commit them to version control.

---

**API highlights**

- `POST /api/hotels` — (protected) Register a new hotel (owner).
- `POST /api/rooms` — (protected) Create a room with images (multipart; up to 4 images).
- `GET /api/rooms` — Public: list available rooms.
- `GET /api/rooms/owner` — (protected) Owner's rooms.
- `POST /api/bookings/check-availability` — Check whether a room is free on requested dates.
- `POST /api/bookings/book` — (protected) Create a booking record.
- `POST /api/bookings/stripe-payment` — (protected) Process payment via Stripe.
- `GET /api/bookings/user` — (protected) List bookings for the logged-in user.
- `GET /api/bookings/hotel` — (protected) List bookings for an owner’s hotel.

Check the `server/routes` directory for the exact route handlers and middleware.

---

**Development notes & conventions**

- Server is written using ESM imports.
- Images are uploaded with `multer` then sent to Cloudinary.
- Authentication uses middleware (`protect`) that depends on Clerk auth integration.

---

**Challenges & Learnings**

- Handling file uploads and reliable Cloudinary integration: managing file streams, upload errors, and limiting images per room.
- Payment flow with Stripe: securely handling secret keys, creating payment intents, and verifying webhook signatures.
- Protecting owner-only endpoints: designing `protect` middleware to work with Clerk tokens and limiting access per resource.
- Scaling considerations: separating media storage and using background workers for heavy tasks (image processing, email delivery) for production.

What I learned:
- Integrating multiple third-party services end-to-end gives you practical tradeoffs between developer speed and operational complexity.
- Designing clear API contracts (availability check, booking creation) simplifies the frontend state management.

---

**Testing & tips**

- Use Stripe test keys to simulate transactions.
- Use MongoDB Atlas for quick remote testing and local seeding when testing offline.

---





