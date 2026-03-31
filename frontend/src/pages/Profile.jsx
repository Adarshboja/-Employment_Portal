import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', experience: '', skills: '', bio: '', company: '',
    education: '', institute: '', location: '', gender: '', dob: '', certifications: '', projects: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        experience: user.experience || '',
        skills: user.skills ? user.skills.join(', ') : '',
        bio: user.bio || '',
        company: user.company || '',
        education: user.education || '',
        institute: user.institute || '',
        location: user.location || '',
        gender: user.gender || '',
        dob: user.dob || '',
        certifications: user.certifications || '',
        projects: user.projects || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          if (key === 'skills' && user.role === 'Seeker') {
            payload.append('skills', formData.skills);
          } else {
            payload.append(key, formData[key]);
          }
        }
      });
      
      if (avatarFile) {
        payload.append('avatar', avatarFile);
      }
      
      const { data } = await axios.put('/api/auth/profile', payload);
      
      // Seamlessly update global context without refreshing page
      updateUser(data);
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  if (!user) return null;

  // Calculate Profile Completion dynamically based on formData
  const fieldsToCheck = [
    formData.name, formData.email, formData.phone,
    formData.education, formData.institute, formData.location,
    formData.gender, formData.dob, formData.experience,
    formData.skills, formData.certifications, formData.projects
  ];
  const filledFields = fieldsToCheck.filter(f => f && f.trim() !== '').length;
  const completionPercentage = Math.round((filledFields / 12) * 100);

  const strokeDasharray = 283;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * completionPercentage) / 100;

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '30px' }}>Manage <span className="text-gradient">Profile</span></h1>

        {user.role === 'Seeker' && (
          <motion.div 
            className="glass-panel" 
            style={{ padding: '30px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '30px', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
          >
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg width="120" height="120" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle 
                  cx="60" cy="60" r="54" fill="none" stroke="var(--success)" 
                  strokeWidth="8" strokeDasharray={strokeDasharray} 
                  strokeDashoffset={strokeDashoffset} strokeLinecap="round" 
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.25, 0.8, 0.25, 1)' }} 
                />
              </svg>
              
              <label htmlFor="avatar-upload" style={{ cursor: 'pointer', zIndex: 10 }}>
                <div style={{ width: '92px', height: '92px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: 'white', position: 'relative' }}>
                   {avatarPreview || user.avatar ? (
                     <img src={avatarPreview || `http://localhost:5000/${user.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   ) : (
                     <>{user.name?.charAt(0).toUpperCase() || 'U'}</>
                   )}
                   <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '30px', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7rem' }}>
                     Edit
                   </div>
                </div>
              </label>
              <input type="file" id="avatar-upload" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />
              
            </div>
            <div>
               <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Profile Strength: <span style={{ color: 'var(--success)' }}>{completionPercentage}%</span></h2>
               <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.5' }}>
                 {completionPercentage === 100 ? 
                   "Incredible! Your profile is fully complete. You stand out perfectly to recruiters." : 
                   "A complete profile increases your chances of getting hired by 80%. Fill out the remaining details below!"}
               </p>
            </div>
          </motion.div>
        )}

        <motion.div className="glass-panel" style={{ padding: '40px' }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input type="text" name="phone" className="input-field" value={formData.phone} onChange={handleChange} placeholder="e.g. +1 555-1234" />
            </div>

            {user.role === 'Recruiter' && (
              <div className="input-group">
                <label className="input-label">Company Name</label>
                <input type="text" name="company" className="input-field" value={formData.company} onChange={handleChange} />
              </div>
            )}

            {user.role === 'Seeker' && (
              <>
                <div className="input-group">
                  <label className="input-label">Education / Degree</label>
                  <input type="text" name="education" className="input-field" value={formData.education} onChange={handleChange} placeholder="e.g. B.Tech/B.E." />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Institute / University</label>
                  <input type="text" name="institute" className="input-field" value={formData.institute} onChange={handleChange} placeholder="e.g. Neil Gogte Institute of Technology" />
                </div>

                <div className="input-group">
                  <label className="input-label">Location</label>
                  <input type="text" name="location" className="input-field" value={formData.location} onChange={handleChange} placeholder="e.g. India" />
                </div>

                <div className="input-group">
                  <label className="input-label">Gender</label>
                  <select name="gender" className="input-field" value={formData.gender} onChange={handleChange} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Date of Birth</label>
                  <input type="date" name="dob" className="input-field" value={formData.dob} onChange={handleChange} />
                </div>

                <div className="input-group">
                  <label className="input-label">Years of Experience</label>
                  <input type="text" name="experience" className="input-field" value={formData.experience} onChange={handleChange} placeholder="e.g. 5 Years" />
                </div>
                
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Skills (comma separated)</label>
                  <input type="text" name="skills" className="input-field" value={formData.skills} onChange={handleChange} />
                </div>

                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Certifications</label>
                  <input type="text" name="certifications" className="input-field" value={formData.certifications} onChange={handleChange} placeholder="e.g. AWS Certified, PMP" />
                </div>

                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Projects Summary</label>
                  <textarea name="projects" className="input-field" rows="3" value={formData.projects} onChange={handleChange} placeholder="Describe briefly the projects you've worked on..."></textarea>
                </div>
              </>
            )}

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Short Bio</label>
              <textarea name="bio" className="input-field" rows="4" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..."></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', maxWidth: '200px' }} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
