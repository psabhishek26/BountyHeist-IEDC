import React from 'react';
import './send.css';
import Coins from "../../img/coins.png";
import { Input } from 'antd';

const Send = () => {
  return (
    <div className='send'>
        <div className="sendhead">
            <h3>Send</h3>
            <p>Enter the amount to transfer</p>
            <div className="sendcoins">
                <img src={Coins} alt="COins image"/>
                <Input className='antdins' placeholder="0" />
            </div>
            <button className='genbutt'>Generate</button>
        </div>
        <div className="sendmain">
            <h3>A5G7D33Y</h3>
            <p>Share this code to send your coins</p>
        </div>  
    </div>
  )
}

export default Send
