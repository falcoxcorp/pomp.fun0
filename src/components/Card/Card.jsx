import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import abi from "../../helper/ManagerFaucetAbi.json";
import { daimond, priceInDollar } from '../../helper/Helper';
import { useNavigate } from 'react-router-dom';

const Card = ({ id, reserve, activeTable }) => {

  const navigate = useNavigate();
  const { address } = useAccount();

  if (!id || id == 1 || id == 2 || id == 3 || id == 4 || id == 5 || id == 6) {
    return;
  }

  const { data, error, isLoading } = useReadContract({
    abi,
    address: daimond[1868],
    functionName: 'getPoolAt',
    args: [(id - 1).toString()],
    chainId: 1868
  });

  if (isLoading) {
    return;
  }


  if (error) {
    return;
  }

  if (!data) {
    return;
  }



  const poolDetailsParsed = data.poolDetails ? JSON.parse(data.poolDetails) : {};
  const addressToCompare = address ? address : "0x0000000000000000000000000000000000000000";
  if (activeTable === "owner" && data.owner !== addressToCompare) {
    return;
  }
  if (activeTable.includes("Tag") && poolDetailsParsed.Tag !== activeTable.split(" ")[1].trim()) {
    console.log({ id, 'tagset': activeTable.split(" ")[1].trim(), 'actual tag': poolDetailsParsed.tag })
    return;
  }

  return (

    <div
      key={data.id}
      className="rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => navigate(`/token/1868/${data.token}`)} // Navigate to /card-page with poolId as query param
    >
      {/* Card New Section */}
      <div className="cards dark">
        <div className="card-body">
          <img
            src={poolDetailsParsed.image || 'https://codingyaar.com/wp-content/uploads/chair-image.jpg'}
            className="card-img-top"
            alt="Token Logo"
          />
          <div className="text-section">
            <h5 className="card-title">{poolDetailsParsed.name}</h5>


            <span>Progress</span>
            <span className='hardcap'>Hard Cap</span>
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: `${parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100}%` }} aria-valuenow={`${parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100}`} aria-valuemin="0" aria-valuemax="100">{parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100}%</div>
            </div>
            <span className='price'>4.913k  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAA3ElEQVR4AY3SgQbCYBTF8fNmgV4ggEAAI4hAYDAEHwQD+AAG9AABMIAIAhgYAhYwbt3bubol1R+MH2d3DPKlv7HNKdUfsV9Ca08ounesYB3PuFe+4iQaMHGMdgKiIm5ey1RQS8eOJlaC1RELaK2wA7TigaPveFtoo2HL52dcUsy+wviebGgX1BF3uJd+IWeXEec+6wcFG/yz4cdVb/dAHriG1rg10DbEHtZ6MNvDuhD1Omu6WY20WhxlBtbTFkIMeglG1GqzBlYWRzZU6LPRdpCIbNzn5tD9/1N/6QZlMwcqRvoNxQAAAABJRU5ErkJggg==" className="chainimg" alt="ETH" /></span>

            <span className='hardcap'><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAA3ElEQVR4AY3SgQbCYBTF8fNmgV4ggEAAI4hAYDAEHwQD+AAG9AABMIAIAhgYAhYwbt3bubol1R+MH2d3DPKlv7HNKdUfsV9Ca08ounesYB3PuFe+4iQaMHGMdgKiIm5ey1RQS8eOJlaC1RELaK2wA7TigaPveFtoo2HL52dcUsy+wviebGgX1BF3uJd+IWeXEec+6wcFG/yz4cdVb/dAHriG1rg10DbEHtZ6MNvDuhD1Omu6WY20WhxlBtbTFkIMeglG1GqzBlYWRzZU6LPRdpCIbNzn5tD9/1N/6QZlMwcqRvoNxQAAAABJRU5ErkJggg==" className="hardcapchainimg" alt="ETH" /> 10.000k</span>


            <p className="card-text">{poolDetailsParsed.description}</p>
          </div>
        </div>
        <hr />
        <p className='mcapdiv'>
          <span className="socialicon">
            <i className="fa fa-globe"></i>
            <i className="fa fa-twitter"></i>
          </span>
          <span className="MCap">
            MCap: ${parseFloat(parseInt(data.virtualQuoteReserve) * 10000000 * priceInDollar['1868'] / parseInt(data.maxListingBaseAmount)).toFixed(12)}
          </span>
        </p>
      </div>
    </div>
  );

};

export default Card;
