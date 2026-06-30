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
    <section id="contact" className="py-24 px-6 min-h-screen border-t border-border-main flex items-center">
      <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row md:items-start gap-16">
        
        {/* Left Side: Contact Info */}
        <div className="w-full md:w-5/12">
          <h2 className="text-3xl font-bold text-text-main mb-10 uppercase tracking-widest border-l-4 border-highlight pl-4">Contact Me</h2>
          
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 text-text-dim group">
              <div className="w-12 h-12 rounded-full bg-card-bg border border-border-dim flex items-center justify-center text-xl group-hover:bg-highlight group-hover:text-text-main group-hover:border-highlight transition-all duration-300">
                <i className="fas fa-envelope"></i>
              </div>
              <span className="text-lg group-hover:text-text-main transition-colors">vaghamshichintan9@gmail.com</span>
            </div>

            <div className="flex items-center gap-4 text-text-dim group">
              <div className="w-12 h-12 rounded-full bg-card-bg border border-border-dim flex items-center justify-center text-xl group-hover:bg-highlight group-hover:text-text-main group-hover:border-highlight transition-all duration-300">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <span className="text-lg group-hover:text-text-main transition-colors">Surat-Gujarat</span>
            </div>

            <div className="flex items-center gap-4 text-text-dim group">
              <div className="w-12 h-12 rounded-full bg-card-bg border border-border-dim flex items-center justify-center text-xl group-hover:bg-highlight group-hover:text-text-main group-hover:border-highlight transition-all duration-300">
                <i className="fas fa-clock"></i>
              </div>
              <span className="text-lg group-hover:text-text-main transition-colors">Available: 24 x 7</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-12">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-widest mb-6">Connect on Socials</h3>
            <div className="flex flex-wrap gap-4 text-2xl text-text-dim">
              <a href="https://www.linkedin.com/in/chintan-vaghamshi-6578262aa/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-card-bg border border-border-dim flex items-center justify-center hover:bg-[#0077b5] hover:text-text-main hover:border-[#0077b5] hover:scale-110 transition-all duration-300"><i className="fab fa-linkedin"></i></a>
              <a href="https://github.com/ChinTn" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-card-bg border border-border-dim flex items-center justify-center hover:bg-text-main hover:text-bg-dark hover:border-text-main hover:scale-110 transition-all duration-300"><i className="fab fa-github"></i></a>
              <a href="https://www.instagram.com/chintan_v_011/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-card-bg border border-border-dim flex items-center justify-center hover:bg-[#e4405f] hover:text-text-main hover:border-[#e4405f] hover:scale-110 transition-all duration-300"><i className="fab fa-instagram"></i></a>
              <a href="https://x.com/ChinTn_011" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-card-bg border border-border-dim flex items-center justify-center hover:bg-[#1da1f2] hover:text-text-main hover:border-[#1da1f2] hover:scale-110 transition-all duration-300"><i className="fab fa-twitter"></i></a>
              <a href="https://discord.com/users/769396189572628500" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-card-bg border border-border-dim flex items-center justify-center hover:bg-[#5865F2] hover:text-text-main hover:border-[#5865F2] hover:scale-110 transition-all duration-300"><i className="fab fa-discord"></i></a>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="w-full md:w-7/12 md:-mt-8">
          <div className="w-full relative">
            <h3 className="text-2xl font-bold text-text-main mb-8 tracking-wide">Send a Message</h3>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    className="w-full bg-transparent border-b-2 border-border-dim px-2 py-3 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight transition-all"
                  />
                </div>
                <div className="w-full">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Your Email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    className="w-full bg-transparent border-b-2 border-border-dim px-2 py-3 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight transition-all"
                  />
                </div>
              </div>
              
              <input 
                type="text" 
                name="subject" 
                placeholder="Subject" 
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b-2 border-border-dim px-2 py-3 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight transition-all"
              />
              
              <textarea 
                rows="5" 
                name="message" 
                placeholder="Your Message" 
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b-2 border-border-dim px-2 py-3 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight transition-all resize-none"
              ></textarea>
              
              <button 
                type="submit" 
                disabled={status === 'sending'} 
                className={`mt-2 w-full py-4 font-bold text-text-main tracking-widest uppercase transition-all ${status === 'sending' ? 'bg-highlight/50 cursor-not-allowed' : 'bg-highlight hover:bg-highlight/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'}`}
              >
                {status === 'sending' ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i> Sending...
                  </span>
                ) : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="mt-4 p-4 border border-green-500/20 bg-green-500/10 text-green-400 text-center font-medium">
                  ✅ Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="mt-4 p-4 border border-red-500/20 bg-red-500/10 text-red-400 text-center font-medium">
                  ❌ {errorMsg}
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
