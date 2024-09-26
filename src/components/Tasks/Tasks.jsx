import React from 'react';
import './tasks.css';
import Coins from "../../img/coins.png";

const Tasks = () => {
  return (
    <div className='tasku'>
      <p className='taskup'>Complete the tasks to recieve rewards</p>
      <div className="taskgrid">
        <div className="taskind">
            <h3>Task 1</h3>
            <div className="tcoin">
                <img src={Coins} alt="COins image"/>
                <p>500</p>
            </div>
            <p>balbnlablabalbalbalbalba</p>
            <button className='comp'>Complete</button>
        </div>
        <div className="taskind">
            <h3>Task 2</h3>
            <div className="tcoin">
                <img src={Coins} alt="COins image"/>
                <p>400</p>
            </div>
            <p>balbnlablabalbalbalbalba</p>
            <button className='comp'>Complete</button>
        </div>
        <div className="taskind">
            <h3>Task 3</h3>
            <div className="tcoin">
                <img src={Coins} alt="COins image"/>
                <p>200</p>
            </div>
            <p>balbnlablabalbalbalbalba</p>
            <button className='comp'>Complete</button>
        </div>
        <div className="taskind">
            <h3>Task 4</h3>
            <div className="tcoin">
                <img src={Coins} alt="COins image"/>
                <p>1500</p>
            </div>
            <p>balbnlablabalbalbalbalba</p>
            <button className='comp'>Complete</button>
        </div>
      </div>
    </div>
  )
}

export default Tasks
