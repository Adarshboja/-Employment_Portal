import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdSchool, MdLocationOn, MdPerson, MdDateRange, MdWork, MdPhone, MdEmail, MdCheckCircle } from 'react-icons/md';
import { assetUrl } from '../config';

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const { data } = await axios.get(`/api/applications/job/${jobId}`);
      setApplicants(data);
    } catch (error) {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    const feedback = window.prompt(`Enter optional feedback for ${status} status:`, '');
    if (feedback !== null) {
      try {
        await axios.put(`/api/applications/${appId}/status`, { status, feedback });
        toast.success(`Application marked as ${status}`);
        fetchApplicants();
      } catch (error) {
        toast.error('Failed to update status');
      }
    }
  };

  if (loading) return <div className="page-container" style={{ textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="page-container">
      <div className="container">
        
        <div style={{ marginBottom: '30px' }}>
          <Link to="/recruiter/dashboard" style={{ color: 'var(--accent-primary)', marginBottom: '10px', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
          <h1>Applicants <span className="text-gradient">List</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Total Applicants: {applicants.length}</p>
        </div>

        {applicants.length === 0 ? (
          <p>No applicants found for this job.</p>
        ) : (
          <div style={{ display: 'grid', gap: '30px' }}>
            {applicants.map((app, i) => {
              return (
              <motion.div 
                key={app._id} 
                className="glass-panel" 
                style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-primary)' }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Header Profile Section */}
                <div style={{ display: 'flex', gap: '25px', alignItems: 'center', flexWrap: 'wrap', borderBottom: '1px solid var(--glass-border)', paddingBottom: '25px' }}>
                  
                  {/* Avatar simple */}
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                    {app.applicant?.avatar ? (
                      <img src={assetUrl(app.applicant.avatar)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      app.applicant?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>

                  {/* Main Title Info */}
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {app.applicant?.name?.toUpperCase() || 'UNKNOWN CANDIDATE'}
                    </h2>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: '600', marginBottom: '4px' }}>{app.applicant?.education || 'Degree Not Provided'}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{app.applicant?.institute || 'Institute Not Provided'}</p>
                  </div>
                </div>

                {/* Details Grid (Like Screenshot) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', paddingBottom: '20px', borderBottom: '1px dashed var(--glass-border)' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                      <MdLocationOn size={20} color="var(--text-secondary)" /> {app.applicant?.location || 'Location N/A'}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                      <MdPerson size={20} color="var(--text-secondary)" /> {app.applicant?.gender || 'Gender N/A'}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                      <MdDateRange size={20} color="var(--text-secondary)" /> {app.applicant?.dob ? new Date(app.applicant.dob).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : 'DOB N/A'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '20px' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                      <MdPhone size={20} color="var(--text-secondary)" /> {app.applicant?.phone || 'Phone N/A'} <MdCheckCircle color="var(--success)" size={16} />
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                      <MdEmail size={20} color="var(--text-secondary)" /> {app.applicant?.email} <MdCheckCircle color="var(--success)" size={16} />
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                       <MdWork size={20} color="var(--text-secondary)" /> {app.applicant?.experience || '0'} Years Experience
                    </p>
                  </div>
                </div>

                {/* Extra Details & Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <strong style={{color: 'var(--text-primary)'}}>Skills:</strong> {app.applicant?.skills?.join(', ') || 'None Listed'}
                  </p>
                  
                  {app.applicant?.certifications && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      <strong style={{color: 'var(--text-primary)'}}>Certifications:</strong> {app.applicant.certifications}
                    </p>
                  )}

                  {app.applicant?.projects && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      <strong style={{color: 'var(--text-primary)'}}>Projects:</strong> {app.applicant.projects}
                    </p>
                  )}

                  {app.message && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', fontSize: '0.95rem', borderLeft: '3px solid var(--accent-primary)' }}>
                      <strong style={{color: 'var(--text-primary)'}}>Cover Message:</strong> <br/><span style={{color: 'var(--text-secondary)', display: 'inline-block', marginTop: '5px'}}>{app.message}</span>
                    </div>
                  )}
                </div>
                
                {/* Footer Action Area */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '15px', paddingTop: '15px', borderTop: '1px solid var(--glass-border)' }}>
                  
                  <div>
                    <a 
                      href={assetUrl(app.resumeUrl?.replace('\\', '/'))}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}
                    >
                      <MdSchool size={18} /> View Attached Resume
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                      onClick={() => setSelected(app.applicant)} 
                      className="btn btn-outline" 
                      style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                    >
                      View Full Profile
                    </button>
                    <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                      Status: <strong style={{ 
                        color: app.status === 'Accepted' ? 'var(--success)' : app.status === 'Rejected' ? 'var(--danger)' : 'var(--warning)' 
                      }}>{app.status}</strong>
                    </div>

                    {app.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleUpdateStatus(app._id, 'Accepted')} className="btn" style={{ padding: '8px 20px', background: 'var(--success)', color: 'white', border: 'none' }}>Accept</button>
                        <button onClick={() => handleUpdateStatus(app._id, 'Rejected')} className="btn" style={{ padding: '8px 20px', background: 'var(--danger)', color: 'white', border: 'none' }}>Reject</button>
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            )
            })}
          </div>
        )}

      </div>
      {selected && <ProfileModal user={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default JobApplicants;

const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }} onClick={onClose}>
      <div style={{ width: 'min(900px, 90vw)', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--glass-border)', padding: '30px', boxShadow: '0 24px 48px rgba(0,0,0,0.25)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <div style={{ width: '88px', height: '88px', borderRadius: '14px', overflow: 'hidden', background: 'var(--card-bg)', display: 'grid', placeItems: 'center', fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {user.avatar ? (
                <img src={assetUrl(user.avatar)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.name?.charAt(0) || 'U'
              )}
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{user.name}</h2>
              <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>{user.email}</p>
              <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>{user.location || 'Location N/A'}</p>
            </div>
          </div>
          <button className="btn btn-outline" onClick={onClose} style={{ padding: '8px 12px' }}>Close</button>
        </div>

        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <Info label="Phone" value={user.phone} />
          <Info label="Experience" value={user.experience} />
          <Info label="Education" value={user.education} />
          <Info label="Institute" value={user.institute} />
          <Info label="Gender" value={user.gender} />
          <Info label="DOB" value={user.dob} />
          <Info label="Certifications" value={user.certifications} />
          <Info label="Projects" value={user.projects} />
        </div>

        <div style={{ marginTop: '18px' }}>
          <h4>Bio</h4>
          <p style={{ color: 'var(--text-secondary)' }}>{user.bio || 'No bio provided.'}</p>
        </div>

        <div style={{ marginTop: '18px' }}>
          <h4>Skills</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {user.skills?.length
              ? user.skills.map((s, i) => <span key={i} className="badge-muted">{s}</span>)
              : <span style={{ color: 'var(--text-secondary)' }}>No skills listed.</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--card-bg)' }}>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</div>
    <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{value || 'N/A'}</div>
  </div>
);
