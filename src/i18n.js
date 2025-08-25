import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(LanguageDetector)  // Detect language from browser settings
  .use(Backend)  // Optional: Load translations from a backend server
  .use(initReactI18next)  // Initialize react-i18next for React
  .init({
    resources: {
      en: {
        translation: {
          board: 'Board',
          createToken: 'Create Token',
          tokenName: 'Token Name',
          tickerSymbol: 'Ticker Symbol',
          description: 'Description',
          router: 'Router',
          website: 'Website',
          twitter: 'Twitter',
          telegram: 'Telegram',
          selectTag: 'Select Tag',
          chooseCategory: 'Choose a category for your token. You can only select one.',
          connectWallet: 'Connect Wallet',
          walletConnected: 'Wallet Connected',
          meme: 'Meme',
          ai: 'AI',
          defi: 'DeFi',
          games: 'Games',
          infra: 'Infra',
          deSci: 'De-Sci',
          social: 'Social',
          depin: 'Depin',
          charity: 'Charity',
          others: 'Others',
          progressRanking: 'Progress Ranking',
          gainersRanking: '24 Hours Gainers Ranking',
          marketCapRanking: 'MarketCap Ranking',
          tradingVolume: '24 Hours Trading Volume',
          extraOptions: 'Extra Options',
          totalSupply: 'Total Supply',
          raisedAmount: 'Raised Amount',
          salesRatio: 'Sales Ratio',
          reservedRatio: 'Reserved Ratio',
          liquidityPoolRatio: 'Liquidity Pool Ratio',
          startTime: 'Start Time',
          maximumPerUser: 'Maximum Per User',
          buyTax: 'Buy Tax',
          sellTax: 'Sell Tax',
        },
      },
      zh: {
        translation: {
          board: '板块',
          createToken: '创建代币',
          tokenName: '代币名称',
          tickerSymbol: '代币符号',
          description: '描述',
          router: '募资代币',
          website: '网站',
          twitter: 'Twitter',
          telegram: 'Telegram',
          selectTag: '选择标签',
          chooseCategory: '选择您的代币类别，您只能选择一个。',
          connectWallet: '连接钱包',
          walletConnected: '钱包已连接',
          meme: '表情包',
          ai: '人工智能',
          defi: '去中心化金融',
          games: '游戏',
          infra: '基础设施',
          deSci: '去中心化科学',
          social: '社交',
          depin: '去中心化基础设施',
          charity: '慈善',
          others: '其他',
          progressRanking: '进度排名',
          gainersRanking: '24小时涨幅排名',
          marketCapRanking: '市值排名',
          tradingVolume: '24小时交易量',
          extraOptions: '额外选项',
          totalSupply: '总供应量',
          raisedAmount: '募资金额',
          salesRatio: '销售比例',
          reservedRatio: '预留比例',
          liquidityPoolRatio: '流动池比例',
          startTime: '开始时间',
          maximumPerUser: '每个用户最大金额',
          buyTax: '买入税',
          sellTax: '卖出税',
        },
      },
    },
    fallbackLng: 'en',  // Use English as the fallback language
    debug: process.env.NODE_ENV === 'development',  // Only enable debug in development
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
