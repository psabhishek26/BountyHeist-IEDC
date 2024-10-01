import React, { useEffect, useState } from 'react';
import { Progress, Tooltip } from 'antd';
import { ref, onValue } from 'firebase/database'; // Import Realtime Database functions
import { db, auth } from '../../firebase'; // Firebase configuration

const CoinProgressBar = () => {
  const [coins, setCoins] = useState(0);

  // Fetch user coins from Firebase Realtime Database
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const coinsRef = ref(db, `users/${userId}/coins`);
    onValue(coinsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCoins(data);
      }
    });
  }, []);

  const getTierStatus = () => {
    if (coins >= 5000) return 'Grand Prize Unlocked';
    if (coins >= 3600) return 'Tier 3 Completed';
    if (coins >= 2800) return 'Tier 2 Completed';
    if (coins >= 2000) return 'Tier 1 Completed';
    return 'Keep Collecting Coins!';
  };

  const getProgressPercent = () => {
    return Math.min((coins / 5000) * 100, 100);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Tooltip title={getTierStatus()}>
        <Progress 
          percent={getProgressPercent()} 
          success={{ percent: (coins / 5000) * 100 }} 
        />
      </Tooltip>
      <p>{getTierStatus()}</p>
      <p>{coins} Coins</p>
    </div>
  );
};

export default CoinProgressBar;
