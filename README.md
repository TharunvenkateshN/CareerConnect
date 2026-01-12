# CareerConnect – MERN Stack Job Portal

A full-stack Job Application Platform built using the MERN stack, supporting Job Seekers and Job Providers with separate authentication, dashboards, and workflows.

This project is designed as a learning-by-building MERN journey, focusing on clean architecture, real-world features, and scalable backend practices.

## 🔗 Live Demo
Coming soon

## 📌 Features

### 👨‍💼 Job Seekers
- User registration & login (JWT authentication)
- Create & update professional profile
- Browse and search job listings
- Apply for jobs
- Track application status

### 🏢 Job Providers
- Company registration & login
- Post new job openings
- Edit / delete job listings
- View applicants for posted jobs
- Manage hiring pipeline

### ⚙️ Platform Features
- Role-based authentication (Job Seeker / Recruiter)
- Secure REST APIs
- Protected routes
- Scalable MongoDB schema design
- Clean separation of frontend & backend

## 🧱 Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS / Tailwind (optional)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)
- bcrypt.js (password hashing)

### Tools & DevOps
- Git & GitHub
- Postman (API testing)
- Docker (optional – future)
- VS Code

## 🏗️ System Architecture

**Flow Explanation:**
1. React handles UI and sends requests via Axios
2. Express receives API requests
3. JWT middleware verifies authentication
4. MongoDB stores users, jobs, and applications
5. Role-based access controls responses

## 📂 Project Structure
```
CareerConnect/
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── Pages/
│   │   ├── utils/          # API calls & helpers
│   │   ├── context/        # Auth context
│   │   └── App.jsx
│
├── backend/                # Node + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   └── server.js
│
├── .env
├── README.md
└── package.json
```

## 🔐 Authentication Flow
1. User registers → password hashed using bcrypt
2. Login → JWT generated
3. JWT stored on client
4. JWT sent in request headers
5. Backend middleware verifies token
6. Role-based access granted

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Git

### Clone Repository
```bash
git clone https://github.com/TharunvenkateshN/CareerConnect.git
cd CareerConnect
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

Create `.env` file in `backend/`:
```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### Frontend Setup
```bash
cd frontend/CareerConnect
npm install
npm run dev
```

## 🧪 API Testing
Use Postman to test:
- `/api/auth/register`
- `/api/auth/login`
- `/api/jobs`
- `/api/applications`

## 🧠 Learning Goals (Why This Project Exists)
- Understand full MERN request lifecycle
- Learn JWT & middleware deeply
- Practice real-world database modeling
- Build role-based systems
- Debug backend & frontend issues systematically
- Prepare for internships, GSoC, WoC, placements

## 🐞 Debugging Philosophy (Used in This Project)
- Check request flow (Frontend → Backend)
- Log API payloads
- Verify middleware execution
- Inspect MongoDB documents
- Validate JWT tokens
- Use Postman before UI testing

## 🚀 Future Enhancements
- Resume upload (PDF)
- Email notifications
- Admin dashboard
- Job recommendation engine
- Dockerized deployment
- Cloud hosting (AWS / Render / Vercel)

## 🤝 Contributing
Contributions are welcome!
1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

## 📜 License
This project is licensed under the MIT License.

## 👤 Author
**Tharun Venkatesh**
B.Tech – Computer & Communication Engineering
Learning MERN | IoT | AI/ML | Full-Stack Development

⭐ If you find this project useful, give it a star!
