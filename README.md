# Task Tracker — Full-Stack Productivity App

A clean, full-stack task management system built with **Next.js (frontend)**, **Node.js + Express (backend)**, and **MongoDB Atlas**, featuring **JWT-based authentication** and secure task management.

Website URL:  
https://task-tracker-five-blush.vercel.app/

---

## 🧱 Tech Stack

### Frontend
- **Next.js (Pages Router)**
- Tailwind CSS
- Zustand (state management)
- Axios
- Day.js (date handling)

### Backend
- **Node.js + Express**
- MongoDB Atlas
- Mongoose
- JWT (Access + Refresh Tokens)
- bcrypt
- Helmet, CORS, Rate Limiting

---

## 🚀 Features

### 🔐 Authentication & Security
- Email + password signup
- Login using JWT access token
- Refresh token rotation
- Secure logout (refresh token invalidation)
- Protected routes using middleware
- Password hashing using bcrypt
- HTTP-only cookies for refresh tokens

---

### 📝 Task Management
- Create, update, delete tasks
- Task attributes:
  - Title
  - Description
  - Due Date (IST support)
  - Priority (Low / Medium / High)
  - Completion status
  - Project name
  - Tags
- Paginated task listing
- Search by title or description
- User-specific task isolation

---

## 🎨 Frontend (Next.js)
- Fully responsive UI
- Dark / light mode support
- Authentication pages:
  - Signup
  - Login
- Protected dashboard routes
- Clean, modern UI components
- Axios-based API integration
- Zustand-based auth state

---

## 🛠 Backend (Node.js + Express)
- Modular folder structure:
  - Routes
  - Controllers
  - Models
  - Middlewares
  - Utils
- MongoDB with Mongoose schemas
- JWT-based authentication
- Refresh token persistence
- Centralized error handling

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
| POST | `/register` | Register User |
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
- JWT  
- Cron  
- Winston  

---

## ☁ Deployment Options

### Frontend  
- **Vercel**  

### Backend  
- **Render**  

### Database  
- **MongoDB Atlas**

---

## 👨‍💻 Author
**Aditya Pratap Singh**  
Passionate about building production-ready applications.

---

## 📜 License
Released under **MIT License**.
