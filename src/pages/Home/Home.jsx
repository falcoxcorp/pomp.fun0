import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CardList from '../../components/CardList/CardList';
import { tags } from '../../helper/Helper';

const Home = () => {

  const [activeTable, setActiveTable] = useState('all');
  const { t, i18n } = useTranslation();

  const handleButtonClick = (table) => {
    setActiveTable(table);
  };

  return (
    <>
      {/* Hero Section */}
      <section className='hero-section relative overflow-hidden'>
        <div className='hero-bg absolute inset-0'></div>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex flex-col lg:flex-row items-center min-h-[80vh] py-20'>
            <div className='lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0'>
              <div className='hero-badge inline-flex items-center px-4 py-2 rounded-full mb-6'>
                <span className='badge-dot w-2 h-2 rounded-full mr-2'></span>
                <span className='text-sm font-medium'>The Future of Meme Tokens</span>
              </div>
              <h1 className='hero-title text-5xl lg:text-7xl font-bold mb-6 leading-tight'>
                Discover the power of <br/>
                <span className='gradient-text'>FalcoX</span>
              </h1>
              <h2 className='hero-subtitle text-2xl lg:text-3xl font-semibold mb-8 text-gray-300'>
                like never before
              </h2>
              <p className='hero-description text-lg mb-6 text-gray-400 max-w-2xl'>
                At Falcox we connect marketing and market making with results that transform projects into
                success stories. We design precise solutions that generate natural attraction for investors.
              </p>
              <p className='hero-description text-lg mb-10 text-gray-400 max-w-2xl'>
                Trust the experience that makes the difference. Falcox, where your vision becomes reality.
              </p>
              <div className='hero-buttons flex flex-col sm:flex-row gap-4'>
                <Link
                  to="/create-token"
                  className="hero-btn-primary inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  <span className='mr-2'>🚀</span>
                  {t('createToken')}
                </Link>
                <button className="hero-btn-secondary inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
                  <span className='mr-2'>📊</span>
                  Explore Tokens
                </button>
              </div>
            </div>
            <div className='lg:w-1/2 flex justify-center lg:justify-end'>
              <div className='hero-image-container relative'>
                <div className='floating-elements absolute inset-0'>
                  <div className='floating-card floating-card-1'></div>
                  <div className='floating-card floating-card-2'></div>
                  <div className='floating-card floating-card-3'></div>
                </div>
                <img src="./images/sliderimages.png" className="hero-image relative z-10" alt="FalcoX Hero" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='stats-section py-20'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='stat-card text-center'>
              <div className='stat-number text-4xl font-bold mb-2 gradient-text'>1000+</div>
              <div className='stat-label text-gray-400'>Tokens Created</div>
            </div>
            <div className='stat-card text-center'>
              <div className='stat-number text-4xl font-bold mb-2 gradient-text'>$50M+</div>
              <div className='stat-label text-gray-400'>Total Volume</div>
            </div>
            <div className='stat-card text-center'>
              <div className='stat-number text-4xl font-bold mb-2 gradient-text'>25K+</div>
              <div className='stat-label text-gray-400'>Active Users</div>
            </div>
            <div className='stat-card text-center'>
              <div className='stat-number text-4xl font-bold mb-2 gradient-text'>99.9%</div>
              <div className='stat-label text-gray-400'>Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content py-20">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-16">
            <h2 className="section-title text-4xl lg:text-5xl font-bold mb-6">
              Explore <span className="gradient-text">Trending</span> Tokens
            </h2>
            <p className="section-description text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the hottest meme tokens and join the community-driven revolution in decentralized finance.
            </p>
          </div>

          <div className="filters-section mb-12">
            <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-6">
              <div className="filter-tabs flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`filter-tab px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeTable === 'all' ? 'filter-tab-active' : 'filter-tab-inactive'}`}
                  onClick={() => handleButtonClick('all')}
                >
                  <span className="mr-2">🔥</span>
                  {t('All')}
                </button>
                <button
                  type="button"
                  className={`filter-tab px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeTable === 'owner' ? 'filter-tab-active' : 'filter-tab-inactive'}`}
                  onClick={() => handleButtonClick('owner')}
                >
                  <span className="mr-2">👤</span>
                  {t('Your Contributions')}
                </button>
                {tags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`filter-tab px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeTable === `Tag ${tag}` ? 'filter-tab-active' : 'filter-tab-inactive'}`}
                    onClick={() => handleButtonClick(`Tag ${tag}`)}
                  >
                    <span className="mr-2">🏷️</span>
                    {t(tag)}
                  </button>
                ))}
              </div>
              <div className="create-token-section">
                <Link
                  to="/create-token"
                  className="create-token-btn inline-flex items-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  <span className="mr-2">✨</span>
                  {t('createToken')}
                </Link>
              </div>
            </div>
          </div>

          <div className="tokens-grid">
            <CardList activeTable={activeTable} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
