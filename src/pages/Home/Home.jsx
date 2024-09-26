import React from 'react';
// import Bounty from "../../img/bounty.png";
import { Button, Flex } from 'antd';
import './home.css';
import Coins from "../../img/coins.png";
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className='veed'>
        <div className="vhead">
            <div className="veednav">
            {/* <button className='buttonme'>Profile</button> */}
            <div className="veednav1">
            <h3>Alex Emmatty</h3>
            <p>9UVV-07FE</p>
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
                <button className='veedlink' value="redeem" >Redeem</button>
                <button className='veedlinkmon' value="send" >Send</button>
                <button className='veedlinkmon' value="recieve" >Recieve</button>
                <button className='veedlinkmon' value="tasks" >Tasks</button>
            </div>
            </div>
            </div>
        
        
    </div>
  )
}

export default Home