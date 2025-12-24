# 🎨 SkillBuddy Frontend

React + Vite frontend for the SkillBuddy AI-powered learning platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Backend server running on `http://localhost:5000`

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your backend URL
```

3. **Start development server:**
```bash
npm run dev
```

The app will start on `http://localhost:5173`

## 🏗️ Tech Stack

- **React 19.2**: UI library
- **Vite 7.2**: Build tool and dev server
- **TailwindCSS 4.1**: Utility-first CSS framework
- **React Router DOM 7.10**: Client-side routing
- **Axios**: HTTP client for API calls
- **Lucide React**: Beautiful icon library
- **Recharts**: Charting library for analytics
- **React Hot Toast**: Toast notifications
- **Mermaid**: Diagram and flowchart rendering

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance configuration
├── assets/
│   └── react.svg             # Static assets
├── components/
│   ├── dashboard/            # Dashboard-specific components
│   ├── RoadmapTree.jsx       # Learning roadmap visualization
│   └── TopicDetailModal.jsx  # Topic detail modal
├── context/
│   └── AuthContext.jsx       # Authentication context
├── pages/
│   ├── LandingPage.jsx       # Home/landing page
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Registration page
│   ├── Onboarding.jsx        # User onboarding flow
│   ├── Dashboard.jsx         # Main dashboard
│   ├── StudentDashboard.jsx  # Student-specific dashboard
│   ├── TeacherDashboard.jsx  # Teacher-specific dashboard
│   ├── CourseView.jsx        # Course details and content
│   ├── Doubts.jsx            # Doubt resolution page
│   ├── Leaderboard.jsx       # Gamification leaderboard
│   └── Profile.jsx           # User profile page
├── services/
│   └── api.js                # API service functions
├── utils/
│   └── helpers.js            # Utility functions
├── App.jsx                   # Main app component
├── App.css                   # App-specific styles
├── main.jsx                  # Entry point
└── index.css                 # Global styles
```

## 🎯 Features

### Authentication
- User registration with role selection (Student/Teacher)
- Email/password login
- JWT token management
- Protected routes
- Persistent authentication state

### Student Features
- **Dashboard**: Overview of enrolled courses and progress
- **Course Browser**: Explore and enroll in courses
- **Doubt Resolution**: Ask questions and get AI-powered answers
- **Roadmap Tree**: Visual learning path with progress tracking
- **Leaderboard**: Compete with other students
- **Profile Management**: Update bio, interests, and avatar

### Teacher Features
- **Dashboard**: Teaching analytics and student overview
- **Course Management**: Create and manage courses
- **Student Tracking**: Monitor student progress
- **Notifications**: Send announcements to students

### UI/UX Features
- Responsive design (mobile, tablet, desktop)
- Dark mode support (via TailwindCSS)
- Toast notifications for user feedback
- Loading states and error handling
- Smooth animations and transitions
- Accessible components

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

### Axios Configuration

The Axios instance is configured in `src/api/axios.js`:
- Base URL from environment variable
- Automatic JWT token attachment
- Request/response interceptors
- Error handling

### Routing

Routes are defined in `src/App.jsx`:
- Public routes: Landing, Login, Register
- Protected routes: Dashboard, Profile, Courses, etc.
- Role-based routing: Student vs Teacher dashboards

## 🎨 Styling

### TailwindCSS

The project uses TailwindCSS 4.1 with the Vite plugin:

```javascript
// vite.config.js
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Custom Styles

Global styles are in `src/index.css`:
- CSS variables for theming
- Base styles
- Custom utility classes

Component-specific styles are in `src/App.css`

## 🔐 Authentication Flow

### Login Process
1. User enters credentials
2. Frontend sends POST to `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. User redirected to dashboard
6. Token included in all subsequent API requests

### Protected Routes
```jsx
// Example protected route
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Auth Context
The `AuthContext` provides:
- `user`: Current user object
- `login()`: Login function
- `logout()`: Logout function
- `isAuthenticated`: Boolean auth status
- `loading`: Loading state

## 📡 API Integration

### API Service (`src/services/api.js`)

```javascript
// Example API calls
export const getCourses = () => axios.get('/courses')
export const enrollInCourse = (courseId) => axios.post(`/courses/${courseId}/enroll`)
export const createDoubt = (doubtData) => axios.post('/doubts', doubtData)
```

### Error Handling

API errors are handled globally in the Axios interceptor:
- Network errors
- Authentication errors (401)
- Authorization errors (403)
- Server errors (500)

Toast notifications display user-friendly error messages.

## 🧩 Key Components

### RoadmapTree
Visual representation of learning paths using Mermaid diagrams:
- Interactive nodes
- Progress tracking
- Topic details on click

### TopicDetailModal
Modal for displaying detailed topic information:
- Topic description
- Resources
- Completion status
- Action buttons

### Dashboard Components
Located in `src/components/dashboard/`:
- Statistics cards
- Progress charts (using Recharts)
- Recent activity feed
- Quick actions

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

TailwindCSS responsive utilities:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

## 🎭 Icons

Using Lucide React for icons:

```jsx
import { User, Book, Award } from 'lucide-react'

<User className="w-6 h-6" />
```

## 📊 Charts & Visualizations

### Recharts
Used for analytics dashboards:
- Line charts for progress over time
- Bar charts for course completion
- Pie charts for category distribution

### Mermaid
Used for roadmap visualizations:
- Flowcharts
- Mind maps
- Sequence diagrams

## 🔔 Notifications

Using React Hot Toast:

```javascript
import toast from 'react-hot-toast'

// Success notification
toast.success('Course enrolled successfully!')

// Error notification
toast.error('Failed to load courses')

// Loading notification
toast.loading('Processing...')
```

## 🧪 Development

### Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Hot Module Replacement (HMR)

Vite provides instant HMR for:
- React components
- CSS changes
- Fast refresh without losing state

### ESLint

Configured with:
- React plugin
- React Hooks plugin
- React Refresh plugin

## 🏗️ Building for Production

```bash
npm run build
```

Output directory: `dist/`

The build is optimized with:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

### Environment Variables
Set `VITE_BACKEND_URL` to your production backend URL.

### Build Configuration

Create `vercel.json` or `netlify.toml`:

```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 🐛 Troubleshooting

### CORS Issues
- Ensure backend CORS is configured for your frontend URL
- Check `FRONTEND_URL` in backend `.env`

### API Connection Failed
- Verify backend is running
- Check `VITE_BACKEND_URL` in `.env`
- Inspect network tab for errors

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

### Hot Reload Not Working
- Restart dev server
- Check file watchers limit (Linux):
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to customize colors:

```css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --accent: #ec4899;
}
```

### TailwindCSS Configuration
Extend TailwindCSS in `tailwind.config.js` (if needed):

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
    },
  },
}
```

## 📦 Dependencies

### Production
- `react`: ^19.2.0
- `react-dom`: ^19.2.0
- `react-router-dom`: ^7.10.1
- `axios`: ^1.13.2
- `@tailwindcss/vite`: ^4.1.17
- `tailwindcss`: ^4.1.17
- `lucide-react`: ^0.553.0
- `recharts`: ^3.5.1
- `react-hot-toast`: ^2.6.0
- `mermaid`: ^11.12.2
- `clsx`: ^2.1.1
- `tailwind-merge`: ^3.4.0

### Development
- `vite`: ^7.2.2
- `@vitejs/plugin-react`: ^5.1.0
- `eslint`: ^9.39.1
- `@types/react`: ^19.2.2
- `@types/react-dom`: ^19.2.2

## 🔄 State Management

Currently using:
- **React Context**: For authentication state
- **Component State**: For local UI state
- **URL State**: For navigation and filters

Consider adding Redux or Zustand for complex state management.

## 🧪 Testing (Future)

Recommended testing setup:
- **Vitest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing

## 📈 Performance Optimization

- **Code Splitting**: Lazy load routes
- **Image Optimization**: Use WebP format
- **Memoization**: Use React.memo for expensive components
- **Virtual Scrolling**: For long lists
- **Debouncing**: For search inputs

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For issues or questions, contact: dukhitmandi@gmail.com

---

Built with ⚡ Vite and ❤️ React
