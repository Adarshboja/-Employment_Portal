import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { motion } from 'framer-motion';
import { MdSearch, MdLocationOn } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: '', location: '', experience: '', salary: '', remote: '' });
  
  const { user, loading: authLoading, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Use a ref to hold the debounce timeout ID
  const debounceRef = useRef(null);

  // Fetch all jobs initially
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchJobs('', '');
    }
  }, [user, authLoading, navigate]);

  // Shared fetch function
  const fetchJobs = async (keyword, location) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/jobs?keyword=${keyword}&location=${location}`);
      setAllJobs(data);
      setJobs(applyFilters(data, filters));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data, currentFilters) => {
    return data.filter((job) => {
      const matchExperience = currentFilters.experience ? job.experience?.toLowerCase().includes(currentFilters.experience.toLowerCase()) : true;
      const matchRemote = currentFilters.remote
        ? currentFilters.remote === 'remote'
          ? /remote/i.test(job.location)
          : currentFilters.remote === 'onsite'
            ? !/remote/i.test(job.location)
            : true
        : true;
      const matchSalary = (() => {
        if (!currentFilters.salary) return true;
        const nums = job.salary?.match(/\\d+/g)?.map(Number) || [];
        const low = nums.length ? Math.min(...nums) : 0;
        if (currentFilters.salary === 'lt50') return low < 50000;
        if (currentFilters.salary === '50to100') return low >= 50000 && low <= 100000;
        if (currentFilters.salary === 'gt100') return low > 100000;
        return true;
      })();
      return matchExperience && matchRemote && matchSalary;
    });
  };

  // Real-time onChange handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    // Clear the previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set a new timeout to fetch data after 300ms of no typing
    debounceRef.current = setTimeout(() => {
      if (name === 'keyword' || name === 'location') {
        fetchJobs(updatedFilters.keyword, updatedFilters.location);
      } else {
        setJobs(applyFilters(allJobs, updatedFilters));
      }
    }, 300);
  };

  const toggleSave = async (jobId) => {
    try {
      const { data } = await axios.post(`/api/jobs/${jobId}/save`);
      const savedIds = data.savedJobs.map((j) => j._id || j);
      updateUser({ ...user, savedJobs: savedIds });
    } catch (error) {
      console.error('Error saving job', error);
    }
  };

  const hasFilters =
    filters.keyword || filters.location || filters.experience || filters.salary || filters.remote;

  const clearFilterKey = (key) => {
    const updated = { ...filters, [key]: '' };
    setFilters(updated);
    if (key === 'keyword' || key === 'location') {
      fetchJobs(updated.keyword, updated.location);
    } else {
      setJobs(applyFilters(allJobs, updated));
    }
  };

  const clearAllFilters = () => {
    const reset = { keyword: '', location: '', experience: '', salary: '', remote: '' };
    setFilters(reset);
    fetchJobs('', '');
  };

  return (
    <div className="page-container" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>
      
      <div className="container" style={{ paddingBottom: '60px' }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ marginBottom: '40px', marginTop: '20px' }}
        >
          <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', fontWeight: 800 }}>
            Find Your <span style={{ color: 'var(--accent-primary)' }}>Dream Job</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
            Discover thousands of job opportunities with all the information you need to make your next career move.
          </p>
        </motion.div>

        {/* Real-Time Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div className="pill-input" style={{ flex: '1.5', minWidth: '250px' }}>
            <MdSearch size={24} color="var(--accent-primary)" />
            <input 
              type="text" 
              name="keyword"
              placeholder="Job Title, Skills, or Company..." 
              style={{ flex: '1', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', fontSize: '1rem' }}
              value={filters.keyword}
              onChange={handleFilterChange}
            />
          </div>
          <div className="pill-input" style={{ flex: '1', minWidth: '200px' }}>
            <MdLocationOn size={24} color="var(--accent-primary)" />
            <input 
              type="text" 
              name="location"
              placeholder="City, State, or Remote..." 
              style={{ flex: '1', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', fontSize: '1rem' }}
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '40px' }}
        >
          <select name="experience" value={filters.experience} onChange={handleFilterChange} className="pill-select">
            <option value="">Experience Level</option>
            <option value="Intern">Intern / Fresher</option>
            <option value="Junior">Junior / 1-2 yrs</option>
            <option value="Mid">Mid / 3-5 yrs</option>
            <option value="Senior">Senior / 6-10 yrs</option>
            <option value="Lead">Lead / 10+ yrs</option>
          </select>

          <select name="salary" value={filters.salary} onChange={handleFilterChange} className="pill-select">
            <option value="">Salary Range</option>
            <option value="lt50">Below 50k</option>
            <option value="50to100">50k - 100k</option>
            <option value="gt100">Above 100k</option>
          </select>

          <select name="remote" value={filters.remote} onChange={handleFilterChange} className="pill-select">
            <option value="">Remote / Onsite</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
          </select>
        </motion.div>

        {hasFilters && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px', alignItems: 'center' }}>
            {filters.keyword && (
              <button className="chip-active" onClick={() => clearFilterKey('keyword')}>
                Keyword: {filters.keyword} ✕
              </button>
            )}
            {filters.location && (
              <button className="chip-active" onClick={() => clearFilterKey('location')}>
                Location: {filters.location} ✕
              </button>
            )}
            {filters.experience && (
              <button className="chip-active" onClick={() => clearFilterKey('experience')}>
                Experience: {filters.experience} ✕
              </button>
            )}
            {filters.salary && (
              <button className="chip-active" onClick={() => clearFilterKey('salary')}>
                Salary: {filters.salary} ✕
              </button>
            )}
            {filters.remote && (
              <button className="chip-active" onClick={() => clearFilterKey('remote')}>
                {filters.remote === 'remote' ? 'Remote' : 'Onsite'} ✕
              </button>
            )}
            <button className="chip-clear" onClick={clearAllFilters}>Clear all</button>
          </div>
        )}

        {/* Job Listings grids */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Latest Opportunities</h2>
          <span style={{ color: 'var(--text-secondary)' }}>{jobs.length} Jobs Found</span>
        </div>

        {loading ? (
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' 
          }}>
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div key={sk} className="job-card skeleton" style={{ height: '280px' }}></div>
            ))}
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
                isSaved={user?.savedJobs?.some((id) => (id._id || id) === job._id)}
                onSaveToggle={() => toggleSave(job._id)}
              />
            ))}
            {jobs.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--glass-border)' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '10px' }}>No jobs found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
