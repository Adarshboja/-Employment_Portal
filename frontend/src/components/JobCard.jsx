import { motion } from 'framer-motion';
import { MdLocationOn, MdWorkOutline, MdAttachMoney, MdBookmarkBorder, MdBookmark } from 'react-icons/md';
import { Link } from 'react-router-dom';
import styles from './JobCard.module.css';

const JobCard = ({ job, index, isSaved, onSaveToggle }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, delay: index * 0.1 } 
    }
  };

  const isNew = (() => {
    if (!job.createdAt) return false;
    const created = new Date(job.createdAt);
    const diff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  })();

  return (
    <motion.div 
      className={`glass-panel ${styles.card} job-card`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, scale: 1.01 }}
    >
      <div className={styles.header}>
        <div className={styles.companyInfo}>
          <div className={styles.logoPlaceholder}>
            {job.company.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className={styles.title}>{job.title}</h3>
            <p className={styles.companyName}>{job.company}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isNew && <span className="badge-green">New</span>}
          <span className="badge-green">
            {job.salary}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSaveToggle && onSaveToggle();
            }} 
            type="button"
            className={styles.bookmarkButton}
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
            title={isSaved ? 'Saved' : 'Save job'}
          >
            {isSaved ? <MdBookmark size={22} /> : <MdBookmarkBorder size={22} />}
          </button>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <MdLocationOn className={styles.icon} />
          <span>{job.location}</span>
        </div>
        <div className={styles.detailItem}>
          <MdWorkOutline className={styles.icon} />
          <span>{job.experience}</span>
        </div>
      </div>

      <div className={styles.skills}>
        {job.skills.slice(0, 3).map((skill, i) => (
          <span key={i} className="badge-muted">{skill}</span>
        ))}
        {job.skills.length > 3 && (
          <span className="badge-muted">+{job.skills.length - 3}</span>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.timePosted}>
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/job/${job._id}`} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem', borderRadius: '8px' }}>
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;
