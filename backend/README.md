# 🔧 SkillBuddy Backend

Node.js/Express backend for the SkillBuddy AI-powered learning platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB Atlas account or local MongoDB instance
- OpenRouter API key
- Gmail account with app password

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Seed database with sample data
npm run seed
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Course Endpoints

#### Get All Courses
```http
GET /api/courses
Authorization: Bearer <token>
```

#### Get Course by ID
```http
GET /api/courses/:id
Authorization: Bearer <token>
```

#### Create Course (Teacher only)
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction to JavaScript",
  "description": "Learn JavaScript fundamentals",
  "category": "Programming",
  "difficulty": "beginner"
}
```

#### Enroll in Course
```http
POST /api/courses/:id/enroll
Authorization: Bearer <token>
```

### Doubt Endpoints

#### Get All Doubts
```http
GET /api/doubts
Authorization: Bearer <token>
```

#### Create Doubt
```http
POST /api/doubts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "How does async/await work?",
  "description": "I'm confused about async/await in JavaScript",
  "category": "JavaScript"
}
```

#### Get AI Answer
```http
POST /api/doubts/:id/ai-answer
Authorization: Bearer <token>
```

### Profile Endpoints

#### Get Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Passionate learner",
  "interests": ["JavaScript", "React", "Node.js"]
}
```

#### Upload Avatar
```http
POST /api/profile/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: <file>
```

### Gamification Endpoints

#### Get Leaderboard
```http
GET /api/gamification/leaderboard
Authorization: Bearer <token>
```

#### Get User Points
```http
GET /api/gamification/points
Authorization: Bearer <token>
```

### Notification Endpoints

#### Get Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

#### Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

## 🗄️ Database Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (student/teacher)
- `profilePicture`: String
- `isEmailVerified`: Boolean
- `points`: Number
- `badges`: Array

### Course
- `title`: String (required)
- `description`: String
- `instructor`: ObjectId (ref: User)
- `category`: String
- `difficulty`: String (beginner/intermediate/advanced)
- `enrolledStudents`: Array of ObjectIds
- `createdAt`: Date

### Doubt
- `title`: String (required)
- `description`: String (required)
- `student`: ObjectId (ref: User)
- `category`: String
- `aiAnswer`: String
- `status`: String (open/answered/closed)
- `createdAt`: Date

### Assessment
- `title`: String (required)
- `course`: ObjectId (ref: Course)
- `questions`: Array
- `passingScore`: Number
- `createdAt`: Date

### StudentProfile
- `user`: ObjectId (ref: User)
- `bio`: String
- `interests`: Array of Strings
- `learningGoals`: Array of Strings
- `enrolledCourses`: Array of ObjectIds
- `completedCourses`: Array of ObjectIds
- `currentLevel`: Number

### Notification
- `user`: ObjectId (ref: User)
- `title`: String
- `message`: String
- `type`: String (info/success/warning/error)
- `isRead`: Boolean
- `createdAt`: Date

### Activity
- `user`: ObjectId (ref: User)
- `type`: String (course_completed/badge_earned/etc)
- `points`: Number
- `metadata`: Object
- `createdAt`: Date

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned upon successful login/registration and expire based on the JWT_SECRET configuration.

## 🤖 AI Integration

The backend integrates with OpenRouter API for AI-powered features:

- **Doubt Resolution**: AI generates answers to student questions
- **Course Recommendations**: AI suggests relevant courses
- **Learning Path Generation**: AI creates personalized learning roadmaps

### AI Service Configuration

The AI service is configured in `services/ai-service.js` and uses:
- **Model**: Meta Llama 3.3 70B Instruct (free tier)
- **Provider**: OpenRouter
- **Features**: Text generation, question answering, recommendations

## 📧 Email Service

Email notifications are sent using Nodemailer with Gmail:

- **Welcome emails** for new users
- **Email verification** OTPs
- **Course enrollment** confirmations
- **Achievement notifications**

Configure email settings in `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse (100 requests per 15 minutes)
- **Input Validation**: Express Validator
- **Password Hashing**: bcryptjs with 10 rounds
- **JWT Authentication**: Secure token-based auth

## 📝 Scripts

```bash
# Start server in production
npm start

# Start server in development with auto-reload
npm run dev

# Seed database with sample data
npm run seed

# Test OpenRouter AI integration
npm run test
```

## 🧪 Testing

### Test Database Connection
```bash
node test-connection.js
```

### Test AI Service
```bash
node test-ai.js
```

### Test OpenRouter Integration
```bash
npm run test
```

## 📦 Dependencies

### Production
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT authentication
- `bcryptjs`: Password hashing
- `axios`: HTTP client
- `dotenv`: Environment variables
- `cors`: CORS middleware
- `helmet`: Security headers
- `express-rate-limit`: Rate limiting
- `express-validator`: Input validation
- `multer`: File uploads
- `nodemailer`: Email service
- `compression`: Response compression
- `morgan`: HTTP request logger

### Development
- `nodemon`: Auto-reload during development

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your `MONGODB_URI` is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure network access is configured properly

### OpenRouter API Errors
- Verify your `OPENROUTER_API_KEY` is valid
- Check if you have API credits/quota
- Ensure the model name is correct

### Email Service Issues
- Enable 2-Factor Authentication on Gmail
- Generate an App Password (not your regular password)
- Check if "Less secure app access" is enabled (if needed)

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 📊 Performance

- **Compression**: Gzip compression enabled
- **Database Indexing**: Optimized queries with indexes
- **Caching**: Consider adding Redis for session management
- **Rate Limiting**: Prevents API abuse

## 🔄 API Versioning

Current API version: `v1`

All endpoints are prefixed with `/api/`

## 📈 Monitoring

Consider adding:
- **Winston**: Advanced logging
- **PM2**: Process management
- **New Relic**: Application monitoring
- **Sentry**: Error tracking

## 🚀 Deployment

### Environment Variables
Ensure all production environment variables are set:
- Use strong, unique `JWT_SECRET`
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Update `FRONTEND_URL` to production domain

### Recommended Hosting
- **Heroku**: Easy deployment
- **DigitalOcean**: VPS hosting
- **AWS EC2**: Scalable cloud hosting
- **Railway**: Modern deployment platform

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For issues or questions, contact: dukhitmandi@gmail.com
