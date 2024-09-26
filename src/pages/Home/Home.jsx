import React, { useState } from 'react';
import './home.css';
import Coins from "../../img/coins.png";

function Home() {
  const [activeButton, setActiveButton] = useState('redeem'); 

  const handleButtonClick = (buttonValue) => {
    setActiveButton(buttonValue); 
  };

  const renderContent = () => {
    switch (activeButton) {
      case 'redeem':
        return <div className="content">Redeem Content</div>;
      case 'send':
        return <div className="content">Send Content</div>;
      case 'recieve':
        return <div className="content">Receive Content</div>;
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
          <div className="veednav1">
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
    </div>
  );
}

export default Home;
