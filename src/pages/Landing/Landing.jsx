import React, { useEffect, useState } from "react";
import "./landing.css";
import Coins from "../../img/coins.png";
import Kuttu from "../../img/avarat.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";

function Landing() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users/");

    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const leaderboardArray = [];

      for (let userId in usersData) {
        const coins = usersData[userId]?.coins || 0;
        const username = usersData[userId]?.username;
        leaderboardArray.push({ userId, coins, username });
      }

      leaderboardArray.sort((a, b) => b.coins - a.coins);
      setLeaderboard(leaderboardArray);
      setLoading(false);
    });
  }, []);

  return (
    <div className="veed">
      <div className="landhead">
        <div className="landcoins">
          <div className="logreg">
            <Button onClick={() => navigate("/login")}>Login</Button>
            <Button onClick={() => navigate("/register")}>Register</Button>
          </div>
          <div className="guides">
            <Button>See Guidelines</Button>
          </div>
        </div>
      </div>

      <div className="landlead">
        <h3>Leaderboard</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          leaderboard.map((user, index) => (
            <div className="leaders" key={index}>
              <h3>{index + 1}</h3>
              <div className="leaddet">
                <div className="mejoin">
                  <img src={Kuttu} alt="Kuttu" />
                  <p>@{user.username}</p>
                </div>
                <div className="mejoin">
                  <img className="nanayam" src={Coins} alt="coiner" />
                  <h3>{user.coins}</h3>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Landing;
