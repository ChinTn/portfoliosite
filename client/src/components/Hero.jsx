import React from 'react';
import img from '../assets/img.jpg';

const Hero = () => {
  return (
    <section className="hero" id="home">
        <div className="hero-left">
            <img src={img} alt="Chintan" />
        </div>

        <div className="hero-right">
            <p className="hero-greeting">Hi I am Chintan</p>
            <h1 className="hero-title">ChinTn</h1>
            <p className="hero-desc">
                dev_lox /ˈtʃɪn.t̪ən/.<br />19M • IIT Jodhpur.
                Obsessed with logic, edge cases, and how things work.<br />
                Currently in Development Have explored Data Science & Open Source.<br />Not
                tied to a single domain.<br />Learning by building, breaking, and
                fixing.<br />
                Coding my way out of chaos • one repo at a time.
            </p>
            <div className="buttons">
                <a href="#">Download CV</a>
                <a href="#contact">Contact</a>
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
            
            <div className="social-links" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '-13px' }}>
                <a href="https://music.apple.com/profile/ChinTn" target="_blank" rel="noreferrer" title="Apple Music">
                    <i className="fab fa-apple"></i>
                </a>
                <span style={{ fontSize: '16px', color: 'rgba(244, 232, 218, 0.768)', fontStyle: 'italic', letterSpacing: '1px' }}>
                  ~we might share the same Vibe
                </span>
            </div>
        </div>
    </section>
  );
};

export default Hero;
