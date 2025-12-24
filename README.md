# 🎓 SkillBuddy - AI-Powered Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

SkillBuddy is a modern, AI-powered educational platform that revolutionizes the learning experience by combining intelligent course recommendations, interactive doubt resolution, gamification, and personalized learning paths. Built with cutting-edge technologies, it provides both students and teachers with powerful tools to enhance education.

## ✨ Features

### 🎯 For Students
- **AI-Powered Learning Assistant** - Get instant help with doubts using OpenRouter AI (Meta Llama 3.3 70B)
- **Personalized Course Recommendations** - AI suggests courses based on your learning history and goals
- **Interactive Roadmap Tree** - Visual learning paths with progress tracking
- **Gamification System** - Earn points, badges, and compete on leaderboards
- **Doubt Resolution** - Ask questions and get AI-powered answers or community support
- **Progress Tracking** - Monitor your learning journey with detailed analytics
- **Profile Management** - Customize your profile with avatars and preferences

### 👨‍🏫 For Teachers
- **Course Management** - Create and manage courses with rich content
- **Student Analytics** - Track student progress and engagement
- **Assessment Tools** - Create quizzes and assignments
- **Notification System** - Keep students updated with announcements
- **Dashboard Insights** - View teaching statistics and student performance

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing with bcryptjs
- Email verification with OTP
- Role-based access control (Student/Teacher)
- Protected routes and API endpoints

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT + bcryptjs
- **AI Integration**: OpenRouter API (Meta Llama 3.3 70B)
- **Email Service**: Nodemailer (Gmail)
- **File Upload**: Multer
- **Security**: Helmet, CORS, Express Rate Limit
- **Validation**: Express Validator

### Frontend
- **Framework**: React 19.2
- **Build Tool**: Vite 7.2
- **Styling**: TailwindCSS 4.1
- **Routing**: React Router DOM 7.10
- **HTTP Client**: Axios
- **UI Components**: Lucide React (icons)
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Diagrams**: Mermaid

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB Atlas Account** (or local MongoDB instance)
- **OpenRouter API Key** (for AI features)
- **Gmail Account** (for email notifications)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dukhit/SkillBuddy.git
cd SkillBuddy
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials (see [Backend Environment Variables](#backend-environment-variables) section below).

#### Start Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Seed database with sample data
npm run seed
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file (see [Frontend Environment Variables](#frontend-environment-variables) section below).

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Environment Variables

### Backend Environment Variables

Create a `backend/.env` file with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Backend server port | `5000` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/skillbuddy` |
| `JWT_SECRET` | Secret key for JWT tokens | Generate with `openssl rand -hex 64` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `10` |
| `OPENROUTER_API_KEY` | OpenRouter API key | `sk-or-v1-...` |
| `AI_MODEL` | AI model to use | `meta-llama/llama-3.3-70b-instruct:free` |
| `SITE_URL` | Your site URL | `http://localhost:5173` |
| `SITE_NAME` | Your site name | `SkillBuddy` |
| `ENABLE_EMAIL_VERIFICATION` | Enable email verification | `true` or `false` |
| `EMAIL_SERVICE` | Email service provider | `gmail` |
| `EMAIL_USER` | Email address for sending | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Email app password | Get from Gmail App Passwords |
| `EMAIL_FROM` | From email display | `SkillBuddy <your-email@gmail.com>` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `LOG_LEVEL` | Logging level | `info` |
| `ENABLE_REQUEST_LOGGING` | Enable request logs | `true` or `false` |
| `ENABLE_AI_RECOMMENDATIONS` | Enable AI features | `true` or `false` |

#### How to Get API Keys:

**MongoDB Atlas:**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string from "Connect" → "Connect your application"

**OpenRouter API:**
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Go to [API Keys](https://openrouter.ai/keys)
3. Create a new API key

**Gmail App Password:**
1. Enable 2-Factor Authentication on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"

**JWT Secret:**
```bash
# Generate a secure random secret
openssl rand -hex 64
```

### Frontend Environment Variables

Create a `frontend/.env` file with:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:5000/api` |

## 📁 Project Structure

```
SkillBuddy/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── doubtController.js
│   │   ├── assessmentController.js
│   │   └── gamificationController.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Doubt.js
│   │   ├── Assessment.js
│   │   ├── Activity.js
│   │   ├── StudentProfile.js
│   │   └── Notification.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── doubtRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── gamificationRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── profile.js
│   │   └── searchRoutes.js
│   ├── services/         # Business logic
│   │   ├── ai-service.js
│   │   └── email-service.js
│   ├── scripts/          # Utility scripts
│   │   └── seed.js
│   ├── uploads/          # User uploaded files
│   ├── utils/            # Helper functions
│   ├── .env.example      # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js         # Entry point
│
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── api/          # API client setup
│   │   │   └── axios.js
│   │   ├── assets/       # Images, icons
│   │   ├── components/   # Reusable components
│   │   │   ├── dashboard/
│   │   │   ├── RoadmapTree.jsx
│   │   │   └── TopicDetailModal.jsx
│   │   ├── context/      # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── CourseView.jsx
│   │   │   ├── Doubts.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/     # API services
│   │   │   └── api.js
│   │   ├── utils/        # Helper functions
│   │   │   └── helpers.js
│   │   ├── App.jsx       # Main app component
│   │   ├── App.css
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── .env.example      # Environment variables template
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── README.md             # This file
```

## 🎮 Usage

### Creating an Account

1. Navigate to `http://localhost:5173`
2. Click "Sign Up" or "Get Started"
3. Choose your role (Student or Teacher)
4. Fill in your details and submit
5. Verify your email (if email verification is enabled)
6. Complete the onboarding process

### For Students

1. **Browse Courses**: Explore available courses on the dashboard
2. **Enroll in Courses**: Click on a course and enroll
3. **Ask Doubts**: Use the Doubts section to ask questions
4. **Track Progress**: View your learning progress on your profile
5. **Earn Points**: Complete courses and activities to earn points
6. **Check Leaderboard**: See how you rank against other students

### For Teachers

1. **Create Courses**: Add new courses with descriptions and content
2. **Manage Students**: View enrolled students and their progress
3. **Create Assessments**: Add quizzes and assignments
4. **Send Notifications**: Keep students updated with announcements
5. **View Analytics**: Track teaching effectiveness and student engagement

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Test OpenRouter AI integration
npm run test

# Test database connection
node test-connection.js
```

### Frontend Testing
```bash
cd frontend

# Run linter
npm run lint

# Build for production (to check for errors)
npm run build

# Preview production build
npm run preview
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The production-ready files will be in the `frontend/dist` directory.

## 🔒 Security Best Practices

- ✅ Never commit `.env` files to version control
- ✅ Use strong, randomly generated JWT secrets
- ✅ Enable HTTPS in production
- ✅ Keep dependencies updated
- ✅ Use environment-specific configurations
- ✅ Implement rate limiting on API endpoints
- ✅ Validate and sanitize all user inputs
- ✅ Use secure password hashing (bcrypt)
- ✅ Implement proper CORS policies

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **SkillBuddy Team** - [dukhit](https://github.com/dukhit)

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI API access
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [Vite](https://vitejs.dev/) for blazing fast build tool
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS
- [React](https://reactjs.org/) for the amazing UI library

## 📧 Support

For support, email dukhitmandi@gmail.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Video course support
- [ ] Live classes integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Social learning features
- [ ] Certificate generation
- [ ] Payment integration for premium courses

---

Made with ❤️ by the SkillBuddy Team