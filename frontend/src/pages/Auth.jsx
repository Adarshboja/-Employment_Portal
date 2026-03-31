import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdEmail, MdLockOutline, MdPersonOutline, MdBusiness, MdArrowForward } from 'react-icons/md';
import './Auth.css';

const Auth = ({ defaultView = 'login' }) => {
  const [isSignUp, setIsSignUp] = useState(defaultView === 'register');
  const navigate = useNavigate();
  const location = useLocation();

  const { login, register } = useContext(AuthContext);

  // Form States
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', role: 'Seeker', company: '' });
  const [loading, setLoading] = useState(false);

  // Adjust URL dynamically if sliding panels are switched manually without routing
  useEffect(() => {
    if (isSignUp && location.pathname !== '/register') {
      navigate('/register', { replace: true });
    } else if (!isSignUp && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isSignUp, navigate, location.pathname]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return toast.error('Please fill all fields');
    try {
      setLoading(true);
      const user = await login(loginForm.email, loginForm.password);
      toast.success('Login Successful');
      navigate(user.role === 'Recruiter' ? '/recruiter/dashboard' : '/jobs');
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.password) return toast.error('Please fill required fields');
    try {
      setLoading(true);
      const user = await register(regForm);
      toast.success('Registration Successful');
      navigate(user.role === 'Recruiter' ? '/recruiter/dashboard' : '/jobs');
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <motion.div 
        className="welcome-text-bg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {isSignUp ? 'REGISTER' : 'WELCOME'}
      </motion.div>

      <div className="bg-blob bg-blob-1" style={{ width: '600px', height: '600px' }}></div>
      <div className="bg-blob bg-blob-2" style={{ width: '500px', height: '500px' }}></div>

      <div className={`auth-container ${isSignUp ? 'right-panel-active' : ''}`}>
        
        {/* --- SIGN UP FORM (Left structurally, but translated Right) --- */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="auth-title" style={{ textAlign: 'center' }}>Create Account</h2>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', padding: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '12px' }}>
              <div 
                onClick={() => setRegForm({...regForm, role: 'Seeker'})}
                style={{ flex: 1, textAlign: 'center', padding: '10px', cursor: 'pointer', borderRadius: '8px', fontWeight: 600, transition: 'var(--transition)',
                  background: regForm.role === 'Seeker' ? 'var(--accent-primary)' : 'transparent', color: regForm.role === 'Seeker' ? '#fff' : 'var(--text-secondary)' }}
              >
                Seeker
              </div>
              <div 
                onClick={() => setRegForm({...regForm, role: 'Recruiter'})}
                style={{ flex: 1, textAlign: 'center', padding: '10px', cursor: 'pointer', borderRadius: '8px', fontWeight: 600, transition: 'var(--transition)',
                  background: regForm.role === 'Recruiter' ? 'var(--accent-primary)' : 'transparent', color: regForm.role === 'Recruiter' ? '#fff' : 'var(--text-secondary)' }}
              >
                Recruiter
              </div>
            </div>

            <div className="auth-input-group">
              <MdPersonOutline size={20} className="auth-icon" />
              <input type="text" className="auth-input" placeholder="Name" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
            </div>
            
            <div className="auth-input-group">
              <MdEmail size={20} className="auth-icon" />
              <input type="email" className="auth-input" placeholder="Email" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} />
            </div>
            
            <div className="auth-input-group">
              <MdLockOutline size={20} className="auth-icon" />
              <input type="password" className="auth-input" placeholder="Password" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} />
            </div>

            <AnimatePresence>
              {regForm.role === 'Recruiter' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="auth-input-group" style={{ marginBottom: 0 }}>
                  <MdBusiness size={20} className="auth-icon" />
                  <input type="text" className="auth-input" placeholder="Company Name" value={regForm.company} onChange={e => setRegForm({...regForm, company: e.target.value})} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
              {loading ? 'Processing...' : 'Sign Up'} {!loading && <MdArrowForward />}
            </motion.button>

            {/* Mobile Fallback Overlay Toggle */}
            <button type="button" className="mobile-toggle-btn" style={{ display: 'none' }} onClick={() => setIsSignUp(false)}>
              Already have an account? Sign In
            </button>
          </form>
        </div>

        {/* --- SIGN IN FORM (Left structurally) --- */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="auth-title" style={{ textAlign: 'center' }}>Sign in</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1rem' }}>Welcome back! Please enter your details.</p>
            
            <div className="auth-input-group">
              <MdEmail size={20} className="auth-icon" />
              <input type="email" className="auth-input" placeholder="Email Address" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
            </div>
            
            <div className="auth-input-group">
              <MdLockOutline size={20} className="auth-icon" />
              <input type="password" className="auth-input" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
               <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Forgot password?</span>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'} {!loading && <MdArrowForward />}
            </motion.button>
            
            {/* Mobile Fallback Overlay Toggle */}
            <button type="button" className="mobile-toggle-btn" style={{ display: 'none' }} onClick={() => setIsSignUp(true)}>
              Don't have an account? Sign Up
            </button>
          </form>
        </div>

        {/* --- OVERLAY SLIDER (Concealing Panel) --- */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            
            {/* Left Overlay (shown when looking at Sign Up, asking to Sign In) */}
            <div className="auth-overlay-panel auth-overlay-left">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontFamily: 'Outfit' }}>Hello, Friend!</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6 }}>To keep connected with us please login with your personal info</p>
              <button className="ghost-btn" onClick={() => setIsSignUp(false)}>SIGN IN ALREADY</button>
            </div>
            
            {/* Right Overlay (shown when looking at Sign In, asking to Sign Up) */}
            <div className="auth-overlay-panel auth-overlay-right">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontFamily: 'Outfit' }}>New Here?</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6 }}>Enter your personal details and start your journey with us.</p>
              <button className="ghost-btn" onClick={() => setIsSignUp(true)}>CREATE ACCOUNT</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
