import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle', 'sending', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      await axios.post(`${API_URL}/api/contact`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('Failed to send message. Please try again later.');
      }
      setStatus('error');
    }
  };

  return (
    <section className="section" id="contact">
        <h2 className="contact-title">Contact Me</h2>

        <div className="contact-wrapper">
            <div className="contact-left">
                <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>vaghamshichintan9@gmail.com</span>
                </div>

                <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Surat-Gujarat</span>
                </div>

                <div className="contact-item">
                    <i className="fas fa-clock"></i>
                    <span>Available: 24 x 7</span>
                </div>

                <div className="social-links">
                <a href="https://www.linkedin.com/in/chintan-vaghamshi-6578262aa/" target="_blank" rel="noreferrer"><i
                        className="fab fa-linkedin"></i></a>
                <a href="https://github.com/ChinTn" target="_blank" rel="noreferrer">
                    <i className="fab fa-github"></i></a>
                <a href="https://www.instagram.com/chintan_v_011/" target="_blank" rel="noreferrer">
                    <i className="fab fa-instagram"></i></a>
                <a href="https://x.com/ChinTn_011" target="_blank" rel="noreferrer">
                    <i className="fab fa-twitter"></i></a>
                <a href="https://discord.com/users/769396189572628500" target="_blank" rel="noreferrer">
                    <i className="fab fa-discord"></i>
                </a>
            </div>
            </div>

            <div className="contact-right">
                <form className="contact-form" onSubmit={handleSubmit}>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Your Name" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Your Email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                    <input 
                      type="text" 
                      name="subject" 
                      placeholder="Subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                    <textarea 
                      rows="5" 
                      name="message" 
                      placeholder="Your Message" 
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                    
                    <button type="submit" disabled={status === 'sending'} style={{opacity: status === 'sending' ? 0.7 : 1}}>
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>

                    {status === 'success' && (
                      <p style={{ color: '#4caf50', marginTop: '15px', textAlign: 'center', fontSize: '15px' }}>
                        ✅ Message sent successfully! I'll get back to you soon.
                      </p>
                    )}
                    {status === 'error' && (
                      <p style={{ color: '#f44336', marginTop: '15px', textAlign: 'center', fontSize: '15px' }}>
                        ❌ {errorMsg}
                      </p>
                    )}
                </form>
            </div>
        </div>
    </section>
  );
};

export default Contact;
