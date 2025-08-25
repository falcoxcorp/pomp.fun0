import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useWriteContract } from 'wagmi';
import { daimond, routers, tags } from '../../helper/Helper';
import degenFacetAbi from "../../helper/DegenFacetAbi.json";
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useNavigate } from 'react-router-dom';
import { config } from '../../wagmiClient';

const CreateToken = () => {
  const { chain, address } = useAccount();
  const routerAddresses = routers[chain?.id] || [];
  const { writeContractAsync, isPending, isSuccess } = useWriteContract();

  const [tokenName, setTokenName] = useState('');
  const [tickerSymbol, setTickerSymbol] = useState('');
  const [imageURl, setImageURl] = useState('');
  const [videoURl, setVideoURl] = useState('');
  const [description, setDescription] = useState('');
  const [router, setRouter] = useState('Select Router');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [showExtraOptions, setShowExtraOptions] = useState(false);
  const [initialBuyAmount, setInitialBuyAmount] = useState(0);
  const [startTime, setStartTime] = useState();
  const [maxPerUser, setMaxPerUser] = useState(0);
  const [hash, setHash] = useState(null);

  // Extra Amounts based on percentages
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      if (!address) {
        alert("Please Connect Wallet")
      }
      const params = {
        name: tokenName,
        symbol: tickerSymbol,
        poolDetails: JSON.stringify({
          name: tokenName,
          symbol: tickerSymbol,
          image: imageURl,
          video: videoURl,
          description: description,
          Website: website,
          Twitter: twitter,
          Telegram: telegram,
          Tag: selectedTag
        }),
        configIndex: 20,
        router: routerAddresses[router],
        startTime: showExtraOptions ? BigInt(Math.floor(new Date(startTime).getTime() / 1000)) : BigInt(Math.floor(new Date().getTime() / 1000)),
        buyFeeRate: showExtraOptions ? buyAmount * 100 : 0,
        sellFeeRate: showExtraOptions ? sellAmount * 100 : 0,
        maxBuyAmount: 0,
        delayBuyTime: 0,
        merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        initialBuyAmount: 0 // Using total supply here
      };

      const data = await writeContractAsync({
        abi: degenFacetAbi,
        address: daimond[1868],
        chainID: parseInt(chain.id, 10),
        functionName: 'createPool',
        value: initialBuyAmount, // Add value if needed
        args: [params], // Passing the struct as an object
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash: data,
      })
      console.log(receipt)
      setHash(receipt.transactionHash);
    } catch (error) {
      console.log(error)
      const message = error.shortMessage;
      if (message) {
        if (message.includes('reason:')) {
          const reason = message.split('reason:')[1].trim();
          alert(reason);
        } else {
          alert(message);
        }
      }
    }
  };

  return (
    <main className="successfullytoken formmain mainbox relative top-0 min-h-[calc(100vh_-_182px)]">
      <div className="w-full relative">
        {hash ?
          <div className="successbox hash-section text-center mt-8">
            <h3 className="text-xl font-bold text-green-600">Token Created Successfully!</h3>
            <p className="mt-2">
              Transaction Hash:{" "}
              <a
                href={`https://etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {hash}
              </a>
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Go to Listing page
            </button>
          </div>
          :
          <form className="tokenform ant-form ant-form-horizontal" onSubmit={handleSubmit}>
            <div className="forminbox lg:mx-auto px-[4.8%] lg:px-0 py-8 lg:py-[20px] w-full lg:w-[800px]">
              <div className="flex flex-col items-center gap-6 w-full">
                {/* Token Name Input Section */}
                <div className="w-full flex flex-col gap-4">
                  <label htmlFor="tokenName" className="text-lg font-bold text-purple-900">
                    {t('tokenName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="tokenName"
                    name="tokenName"
                    className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder={t('tokenName')}
                    required
                  />
                </div>

                {/* Ticker Symbol Input Section */}
                <div className="w-full flex flex-col gap-4">
                  <label htmlFor="tickerSymbol" className="text-lg font-bold text-purple-900">
                    {t('tickerSymbol')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="tickerSymbol"
                    name="tickerSymbol"
                    className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    value={tickerSymbol}
                    onChange={(e) => setTickerSymbol(e.target.value)}
                    placeholder={t('tickerSymbol')}
                    required
                  />
                </div>

                <div className="w-full flex flex-col gap-4">
                  <label htmlFor="Image Url" className="text-lg font-bold text-purple-900">
                    {t('Image Url')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="imgUrl"
                    name="imgUrl"
                    className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    value={imageURl}
                    onChange={(e) => setImageURl(e.target.value)}
                    placeholder={t('Enter JPG, PNG, GIF Image URL')}
                    required
                  />
                </div>

                <div className="w-full flex flex-col gap-4">
                  <label htmlFor="Image Url" className="text-lg font-bold text-purple-900">
                    {t('Video Url')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="videoUrl"
                    name="videoUrl"
                    className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    value={videoURl}
                    onChange={(e) => setVideoURl(e.target.value)}
                    placeholder={t('Video URL')}
                  />
                </div>

                {/* Description Input Section */}
                <div className="w-full flex flex-col gap-4">
                  <label htmlFor="description" className="text-lg font-bold text-purple-900">
                    {t('description')}<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('description')}
                    rows="4"
                    required
                  />
                </div>

                {/* Raised Token Selection */}
                <div className="w-full flex flex-col gap-4">
                  <label htmlFor="router" className="text-lg font-bold text-purple-900">
                    {t('router')}<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="router"
                    name="router"
                    className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    value={router}
                    onChange={(e) => setRouter(e.target.value)}
                    required
                  >
                    <option>Select Router</option>
                    {Object.entries(routerAddresses).map(([name, address]) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Website, Twitter, and Telegram Links */}
                <div className="w-full flex flex-col gap-4">
                  <label htmlFor="website" className="text-lg font-bold text-purple-900">{t('website')}</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder={t('website')}
                  />
                </div>

                <div className="w-full flex flex-col gap-4">
                  <label htmlFor="twitter" className="text-lg font-bold text-purple-900">{t('twitter')}</label>
                  <input
                    type="url"
                    id="twitter"
                    name="twitter"
                    className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder={t('twitter')}
                  />
                </div>

                <div className="w-full flex flex-col gap-4">
                  <label htmlFor="telegram" className="text-lg font-bold text-purple-900">{t('telegram')}</label>
                  <input
                    type="url"
                    id="telegram"
                    name="telegram"
                    className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder={t('telegram')}
                  />
                </div>

                {/* Tag Selection */}
                <div className="tags-selection w-full grid grid-cols-4 gap-4 mt-2">
                  {tags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-4 py-2 rounded-lg border-2 font-bold text-purple-900 ${selectedTag === tag ? 'bg-purple-500' : 'bg-purple-100'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Extra Options Toggle */}
                <div className="w-full flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowExtraOptions(!showExtraOptions)}
                    className="text-gold"
                  >
                    {showExtraOptions ? 'Hide Extra Options' : 'Show Extra Options'}
                  </button>
                </div>

                {/* Extra Options Fields (conditionally rendered) */}
                {showExtraOptions && (
                  <>
                    <div className="w-full flex flex-col gap-4">
                      <label htmlFor="startTime" className="text-lg font-bold text-purple-900">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        id="startTime"
                        name="startTime"
                        className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>

                    <div className="w-full flex flex-col gap-4">
                      <label htmlFor="buyAmount" className="text-lg font-bold text-purple-900">

                        Buy Tax % ({chain?.nativeCurrency?.symbol})  Ex:2
                      </label>
                      <input
                        type="number"
                        id="buyAmount"
                        name="buyAmount"
                        className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        placeholder="Buy Fee Rate"
                      />
                    </div>

                    <div className="w-full flex flex-col gap-4">
                      <label htmlFor="sellAmount" className="text-lg font-bold text-purple-900">
                        Sell Tax % ({chain?.nativeCurrency.symbol}) Ex:2
                      </label>
                      <input
                        type="number"
                        id="sellAmount"
                        name="sellAmount"
                        className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                        placeholder="Sell Fee Rate"
                      />
                    </div>

                    <div className="w-full flex flex-col gap-4">
                      <label htmlFor="maxPerUser" className="text-lg font-bold text-purple-900">
                        Max Buy Amount per User ({chain?.nativeCurrency.symbol})
                      </label>
                      <input
                        type="number"
                        id="maxPerUser"
                        name="maxPerUser"
                        className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                        value={maxPerUser}
                        onChange={(e) => setMaxPerUser(e.target.value)}
                        placeholder="Max Buy Amount"
                      />
                    </div>
                    <div className="w-full flex flex-col gap-4">
                      <label htmlFor="Initial Buy Amount" className="text-lg font-bold text-purple-900">
                        Initial Buy Amount ({chain?.nativeCurrency.symbol}) Ex:2 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="initialBuyAmount"
                        name="initialBuyAmount"
                        className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                        value={initialBuyAmount}
                        onChange={(e) => setInitialBuyAmount(e.target.value)}
                        placeholder="Total Supply"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="createtokenbtn submit-button mt-4 w-full text-white font-bold py-3 rounded-lg"
                  disabled={isPending}
                >
                  {isPending ? 'Creating Token...' : 'Create Token'}
                </button>
              </div>
            </div>
          </form>}
      </div>
    </main>
  );
}

export default CreateToken;
