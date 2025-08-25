import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CardList from '../../components/CardList/CardList';
import { tags } from '../../helper/Helper';
import { useEffect } from 'react';



const Home = () => {

  const [activeTable, setActiveTable] = useState('all');
  const { t, i18n } = useTranslation();
  const [counters, setCounters] = useState({
    projects: 0,
    volume: 0,
    investors: 0,
    success: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  const handleButtonClick = (table) => {
    setActiveTable(table);
  };

  // Animated counter effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    const targets = { projects: 150, volume: 2500000, investors: 5000, success: 95 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCounters({
        projects: Math.floor(targets.projects * easeOutQuart),
        volume: Math.floor(targets.volume * easeOutQuart),
        investors: Math.floor(targets.investors * easeOutQuart),
        success: Math.floor(targets.success * easeOutQuart)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, stepDuration);
  };

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      
      parallaxElements.forEach((element) => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <section className='hero-section'>
        <div className='parallax-bg' data-speed="0.3"></div>
        <div className='hero-overlay'></div>
        <div className='floating-elements'>
          <div className='floating-icon floating-icon-1'>💎</div>
          <div className='floating-icon floating-icon-2'>📈</div>
          <div className='floating-icon floating-icon-3'>🚀</div>
          <div className='floating-icon floating-icon-4'>💰</div>
        </div>
        <div className='container hero-content'>
          <div className='hero-text'>
            <div className='hero-badge'>
              <span className='badge-text'>🔥 #1 Investment Platform</span>
            </div>
            <h1 className='hero-title'>
              <span className='title-line-1'>Transform Your</span>
              <span className='title-line-2 gradient-text'>Investment Vision</span>
              <span className='title-line-3'>Into Reality</span>
            </h1>
            <p className='hero-description'>
              Join thousands of successful investors who trust FalcoX to maximize their portfolio returns. 
              Our cutting-edge platform combines advanced analytics with proven strategies to deliver 
              exceptional results in the evolving digital asset landscape.
            </p>
            <div className='hero-cta'>
              <Link to="/create-token" className='cta-primary'>
                <span>Start Investing</span>
                <svg className='cta-arrow' viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <button className='cta-secondary'>
                <span>Watch Demo</span>
                <svg className='play-icon' viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <div className='hero-visual'>
            <div className='dashboard-mockup'>
              <div className='mockup-header'>
                <div className='mockup-dots'>
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div className='mockup-content'>
                <div className='chart-container'>
                  <div className='chart-line'></div>
                  <div className='chart-bars'>
                    <div className='bar' style={{height: '60%'}}></div>
                    <div className='bar' style={{height: '80%'}}></div>
                    <div className='bar' style={{height: '45%'}}></div>
                    <div className='bar' style={{height: '90%'}}></div>
                    <div className='bar' style={{height: '70%'}}></div>
                  </div>
                </div>
                <div className='stats-mini'>
                  <div className='stat-item'>
                    <span className='stat-value'>+24.5%</span>
                    <span className='stat-label'>ROI</span>
                  </div>
                  <div className='stat-item'>
                    <span className='stat-value'>$2.4M</span>
                    <span className='stat-label'>Volume</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='stats-section'>
        <div className='container'>
          <div className='stats-grid'>
            <div className='stat-card'>
              <div className='stat-icon'>🏆</div>
              <div className='stat-number'>{counters.projects.toLocaleString()}+</div>
              <div className='stat-label'>Successful Projects</div>
            </div>
            <div className='stat-card'>
              <div className='stat-icon'>💎</div>
              <div className='stat-number'>${counters.volume.toLocaleString()}K</div>
              <div className='stat-label'>Total Volume</div>
            </div>
            <div className='stat-card'>
              <div className='stat-icon'>👥</div>
              <div className='stat-number'>{counters.investors.toLocaleString()}+</div>
              <div className='stat-label'>Active Investors</div>
            </div>
            <div className='stat-card'>
              <div className='stat-icon'>📈</div>
              <div className='stat-number'>{counters.success}%</div>
              <div className='stat-label'>Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <main className="pl-5 pr-5 top-0 overflow-hidden">
        <div className="flex flex-col pb-4 pt-[75px] xl:pt-[50px]">

          <div className="absolute top-0 left-0 z-0 w-90 h-[60vw] sm:h-[43vw] md:h-[33vw] "></div>

          <div className="relative flex flex-col gap-4 lg:gap-6 mb-8 lg:mb-10 fade-in-up">
            <div className="flex flex-col lg:flex-row lg:justify-between">

              <div className="filter-tabs relative flex flex-wrap lg:flex-nowrap space-x-2 lg:space-x-4 h-10 border border-base dark:border-[#55496E] rounded-full shadow-md mb-4 lg:mb-0">

                <button
                  type="button"
                  className={`tab-button flex-1 flex items-center justify-center h-10 px-4 text-center font-medium rounded-full overflow-hidden whitespace-nowrap text-ellipsis text-xs sm:text-sm lg:text-base ${activeTable === 'all' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('all')}
                >
                  {t('All')}
                </button>

                <button
                  type="button"
                  className={`tab-button items-center justify-center h-10 px-9 text-center font-medium rounded-full overflow-hidden whitespace-nowrap lg:text-base ${activeTable === 'owner' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('owner')}
                >
                  {t('Your Contributions')}
                </button>
                {tags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`tab-button items-center justify-center h-10 px-9 text-center font-medium rounded-full overflow-hidden whitespace-nowrap lg:text-base ${activeTable === `Tag ${tag}` ? 'active' : ''}`}
                    onClick={() => handleButtonClick(`Tag ${tag}`)}
                  >
                    {t(tag)}
                  </button>
                ))}
              </div>

              <div className="create-token-btn mt-4 lg:mt-0">
                <Link
                  to="/create-token"
                  className="create-token-link inline-block font-bold px-6 py-3 text-white rounded-full text-center shadow-lg transition-all duration-200 ease-in-out text-xs sm:text-sm lg:text-base"
                >
                  {t('createToken')}
                </Link>
              </div>
            </div>

            <div className="mt-0">
              <CardList activeTable={activeTable} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
