import './Footer.css';

import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { MdEmail, MdCall } from 'react-icons/md';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-left">
        <span>Copyright © 2026 Bhoja Adarsh</span>
        <span>Employment Portal • Built for fast hiring</span>
      </div>
      <div className="footer-right">
        <a href="https://www.linkedin.com/in/bhoja-adarsh-051013338/" target="_blank" rel="noreferrer" title="LinkedIn">
          <FaLinkedin size={18} />
        </a>
        <a href="https://github.com/Adarshboja" target="_blank" rel="noreferrer" title="GitHub">
          <FaGithub size={18} />
        </a>
        <a href="mailto:adarshboja70@gmail.com" title="Email">
          <MdEmail size={18} />
        </a>
        <a href="tel:+917013650721" title="Call">
          <MdCall size={18} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
