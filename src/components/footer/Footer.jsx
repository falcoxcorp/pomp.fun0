import React from 'react'

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img 
                  src="https://photos.pinksale.finance/file/pinksale-logo-upload/1756109492996-0df3b8b4e8a5cdaa2a70aba07bbc4c3e.png" 
                  alt="FalcoX Logo" 
                  className="footer-logo-img"
                />
                <h3 className="footer-brand-name">FalcoX</h3>
              </div>
              <p className="footer-description">
                The future of meme tokens. Where your vision becomes reality through innovative blockchain technology and community-driven success.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="#" className="social-link" aria-label="Telegram">
                  <i className="fa fa-telegram"></i>
                </a>
                <a href="#" className="social-link" aria-label="Discord">
                  <i className="fa fa-discord"></i>
                </a>
                <a href="#" className="social-link" aria-label="GitHub">
                  <i className="fa fa-github"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-title">Platform</h4>
              <ul className="footer-links">
                <li><a href="/">Explore Tokens</a></li>
                <li><a href="/create-token">Create Token</a></li>
                <li><a href="#">Trading</a></li>
                <li><a href="#">Analytics</a></li>
                <li><a href="#">Leaderboard</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-section">
              <h4 className="footer-title">Resources</h4>
              <ul className="footer-links">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Tutorials</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Help Center</a></li>
              </ul>
            </div>

            {/* Community */}
            <div className="footer-section">
              <h4 className="footer-title">Community</h4>
              <ul className="footer-links">
                <li><a href="#">Discord Server</a></li>
                <li><a href="#">Telegram Group</a></li>
                <li><a href="#">Twitter Updates</a></li>
                <li><a href="#">Reddit</a></li>
                <li><a href="#">Newsletter</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-section">
              <h4 className="footer-title">Legal</h4>
              <ul className="footer-links">
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Disclaimer</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2025 FalcoX.com. All rights reserved.</p>
            </div>
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Tokens</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$50M+</span>
                <span className="stat-label">Volume</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">25K+</span>
                <span className="stat-label">Users</span>
              </div>
            </div>
            <div className="footer-badges">
              <div className="security-badge">
                <i className="fa fa-shield"></i>
                <span>Secure</span>
              </div>
              <div className="verified-badge">
                <i className="fa fa-check-circle"></i>
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="footer-decoration">
        <div className="decoration-circle decoration-1"></div>
        <div className="decoration-circle decoration-2"></div>
        <div className="decoration-circle decoration-3"></div>
      </div>
    </footer>
  )
}

export default Footer