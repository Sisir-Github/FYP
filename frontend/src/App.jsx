import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="nav">
        <div className="logo">
          <h2 style={{ color: 'white', margin: 0 }}>EVEREST TREAK</h2>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#treks">Treks</a>
          <a href="#contact">Contact</a>
        </div>
        <button className="btn-primary">Book Now</button>
      </nav>

      <header id="home" className="hero">
        <div className="hero-content">
          <h1>Conquer the Heights</h1>
          <p>Experience the majesty of the Himalayas with Everest Treak. Your journey to the roof of the world starts here.</p>
          <button className="btn-primary">Start Your Adventure</button>
        </div>
      </header>

      <section id="about" className="section">
        <h2>Why Journey With Us?</h2>
        <p style={{ maxWidth: '800px', margin: '1rem auto', color: '#718096' }}>
          We provide expert-led expeditions, premium equipment, and unparalleled local knowledge to ensure your trek is safe, sustainable, and unforgettable.
        </p>
      </section>

      <section id="treks" className="section" style={{ backgroundColor: '#edf2f7' }}>
        <h2>Featured Treks</h2>
        <div className="treks-grid">
          <div className="trek-card">
            <div className="trek-image" style={{ background: 'linear-gradient(45deg, #2c5282, #1a365d)' }}></div>
            <div className="trek-info">
              <h3>Everest Base Camp</h3>
              <p>14 Days • Moderate High • $1,450</p>
            </div>
          </div>
          <div className="trek-card">
            <div className="trek-image" style={{ background: 'linear-gradient(45deg, #2b6cb0, #2c5282)' }}></div>
            <div className="trek-info">
              <h3>Annapurna Circuit</h3>
              <p>18 Days • Challenging • $1,200</p>
            </div>
          </div>
          <div className="trek-card">
            <div className="trek-image" style={{ background: 'linear-gradient(45deg, #3182ce, #2b6cb0)' }}></div>
            <div className="trek-info">
              <h3>Island Peak Climbing</h3>
              <p>20 Days • Difficult • $2,800</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="section" style={{ padding: '2rem 10%', backgroundColor: '#1a365d', color: 'white' }}>
        <p>&copy; 2026 Everest Treak expeditions. Set your spirit free.</p>
      </footer>
    </div>
  );
}

export default App;
