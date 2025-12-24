import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import CourseView from './pages/CourseView';
import Doubts from './pages/Doubts';
import Leaderboard from './pages/Leaderboard';
import Profile from "./pages/Profile"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute><Onboarding /></ProtectedRoute>
          } />
          <Route path="/course/:moduleId/topic/:topicId" element={
            <ProtectedRoute><CourseView /></ProtectedRoute>
          } />
          <Route path="/doubts" element={
            <ProtectedRoute><Doubts /></ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute><Leaderboard /></ProtectedRoute>
          } />
          <Route path="/profile" element={<Profile />
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;