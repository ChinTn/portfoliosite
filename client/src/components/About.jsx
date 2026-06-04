import React from 'react';
import img from '../assets/img.jpg';

const About = () => {
  return (
    <section id="about" className="section">
        <h1 className="section-title">ABOUT ME</h1>

        <div className="container">
            <div className="left-container">
                <p style={{letterSpacing: "0.5px", color: "rgba(244, 232, 218, 0.768)", fontSize: "16px", lineHeight: "1.6"}}>
                    I’m a third-year BTech student at IIT Jodhpur with a deep passion for problem-solving and software development. I thrive on building things from scratch and understanding how systems work under the hood. While I've explored creative fields like cinematography and graphic design—which honed my eye for visual detail—my true focus is writing clean, solid code. <br/><br/>
                    Currently, I'm focused on mastering full-stack development, contributing to open source, and strengthening my fundamentals. When I'm not coding, you can find me resetting by playing football or strumming my guitar. I'm always learning and building—one repo at a time.
                </p>
                <div className="skills">
                    <h3>Skills</h3>
                    <div className="skill-tags">
                        <span className="skill-tag">C</span>
                        <span className="skill-tag">C++</span>
                        <span className="skill-tag">HTML</span>
                        <span className="skill-tag">CSS</span>
                        <span className="skill-tag">Javascript</span>
                        <span className="skill-tag">React</span>
                        <span className="skill-tag">Node.js</span>
                        <span className="skill-tag">Express.js</span>
                        <span className="skill-tag">MongoDB</span>
                        <span className="skill-tag">Postman</span>
                        <span className="skill-tag">Tailwind</span>
                        <span className="skill-tag">Python</span>
                        <span className="skill-tag">Numpy</span>
                        <span className="skill-tag">Pandas</span>
                        <span className="skill-tag">NETWORKX</span>
                        <span className="skill-tag">GIT</span>
                        <span className="skill-tag">GIT HUB</span>
                    </div>
                </div>
            </div>
            <div className="right-container">
                <img src={img} alt="About Me" />
            </div>
        </div>
    </section>
  );
};

export default About;
