# Task Tracker — Full-Stack Productivity App

A modern, full-stack task management system built with Next.js (frontend), Node.js + Express (backend), MongoDB Atlas, OTP-based authentication, JWT token system, task scheduling, email reminders, CSV export, and real-time updates using Socket.io.

Website URL - https://task-tracker-five-blush.vercel.app/

Tech Stack Used:

- **Next.js (Frontend)**
- **Node.js + Express (Backend)**
- **MongoDB Atlas**
- **OTP-based authentication**
- **JWT (Access + Refresh Tokens)**
- **Email reminders**
- **Real-time updates (Socket.io)**

This repository includes **both frontend and backend**, structured for clean development and ready for CI/CD deployment.

---

## 🚀 Features

### 🔐 Authentication & Security
- Signup with **OTP email verification**
- Login with **JWT Access Token + Refresh Token**
- Secure **token rotation**
- Logout (refresh token invalidated)
- Forgot password → **OTP reset flow**
- Rate limiting, Helmet, CORS
- Secure cookies + bcrypt password hashing

---

### 📝 Task Management
- Create, update, delete tasks
- Task attributes:
  - Title
  - Description
  - Due Date (in IST)
  - Priority (LOW / MEDIUM / HIGH)
  - Status (Completed / Pending)
  - Project name
  - Tags
- Toggle completion
- Smart filters:
  - **All Tasks**
  - **Today**
  - **This Week**
  - **Completed**
  - **By Project**
  

---

### 📅 Automation & Reminders
- Automatic reminder emails for:
  - Overdue tasks  
  - Daily upcoming tasks  
- Powered by **node-cron**
- SendGrid email delivery system

---

## 🎨 Frontend (Next.js)
- Next.js Pages Router
- Fully responsive UI
- Beautiful dark/light themes
- Sticky header + dynamic sidebar
- Zustand for global state management
- Axios for API communication
- Day.js for date/time operations
- Polished UI components & task cards

---

## 🛠 Backend (Node.js + Express)
- Clean folder structure (Routes → Controllers → Services → Models)
- MongoDB + Mongoose
- OTP generation + secure verification
- JWT authentication (access + refresh)
- Email sending via SendGrid
- Cron jobs for reminders
- Winston-based logging
- API built for scalability & reliability

---

## 📂 Project Structure

```
task-tracker/
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── jobs/
│   │   ├── middlewares/
│   │   └── utils/
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── stores/
│   │   ├── lib/
│   │   └── styles/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### 📌 Backend `.env`
```
NODE_ENV=development
PORT=4000

MONGODB_URI=YOUR_MONGODB_ATLAS_URI

SENDGRID_API_KEY= YOUR_API_KEY
JWT_ACCESS_SECRET=SUPER_SECRET_ACCESS_KEY
JWT_REFRESH_SECRET=SUPER_SECRET_REFRESH_KEY

ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
```

### 📌 Frontend `.env.local`
```
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

---

## 🧪 Running Locally

### ▶ Backend
```
cd backend
npm install
npm run dev
```

### ▶ Frontend
```
cd frontend
npm install
npm run dev
```

### Local URLs
- Frontend → http://localhost:3000  
- Backend → http://localhost:4000  

---

## 🌐 API Endpoints

### 🔐 Auth ( `/api/auth` )
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/send-otp` | Send OTP for signup/reset |
| POST | `/verify-otp` | Verify OTP (signup/reset) |
| POST | `/login` | Login user |
| POST | `/logout` | Logout user |
| POST | `/refresh` | Refresh access token |

### ✅ Tasks ( `/api/tasks` )
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create task |
| GET | `/` | Fetch tasks |
| GET | `/:id` | Fetch one task |
| PUT | `/:id` | Update task |
| DELETE | `/:id` | Delete task |
| GET | `/export/csv` | Export all tasks to CSV |

---

## 🧰 Tech Stack

### Frontend
- Next.js  
- TailwindCSS  
- Zustand  
- Axios  
- Day.js  

### Backend
- Node.js  
- Express  
- MongoDB  
- Mongoose  
- Nodemailer  
- JWT  
- Cron  
- Winston  

---

## ☁ Deployment Options

### Frontend  
- **Vercel (Recommended)**  
- Netlify  

### Backend  
- **Google Cloud Run**  
- Render  
- Railway  
- DigitalOcean  

### Database  
- **MongoDB Atlas**

---

## 👨‍💻 Author
**Aditya Pratap Singh**  
Passionate about building production-ready applications.

---

## 📜 License
Released under **MIT License**.
