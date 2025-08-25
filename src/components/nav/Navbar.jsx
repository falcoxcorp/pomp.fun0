import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import logo from "../../assets/logo/logo.png";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { admin } from '../../helper/Helper';

const Navbar = () => {
  const { t, i18n } = useTranslation(); // Use translation hook
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Change language function
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  // Handle wallet connection
  const handleWalletAction = () => {
    if (isConnected) {
      disconnect();
    } else {
      const injectedConnector = connectors.find(connector => connector.id === 'injected');
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      }
    }
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
          {/* Custom Wallet Button */}
          <button
            onClick={handleWalletAction}
            disabled={isConnecting}
            className={`custom-wallet-btn group relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
              isConnected
                ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50'
                : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-gray-900 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50'
            } ${isConnecting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}`}
          >
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <div className="relative flex items-center gap-3">
              {/* Status indicator */}
              <div className={`w-2.5 h-2.5 rounded-full ${
                isConnected 
                  ? 'bg-white animate-pulse' 
                  : 'bg-gray-800 opacity-70'
              }`}></div>
              
              {/* Button text */}
              <span className="font-bold">
                {isConnecting 
                  ? 'Connecting...' 
                  : isConnected 
                    ? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected')
                    : t('connectWallet')
                }
              </span>
              
              {/* Icon */}
              <div className="transition-transform group-hover:scale-110">
                {isConnecting ? (
                  <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                    isConnected ? 'border-white' : 'border-gray-800'
                  }`}></div>
                ) : isConnected ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
