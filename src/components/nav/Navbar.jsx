import React from 'react';
import { NavLink } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl backdrop-blur-md border-b border-gold/20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px] lg:h-[90px]">
        {/* Left side: Logo and Links (Board, Create Token) */}
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center group">
            <div className="relative">
              <img 
                src="https://photos.pinksale.finance/file/pinksale-logo-upload/1756109492996-0df3b8b4e8a5cdaa2a70aba07bbc4c3e.png" 
                className="h-12 w-12 lg:h-16 lg:w-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" 
                alt="FalcoX Logo" 
              />
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent hidden sm:block">
              FalcoX
            </span>
          </NavLink>
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `relative px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'text-gold' 
                    : 'text-gray-300 hover:text-gold'
                } group`
              }
            >
              {t('board')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
            <NavLink
              to="/create-token"
              className={({ isActive }) => 
                `relative px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'text-gold' 
                    : 'text-gray-300 hover:text-gold'
                } group`
              }
            >
              {t('createToken')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
            {address == admin && (
              <NavLink
                to="/admin-panel"
                className={({ isActive }) => 
                  `relative px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'text-gold' 
                      : 'text-gray-300 hover:text-gold'
                  } group`
                }
              >
                {t('Admin')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            )}
            <NavLink
              to="#"
              className={({ isActive }) => 
                `relative px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'text-gold' 
                    : 'text-gray-300 hover:text-gold'
                } group`
              }
            >
              {t('KYC')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
          </nav>
        </div>

        {/* Right side: ConnectButton and Language Selector */}
        <div className="flex items-center gap-6">
          {/* Mobile menu button */}
          <button className="lg:hidden text-gray-300 hover:text-gold transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Connect Button with custom styling */}
          <div className="connectbuttons">
            <ConnectButton
              label={t('connect Wallet')}
              accountStatus="address"
              chainStatus="name"
              className="connect-wallet-btn"
            />
          </div>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
        </div>
      </div>
    </header>
  );
};

export default Navbar;
