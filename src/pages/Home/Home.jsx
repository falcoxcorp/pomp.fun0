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
      <section className='mainslider'>
        <div className='container'>
          <div className='col-md-7'>
            <h1>Discover the power of <br></br>FalcoX </h1>
            <h2>like never before</h2>
            <p>At Falcox we connect marketing and market making with results that transform projects into
              success stories. We design precise soluctions that generate natural attraction for investors, ensuring solid and sustainable growth for our clients.</p>
            <p>Trust the experience that makes the difference. Folcox, where your vision becomes reality.</p>
          </div>
          <div className='col-md-5'>
            <img src="./images/sliderimages.png" className="sliders" alt="sliderimages" />
          </div>
        </div>
      </section>

      <main className="pl-5 pr-5 top-0 overflow-hidden">
        <div className="flex flex-col pb-4 pt-[75px] xl:pt-[50px]">

          <div className="absolute top-0 left-0 z-0 w-90 h-[60vw] sm:h-[43vw] md:h-[33vw] "></div>

          <div className="relative flex flex-col gap-4 lg:gap-6 mb-8 lg:mb-10">
            <div className="flex flex-col lg:flex-row lg:justify-between">

              <div className="buttonbox relative flex flex-wrap lg:flex-nowrap space-x-2 lg:space-x-4 h-10 border border-base dark:border-[#55496E] rounded-full shadow-md mb-4 lg:mb-0">

                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center h-10 px-4 text-center font-medium rounded-full overflow-hidden whitespace-nowrap text-ellipsis text-xs sm:text-sm lg:text-base ${activeTable === 'all' ? 'bg-white text-black' : 'text-[#fff] dark:text-purple-500 hover:bg-gray-400'}`}
                  onClick={() => handleButtonClick('all')}
                >
                  {t('All')}
                </button>

                <button
                  type="button"
                  className={`items-center justify-center h-10 px-9 text-center font-medium rounded-full overflow-hidden whitespace-nowrap  lg:text-base ${activeTable === 'owner' ? 'bg-white' : 'text-[#fff] dark:text-purple-500 hover:bg-gray-400'}`}
                  onClick={() => handleButtonClick('owner')}
                >
                  {t('Your Contributions')}
                </button>
                {tags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`items-center justify-center h-10 px-9 text-center font-medium rounded-full overflow-hidden whitespace-nowrap lg:text-base ${activeTable === `Tag ${tag}` ? 'bg-white' : 'text-[#fff] dark:text-purple-500 hover:bg-gray-400'}`}
                    onClick={() => handleButtonClick(`Tag ${tag}`)}
                  >
                    {t(tag)}
                  </button>
                ))}
              </div>

              <div className="createrightbtn mt-4 lg:mt-0">
                <Link
                  to="/create-token"
                  className="inline-block font-bold px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full text-center shadow-lg transition-all duration-200 ease-in-out text-xs sm:text-sm lg:text-base"
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
