Task Tracker — Full-Stack Productivity App

A modern, full-stack task management system built with Next.js (frontend), Node.js + Express (backend), MongoDB Atlas, JWT authentication, OTP email verification, task scheduling, reminders, CSV export, and real-time updates using Socket.io.

This repository contains both the frontend and backend, ready for deployment with CI/CD.

🚀 Features
🔐 Authentication & Security

Signup with OTP verification

Login with JWT Access + Refresh Tokens

Secure token rotation

Logout (invalidates refresh token)

Forgot password → OTP-based reset

Rate limiting, Helmet, CORS, secure cookies

Password hashing using bcryptjs

📝 Task Management

Create, update, delete tasks

Fields include:

Title

Description

Due Date (IST timezone)

Priority (Low / Medium / High)

Status (To Do / In Progress / Done)

Project / Category

Tags

Task completion toggle

Task filtering:

All Tasks

Today’s Tasks

This Week's Tasks

Completed Tasks

By Project Name

CSV Export for task history

📅 Reminders & Automation

Cron-job powered email reminders for upcoming or overdue tasks

Daily scheduled job powered by node-cron

Email notifications using Nodemailer (SMTP)

⚡ Frontend (Next.js)

Built with Next.js 13 (pages directory)

Fully responsive UI

Light/Dark mode

Sidebar with project grouping

Task cards with visual priority indicators

Task modal for editing

New Task floating action button

Authentication pages (Login, Signup, Forgot Password)

State management using Zustand

Date handling with Day.js + timezone

🛠 Backend (Node.js + Express)

Modular Express architecture

Controllers, services, middleware, validation

Routes grouped under /api/...

Token refresh flow

OTP generation & validation

MongoDB Atlas integration

Socket.io real-time push events

Cron jobs stored in /jobs folder

Email templates & SMTP config

🗄 Database (MongoDB Atlas)

Collections:

users

tasks

refresh_tokens

Indexes applied for performance.

📂 Folder Structure
task-tracker/
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── jobs/
│   ├── package.json
│   ├── .env.example
│   └── README.md (same root readme)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── stores/
│   │   ├── lib/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md  (you are reading this)

⚙️ Environment Variables
Backend .env
NODE_ENV=development
PORT=4000

MONGODB_URI=YOUR_MONGO_ATLAS_URI

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@gmail.com
SMTP_PASS=YOUR_APP_PASSWORD
SMTP_FROM="TaskTracker <no-reply@yourdomain.com>"

JWT_ACCESS_SECRET=long_secure_random_string
JWT_REFRESH_SECRET=long_secure_random_string

ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

Frontend .env.local
NEXT_PUBLIC_API_BASE=http://localhost:4000

🛠 Running the Project Locally
1️⃣ Start Backend
cd backend
npm install
npm run dev

2️⃣ Start Frontend
cd frontend
npm install
npm run dev


App will run at:
👉 Frontend: http://localhost:3000

👉 Backend: http://localhost:4000

📦 API Overview
Auth Routes (/api/auth)

POST /send-otp

POST /verify-otp

POST /login

POST /logout

POST /refresh

POST /reset-password

Task Routes (/api/tasks)

POST / → Create

GET / → List

GET /:id

PUT /:id

DELETE /:id

GET /export/csv

📌 Tech Stack
Frontend

Next.js 13

Zustand

TailwindCSS

Day.js

React-Hot-Toast

HeadlessUI

Axios

Backend

Node.js

Express

MongoDB + Mongoose

Nodemailer

Node-Cron

JWT

Bcrypt

Winston logging

Multer upload

🚀 Deployment Options
Frontend (Next.js)

Vercel (recommended)

Netlify

Backend (Node.js)

Google Cloud Run

Render

Railway

AWS EC2

DigitalOcean App Platform

Database

MongoDB Atlas

🧪 Testing

Backend uses Jest + Supertest for integration tests:

npm test

🧑‍💻 Author

Aditya
Engineering Student, IMS Engineering College
Passionate about full-stack development and product engineering.

📜 License

This project is licensed under the MIT License.
