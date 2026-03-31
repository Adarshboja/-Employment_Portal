import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdEmail, MdLockOutline, MdPersonOutline, MdBusiness, MdArrowForward } from 'react-icons/md';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Seeker', company: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please fill required fields');
    }
    
    try {
      setLoading(true);
      const user = await register(formData);
      toast.success('Registration Successful');
      navigate(user.role === 'Recruiter' ? '/recruiter/dashboard' : '/jobs');
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Huge Background Welcome Text */}
      <motion.div 
        className="welcome-text-bg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        SIGNUP
      </motion.div>

      {/* Brighter Blobs for light color request */}
      <div className="bg-blob bg-blob-2" style={{ width: '600px', height: '600px', background: 'rgba(56, 189, 248, 0.2)' }}></div>
      <div className="bg-blob bg-blob-1" style={{ width: '500px', height: '500px', background: 'rgba(232, 121, 249, 0.2)' }}></div>
      
      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ boxShadow: '0 20px 40px 0 rgba(0, 0, 0, 0.4)' }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        style={{ padding: '40px', width: '100%', maxWidth: '520px', zIndex: 10, position: 'relative', backdropFilter: 'blur(20px)', background: 'var(--glass-bg)' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2.2rem', fontFamily: 'Outfit' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '35px', fontSize: '1.05rem' }}>Join the community today.</p>
        
        <form onSubmit={handleRegister}>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', padding: '5px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
            <motion.label 
              whileTap={{ scale: 0.95 }}
              style={{ flex: 1, textAlign: 'center', padding: '12px', cursor: 'pointer', borderRadius: '8px', 
                background: formData.role === 'Seeker' ? 'var(--accent-primary)' : 'transparent',
                color: formData.role === 'Seeker' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600, transition: 'var(--transition)'
              }}
            >
              <input type="radio" name="role" value="Seeker" checked={formData.role === 'Seeker'} onChange={handleChange} style={{ display: 'none' }} />
              Job Seeker
            </motion.label>
            <motion.label 
              whileTap={{ scale: 0.95 }}
              style={{ flex: 1, textAlign: 'center', padding: '12px', cursor: 'pointer', borderRadius: '8px', 
                background: formData.role === 'Recruiter' ? 'var(--accent-primary)' : 'transparent',
                color: formData.role === 'Recruiter' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600, transition: 'var(--transition)'
              }}
            >
              <input type="radio" name="role" value="Recruiter" checked={formData.role === 'Recruiter'} onChange={handleChange} style={{ display: 'none' }} />
              Recruiter
            </motion.label>
          </div>

          <div className="input-group" style={{ position: 'relative' }}>
            <label className="input-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <MdPersonOutline size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" name="name" className="input-field" style={{ paddingLeft: '48px', height: '50px' }} placeholder="John Doe" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group" style={{ position: 'relative' }}>
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <MdEmail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="email" name="email" className="input-field" style={{ paddingLeft: '48px', height: '50px' }} placeholder="you@email.com" onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group" style={{ position: 'relative' }}>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <MdLockOutline size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="password" name="password" className="input-field" style={{ paddingLeft: '48px', height: '50px' }} placeholder="••••••••" onChange={handleChange} />
            </div>
          </div>

          <AnimatePresence>
            {formData.role === 'Recruiter' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="input-group" style={{ position: 'relative' }}>
                <label className="input-label">Company Name</label>
                <div style={{ position: 'relative' }}>
                  <MdBusiness size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input type="text" name="company" className="input-field" style={{ paddingLeft: '48px', height: '50px' }} placeholder="Acme Corp" onChange={handleChange} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Complete Signup'}
            {!loading && <MdArrowForward size={20} />}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
