import React, { useState } from 'react';
import './home.css';
import Coins from "../../img/coins.png";
import Redeem from '../../components/Redeem/Reedem';
import Receive from '../../components/Receive/Receive';
import { CopyOutlined } from '@ant-design/icons'; 
import { Button, message, Space } from 'antd';

function Home() {
  const [activeButton, setActiveButton] = useState('redeem'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [visible, setVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'This is a success message',
    });
  };

  const handleButtonClick = (buttonValue) => {
    setActiveButton(buttonValue); 
  };
  const handleClose = () => {
    setVisible(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  // const alert = <Alert message="Success Tips" type="success" showIcon />

  const copyToClipboard = () => {
    const referralId = document.getElementById("referral-id").textContent;
    navigator.clipboard.writeText(referralId);
    messageApi.open({
      type: 'success',
      content: 'Referral Id Copied Sucessfully !',
    });
  };

  const renderContent = () => {
    switch (activeButton) {
      case 'redeem':
        return <div className="content">
          <Redeem/>
        </div>;
      case 'send':
        return <div className="content">Send Content</div>;
      case 'receive':
        return <div className="content"><Receive/></div>;
      case 'tasks':
        return <div className="content">Tasks Content</div>;
      default:
        return <div className="content">Please select an option</div>;
    }
  };

  return (
    <div className='veed'>
      {contextHolder}
      {/* {visible ? (
        <Alert
          message="Success Tips"
          description="Detailed description and advice about successful copywriting."
          type="success"
          closable
          onClose={handleClose}
        />
      ) : null} */}
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
              className={activeButton === 'receive' ? 'veedlink' : 'veedlinkmon'}
              value="receive"
              onClick={() => handleButtonClick('receive')}
            >
              Receive
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
