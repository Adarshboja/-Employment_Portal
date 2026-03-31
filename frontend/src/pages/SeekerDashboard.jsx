import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const SeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get('/api/applications/myapplications');
        setApplications(data);
        setError('');
      } catch (error) {
        setError('Failed to load applications. Please try again.');
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div className="page-container" style={{ textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ marginBottom: '30px' }}>My <span className="text-gradient">Applications</span></h1>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '12px' }}>{error}</p>}
        
        {applications.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You haven't applied to any jobs yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {applications.map((app, i) => {
              const job = app.job || {};
              return (
              <motion.div 
                key={app._id} 
                className="glass-panel" 
                style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{job.title || 'Job removed'}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{job.company || 'Unavailable'} {job.location ? `- ${job.location}` : ''}</p>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    background: app.status === 'Accepted' ? 'rgba(16, 185, 129, 0.2)' : app.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: app.status === 'Accepted' ? 'var(--success)' : app.status === 'Rejected' ? 'var(--danger)' : 'var(--warning)',
                    border: `1px solid ${app.status === 'Accepted' ? 'rgba(16, 185, 129, 0.4)' : app.status === 'Rejected' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                  }}>
                    {app.status}
                  </span>
                  
                  {app.feedback && (
                    <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '250px' }}>
                      <strong>Feedback:</strong> {app.feedback}
                    </p>
                  )}
                </div>
              </motion.div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;
