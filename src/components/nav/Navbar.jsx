import React from 'react';
import { NavLink } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import logo from "../../assets/logo/logo.png";
import { useAccount } from 'wagmi';
import { admin } from '../../helper/Helper';

const Navbar = () => {
  const { t, i18n } = useTranslation(); // Use translation hook
  const { address } = useAccount()
  
  // Change language function
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="navbar-modern sticky top-0 z-50 backdrop-blur-md px-4">
      <div className="navbar-container flex justify-between items-center h-[56px] lg:h-[80px] xl:h-[80px]">
        {/* Left side: Logo and Links (Board, Create Token) */}
        <div className="navbar-left flex items-center gap-5">
          <NavLink to="/" className="navbar-logo w-8 sm:w-[200px]">
            <h1><img src="https://photos.pinksale.finance/file/pinksale-logo-upload/1756109492996-0df3b8b4e8a5cdaa2a70aba07bbc4c3e.png" className="logo-image" alt="logo" /></h1>
          </NavLink>
          <div className="navbar-links flex space-x-6">
            <NavLink
              to="/"
              className="nav-link"
            >
              {t('board')}
            </NavLink>
            <NavLink
              to="/create-token"
              className="nav-link"
            >
              {t('createToken')} {/* Use translation key */}
            </NavLink>
            {address == admin && <NavLink
              to="/admin-panel"
              className="nav-link"
            >
              {t('Admin')} {/* Use translation key */}
            </NavLink>}
            <NavLink
              to="#"
              className="nav-link"
            >
              {t('KYC')} {/* Use translation key */}
            </NavLink>
          </div>
        </div>

        {/* Right side: ConnectButton and Language Selector */}
        <div className="navbar-right flex items-center gap-4">
          {/* Language Select */}
          {/* <select
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-4 py-2 rounded-md text-sm"
            defaultValue={i18n.language}
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select> */}

          <ConnectButton
            label={t('connect Wallet')}
            accountStatus="address"
            chainStatus="name"
            className="text-sm px-4 py-2 rounded-full focus:ring-2 focus:ring-offset-2"
          >
            {({ isConnected, isConnecting, openConnectModal, openAccountModal }) => {
              if (isConnected) {
                return (
                  <button
                    onClick={openAccountModal}
                    className="wallet-btn wallet-btn-connected group"
                  >
                    <div className="wallet-btn-content">
                      <div className="wallet-status-indicator connected"></div>
                      <span className="wallet-btn-text">
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
                      </span>
                      <div className="wallet-btn-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="wallet-btn-overlay"></div>
                  </button>
                );
              }

              return (
                <button
                  onClick={openConnectModal}
                  disabled={isConnecting}
                  className="wallet-btn wallet-btn-disconnected group"
                >
                  <div className="wallet-btn-content">
                    <div className="wallet-status-indicator disconnected"></div>
                    <span className="wallet-btn-text">
                      {isConnecting ? 'Connecting...' : t('connectWallet')}
                    </span>
                    <div className="wallet-btn-icon">
                      {isConnecting ? (
                        <div className="wallet-spinner"></div>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="wallet-btn-overlay"></div>
                </button>
              );
            }}
          </ConnectButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
