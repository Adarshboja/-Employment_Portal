import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import JobDetails from './pages/JobDetails';
import SeekerDashboard from './pages/SeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobApplicants from './pages/JobApplicants';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs';

function App() {
  const { user, loading } = useContext(AuthContext);

  const PrivateRoute = ({ children, roles }) => {
    if (loading) return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/jobs" />;
    return children;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Router>
      <div className="page-shell">
        <Navbar />
        <main className="main-area">
          <div className="bg-bubble b1" />
          <div className="bg-bubble b2" />
          <div className="bg-bubble b3" />
          <ToastContainer position="top-right" theme="dark" />
          <Routes>
            <Route path="/" element={user ? <Navigate to="/jobs" /> : <Navigate to="/login" />} />
            
            <Route path="/login" element={!user ? <Auth defaultView="login" /> : <Navigate to="/jobs" />} />
            <Route path="/register" element={!user ? <Auth defaultView="register" /> : <Navigate to="/jobs" />} />
            
            <Route path="/jobs" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/job/:id" element={<PrivateRoute><JobDetails /></PrivateRoute>} />
            <Route path="/my-applications" element={<PrivateRoute roles={['Seeker']}><SeekerDashboard /></PrivateRoute>} />
            <Route path="/saved" element={<PrivateRoute roles={['Seeker']}><SavedJobs /></PrivateRoute>} />
            <Route path="/recruiter/dashboard" element={<PrivateRoute roles={['Recruiter']}><RecruiterDashboard /></PrivateRoute>} />
            <Route path="/recruiter/job/:jobId/applicants" element={<PrivateRoute roles={['Recruiter']}><JobApplicants /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
