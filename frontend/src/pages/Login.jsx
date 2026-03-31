import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdEmail, MdLockOutline, MdArrowForward } from 'react-icons/md';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    
    try {
      setLoading(true);
      const user = await login(email, password);
      toast.success('Login Successful');
      navigate(user.role === 'Recruiter' ? '/recruiter/dashboard' : '/jobs');
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 0, position: 'relative', overflow: 'hidden' }}>
      
      {/* Huge Background Welcome Text */}
      <motion.div 
        className="welcome-text-bg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        WELCOME
      </motion.div>

      <div className="bg-blob bg-blob-1" style={{ width: '600px', height: '600px' }}></div>
      <div className="bg-blob bg-blob-2" style={{ width: '500px', height: '500px' }}></div>
      
      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ boxShadow: '0 20px 40px 0 rgba(0, 0, 0, 0.4)' }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        style={{ padding: '50px 40px', width: '100%', maxWidth: '460px', zIndex: 10, position: 'relative', backdropFilter: 'blur(20px)' }}
      >
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          style={{ width: '60px', height: '60px', background: 'var(--accent-gradient)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)' }}
        >
          <MdLockOutline size={30} color="#fff" />
        </motion.div>

        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2.2rem', fontFamily: 'Outfit' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '35px', fontSize: '1.05rem' }}>Sign in to continue your journey.</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group" style={{ position: 'relative' }}>
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <MdEmail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '48px', height: '54px' }}
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-group" style={{ position: 'relative', marginBottom: '30px' }}>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <MdLockOutline size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '48px', height: '54px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <MdArrowForward size={20} />}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>
              Register Now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
