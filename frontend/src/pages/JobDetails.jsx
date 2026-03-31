import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MdLocationOn, MdWork, MdAttachMoney } from 'react-icons/md';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Apply state
  const { user } = useContext(AuthContext);
  const [showApply, setShowApply] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await axios.get(`/api/jobs/${id}`);
        setJob(data);

        // Check if user has already applied
        if (user && user.role === 'Seeker') {
          const statusCheck = await axios.get(`/api/applications/check/${id}`);
          setHasApplied(statusCheck.data.hasApplied);
        }
      } catch (error) {
        toast.error('Error fetching job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, user]);

const API = import.meta.env.VITE_API_URL;

const handleApply = async (e) => {
  e.preventDefault();
  if (!resume) return toast.error('Please attach a resume');

  const formData = new FormData();
  formData.append('resume', resume);
  formData.append('message', message);

  try {
    setApplying(true);

    // ✅ FIXED LINE
    await axios.post(`${API}/api/applications/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    toast.success('Successfully applied for the job!');
    setShowApply(false);
    setHasApplied(true);
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to apply');
  } finally {
    setApplying(false);
  }
};

  if (loading) return <div className="page-container" style={{ textAlign: 'center' }}>Loading...</div>;
  if (!job) return <div className="page-container" style={{ textAlign: 'center' }}>Job Not Found</div>;

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        <Link to="/jobs" style={{ color: 'var(--text-secondary)' }}>&larr; Back to Jobs</Link>

        <motion.div className="glass-panel" style={{ padding: '40px' }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{job.title}</h1>
              <h2 style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', fontWeight: 500 }}>{job.company}</h2>
            </div>
            
            {user?.role === 'Seeker' && (
              hasApplied ? (
                <button className="btn" style={{ background: 'var(--glass-bg)', border: '1px solid var(--success)', color: 'var(--success)', cursor: 'default' }} disabled>
                  &#10003; Already Applied
                </button>
              ) : (
                <button className={`btn ${showApply ? 'btn-outline' : 'btn-primary'}`} onClick={() => setShowApply(!showApply)}>
                  {showApply ? 'Cancel' : 'Apply Now'}
                </button>
              )
            )}
          </div>

          <div style={{ display: 'flex', gap: '24px', marginTop: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <MdLocationOn size={24} color="var(--accent-primary)" />
              <span style={{ fontSize: '1.1rem' }}>{job.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <MdWork size={24} color="var(--accent-primary)" />
              <span style={{ fontSize: '1.1rem' }}>{job.experience}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
              <MdAttachMoney size={24} />
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{job.salary}</span>
            </div>
          </div>

          {showApply && !hasApplied && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ overflow: 'hidden', marginTop: '20px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ marginBottom: '20px' }}>Submit Your Application</h3>
              <form onSubmit={handleApply}>
                <div className="input-group">
                  <label className="input-label">Resume (PDF, DOCX)</label>
                  <input type="file" className="input-field" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} />
                </div>
                <div className="input-group">
                  <label className="input-label">Cover Message (Optional)</label>
                  <textarea className="input-field" rows="4" placeholder="Why are you a good fit?" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={applying}>
                  {applying ? 'Submitting...' : 'Confirm Application'}
                </button>
              </form>
            </motion.div>
          )}

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Job Description</h3>
            <div 
              className="rich-text-content" 
              dangerouslySetInnerHTML={{ __html: job.description }} 
            />
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Required Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {job.skills.map(skill => (
                <span key={skill} style={{ padding: '8px 16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--text-primary)', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default JobDetails;
