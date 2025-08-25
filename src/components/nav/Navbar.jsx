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
    <header className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-md px-4">
      <div className="flex justify-between items-center h-[56px] lg:h-[80px] xl:h-[80px]">
        {/* Left side: Logo and Links (Board, Create Token) */}
        <div className="flex items-center gap-5">
          <NavLink to="/" className="w-8 sm:w-[200px]">
            <h1>  <img src="./logo/logo.png" className="logo" alt="logo" /></h1>
          </NavLink>
          <div className="flex space-x-6">
            <NavLink
              to="/"
              className="text-sm  hover:text-gold font-semibold font-bold text-gold"
            >
              {t('board')}
            </NavLink>
            <NavLink
              to="/create-token"
              className="text-sm  hover:text-gold font-semibold font-bold text-gold"

            >
              {t('createToken')} {/* Use translation key */}
            </NavLink>
            {address == admin && <NavLink
              to="/admin-panel"
              className="text-sm  hover:text-gold font-semibold font-bold text-gold"

            >
              {t('Admin')} {/* Use translation key */}
            </NavLink>}
            <NavLink
              to="#"
              className="text-sm  hover:text-gold font-semibold font-bold text-gold"

            >
              {t('KYC')} {/* Use translation key */}
            </NavLink>
          </div>
        </div>

        {/* Right side: ConnectButton and Language Selector */}
        <div className="connectbuttons flex items-center gap-4">
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
            label={t('connect Wallet')} // Use translation key for button
            accountStatus="address"
            chainStatus="name"
            className="text-sm px-4 py-2 rounded-full focus:ring-2 focus:ring-offset-2"
          >
            {({ isConnected, isConnecting }) => {
              let bgColor = isConnected ? 'bg-green-500' : 'bg-blue-500';
              let hoverColor = isConnected ? 'hover:bg-green-600' : 'hover:bg-blue-600';
              let statusText = isConnected ? t('walletConnected') : t('connectWallet'); // Translate status text

              return (
                <button
                  className={`${bgColor} ${hoverColor} text-white rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500`}
                >
                  {isConnecting ? 'Connecting...' : statusText}
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
