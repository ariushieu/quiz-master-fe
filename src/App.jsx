import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SetList from './pages/SetList';
import CreateSet from './pages/CreateSet';
import Study from './pages/Study';
import Quiz from './pages/Quiz';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import Explore from './pages/Explore';
import ReadingList from './pages/ReadingList';
import ReadingPractice from './pages/ReadingPractice';
import CreateReading from './pages/CreateReading';
import EditReading from './pages/EditReading';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>QuizMaster - Master Your Knowledge</title>
        <meta name="description" content="Join QuizMaster to create, study, and share flashcards. The best way to master any subject." />
      </Helmet>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/sets" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/sets" replace /> : <Register />}
        />
        <Route
          path="/sets"
          element={
            <ProtectedRoute>
              <SetList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateSet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <CreateSet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:id"
          element={
            <ProtectedRoute>
              <Study />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:username"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading"
          element={
            <ProtectedRoute>
              <ReadingList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading/create"
          element={
            <ProtectedRoute>
              <CreateReading />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading/edit/:id"
          element={
            <ProtectedRoute>
              <EditReading />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading/:id"
          element={
            <ProtectedRoute>
              <ReadingPractice />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
