import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MdWorkOutline, MdBusiness, MdLocationOn, MdAttachMoney, MdTimeline, MdCode, MdAdd, MdDeleteOutline } from 'react-icons/md';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Post Job State
  const [showPostJob, setShowPostJob] = useState(false);
  const [formData, setFormData] = useState({ title: '', company: '', location: '', salary: '', experience: '', skills: '', description: '' });

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
     const { data } = await axios.get(`${API}/api/jobs/recruiter/me`);   
     setJobs(Array.isArray(data) ? data : data.jobs || []);    } catch (error) {
      toast.error('Failed to load posted jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const API = import.meta.env.VITE_API_URL;

const handlePostJob = async (e) => {
  e.preventDefault();
  try {
    const payload = { 
      ...formData, 
      skills: formData.skills.split(',').map(s => s.trim()) 
    };

    // ✅ FIXED LINE
    await axios.post(`${API}/api/jobs`, payload);

    toast.success('Job posted successfully');
    setShowPostJob(false);
    setFormData({ title: '', company: '', location: '', salary: '', experience: '', skills: '', description: '' });
    fetchMyJobs();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to post job');
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
       await axios.delete(`${API}/api/jobs/${id}`);
        toast.success('Job deleted');
        fetchMyJobs();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  if (loading) return <div className="page-container" style={{ textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="page-container">
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit' }}>Recruiter <span className="text-gradient">Dashboard</span></h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your team's job listings and candidates.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className={`btn ${showPostJob ? 'btn-outline' : 'btn-primary'}`} 
            onClick={() => setShowPostJob(!showPostJob)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {showPostJob ? 'Cancel Draft' : <><MdAdd size={20} /> Post New Job</>}
          </motion.button>
        </div>

        {/* Premium Post Job Form */}
        <AnimatePresence>
          {showPostJob && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -20 }} 
              animate={{ height: 'auto', opacity: 1, y: 0 }} 
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginBottom: '40px' }}
            >
              <div className="glass-panel" style={{ padding: '40px' }}>
                <h3 style={{ marginBottom: '30px', fontSize: '1.8rem', fontFamily: 'Outfit' }}>Draft Job Posting</h3>
                
                <form onSubmit={handlePostJob} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  
                  <div className="auth-input-group" style={{ gridColumn: '1 / -1', margin: 0 }}>
                    <MdWorkOutline size={20} className="auth-icon" />
                    <input type="text" name="title" className="auth-input" placeholder="Senior Frontend Engineer" required value={formData.title} onChange={handleChange} />
                  </div>
                  
                  <div className="auth-input-group" style={{ margin: 0 }}>
                    <MdBusiness size={20} className="auth-icon" />
                    <input type="text" name="company" className="auth-input" placeholder="Company Name" required value={formData.company} onChange={handleChange} />
                  </div>
                  
                  <div className="auth-input-group" style={{ margin: 0 }}>
                    <MdLocationOn size={20} className="auth-icon" />
                    <input type="text" name="location" className="auth-input" placeholder="New York, NY (Remote)" required value={formData.location} onChange={handleChange} />
                  </div>
                  
                  <div className="auth-input-group" style={{ margin: 0 }}>
                    <MdAttachMoney size={20} className="auth-icon" />
                    <input type="text" name="salary" className="auth-input" placeholder="$120k - $160k" required value={formData.salary} onChange={handleChange} />
                  </div>
                  
                  <div className="auth-input-group" style={{ margin: 0 }}>
                    <MdTimeline size={20} className="auth-icon" />
                    <input type="text" name="experience" className="auth-input" placeholder="4+ Years Experience" required value={formData.experience} onChange={handleChange} />
                  </div>
                  
                  <div className="auth-input-group" style={{ gridColumn: '1 / -1', margin: 0 }}>
                    <MdCode size={20} className="auth-icon" />
                    <input type="text" name="skills" className="auth-input" placeholder="React, Node.js, GraphQL (comma separated)" required value={formData.skills} onChange={handleChange} />
                  </div>
                  
                  <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>Rich Job Description</label>
                    <div className="quill-container">
                      <ReactQuill 
                        theme="snow" 
                        value={formData.description} 
                        onChange={(val) => setFormData({ ...formData, description: val })}
                        placeholder="Describe the role, responsibilities, and benefits..."
                        style={{ height: '250px', marginBottom: '50px' }}
                      />
                    </div>
                  </div>
                  
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', padding: '15px' }}>
                    Publish Job Listing
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posted Jobs Grid */}
        <h2 style={{ marginBottom: '24px', fontFamily: 'Outfit', fontSize: '1.8rem' }}>Active Listings</h2>
        {jobs.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
            <MdWorkOutline size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '20px' }} />
            <h3 style={{ marginBottom: '10px' }}>No Active Listings</h3>
            <p style={{ color: 'var(--text-secondary)' }}>You haven't posted any jobs yet. Create your first posting to start sourcing candidates!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
         {Array.isArray(jobs) && jobs.map((job, i) => (         
               <motion.div 
                key={job._id} 
                className="glass-panel" 
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }} 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-gradient)' }}></div>
                
                <div style={{ flexGrow: 1, paddingLeft: '8px' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{job.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MdLocationOn size={16} /> {job.location}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)', paddingLeft: '8px' }}>
                  <Link to={`/recruiter/job/${job._id}/applicants`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    View Applicants
                  </Link>
                  <button onClick={() => handleDelete(job._id)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', color: 'var(--danger)', borderColor: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MdDeleteOutline size={16} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
