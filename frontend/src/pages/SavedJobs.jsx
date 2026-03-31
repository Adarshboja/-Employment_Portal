import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { AuthContext } from '../context/AuthContext';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/jobs/saved/me');
        setJobs(data);
      } catch (error) {
        console.error('Failed to load saved jobs', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

const API = import.meta.env.VITE_API_URL;

const toggleSave = async (jobId) => {
  try {
    const { data } = await axios.post(`${API}/api/jobs/${jobId}/save`);

    setJobs(data.savedJobs);

    const updated = {
      ...user,
      savedJobs: data.savedJobs.map((j) => j._id || j)
    };

    updateUser(updated);
  } catch (error) {
    console.error('Error toggling save', error);
  }
};

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ marginBottom: '20px' }}>Saved Jobs</h1>
        {jobs.length === 0 ? (
          <div className="glass-panel" style={{ padding: '32px' }}>
            You haven't saved any jobs yet.
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            {jobs.map((job, index) => (
              <JobCard
                key={job._id}
                job={job}
                index={index}
                isSaved
                onSaveToggle={() => toggleSave(job._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
