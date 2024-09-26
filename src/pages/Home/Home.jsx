import React, { useState } from 'react';
import './home.css';
import Coins from "../../img/coins.png";
import Reedem from '../../components/Redeem/Reedem';
import Receive from '../../components/Receive/Receive';
import { CopyOutlined } from '@ant-design/icons'; 

function Home() {
  const [activeButton, setActiveButton] = useState('redeem'); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = (buttonValue) => {
    setActiveButton(buttonValue); 
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const copyToClipboard = () => {
    const referralId = document.getElementById("referral-id").textContent;
    navigator.clipboard.writeText(referralId);
    alert("Referral ID copied to clipboard!");
  };

  const renderContent = () => {
    switch (activeButton) {
      case 'redeem':
        return <div className="content">
          <Reedem/>
        </div>;
      case 'send':
        return <div className="content">Send Content</div>;
      case 'recieve':
        return <div className="content"><Receive/></div>;
      case 'tasks':
        return <div className="content">Tasks Content</div>;
      default:
        return <div className="content">Please select an option</div>;
    }
  };

  return (
    <div className='veed'>
      <div className="vhead">
        <div className="veednav">
          <div className="veednav1" onClick={toggleModal}>
            <h3>Alex Emmatty</h3>
            <p>Referral ID</p>
          </div>
        </div>
        <div className="veedcoins">
          <img src={Coins} alt="Coins" />
          <p>100</p>
        </div>
      </div>
      
      <div className="veedtask">
        <div className="veedmenu">
          <div className="veedmenu1">
            <button
              className={activeButton === 'redeem' ? 'veedlink' : 'veedlinkmon'}
              value="redeem"
              onClick={() => handleButtonClick('redeem')}
            >
              Redeem
            </button>
            <button
              className={activeButton === 'send' ? 'veedlink' : 'veedlinkmon'}
              value="send"
              onClick={() => handleButtonClick('send')}
            >
              Send
            </button>
            <button
              className={activeButton === 'recieve' ? 'veedlink' : 'veedlinkmon'}
              value="recieve"
              onClick={() => handleButtonClick('recieve')}
            >
              Recieve
            </button>
            <button
              className={activeButton === 'tasks' ? 'veedlink' : 'veedlinkmon'}
              value="tasks"
              onClick={() => handleButtonClick('tasks')}
            >
              Tasks
            </button>
          </div>
        </div>

        <div className="veedcontent">
          {renderContent()}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={toggleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <span className="close" onClick={toggleModal}>&times;</span>
              <h3 style={{ textAlign: 'center' }}>Alex Emmatty</h3>
              <p style={{ textAlign: 'center' }}>
                Referral ID: <span id="referral-id">12345</span>
                <CopyOutlined 
                  onClick={copyToClipboard} 
                  style={{ marginLeft: '10px', color: 'black', cursor: 'pointer' }} 
                />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
