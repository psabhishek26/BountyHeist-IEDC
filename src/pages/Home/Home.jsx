import React from 'react';
import Bounty from "../../img/bounty.png";
import './home.css';

function Home() {
  return (
    <div className='veed'>
        <div className="vhead">
            <img src={Bounty} alt="Bounty" />
        </div>
    </div>
  )
}

export default Home