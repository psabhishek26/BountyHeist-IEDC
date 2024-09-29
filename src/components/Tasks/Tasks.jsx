import React, { useContext, useState } from "react";
import "./tasks.css";
import Coins from "../../img/coins.png";
import { Flex, Input, Typography, message } from "antd";
import { UserContext } from "../../context/UserContext";
import { getDatabase, ref, get, update } from "firebase/database";

const Tasks = () => {
  const { user, setUser } = useContext(UserContext);
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    if (user.referralused) {
      message.error("You have already used your referral code.");
      return;
    }

    const codeRegex = /^[A-Z0-9]+$/;
    if (code.length !== 6 || !codeRegex.test(code)) {
      message.error("Invalid code.");
      return;
    }

    if (code === user.referralCode) {
      message.success("Nice try.");
      return;
    }

    const db = getDatabase();
    const codeRef = ref(db, `referrals/${code}`);
    const userRef = ref(db, `users/${user.uid}`);

    try {
      const snapshot = await get(codeRef);

      if (snapshot.exists()) {
        const referralUid = snapshot.val().uid;
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val();

        if (userData.referralUsed) {
          message.error("You have already used a referral code.");
        } else {
          const updatedCoins = (userData.coins || 0) + 50;
          await update(userRef, {
            referralUsed: true,
            coins: updatedCoins,
          });

          const referralUserRef = ref(db, `users/${referralUid}`);
          const referralUserSnapshot = await get(referralUserRef);
          const referralUserData = referralUserSnapshot.val();
          await update(referralUserRef, {
            coins: (referralUserData.coins || 0) + 100,
          });

          setUser((prevUser) => ({
            ...prevUser,
            referralUsed: true,
            coins: updatedCoins,
          }));
          message.success("Referral code accepted! You earned 50 coins.");
        }
      } else {
        message.error("Invalid referral code.");
      }
    } catch (error) {
      console.error("Error verifying referral code:", error);
      message.error("Failed to verify referral code. Please try again.");
    }
  };

  return (
    <div className="tasku">
      {!user.referralUsed && (
        <div className="redeemdiv">
          <h3>Enter the Referral-Code</h3>
          <p>
            Enter the 6-character alphanumeric referral code provided by your
            friend to earn 50 coins.
          </p>
          <Flex className="optt" gap="middle" align="flex-start" vertical>
            <Input.OTP
              length={6}
              size="large"
              onChange={(e) => setCode(e)}
              value={code}
            />
          </Flex>

          <button className="redsub" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}

      {/* Tasks Section */}
      <p className="taskup">
        Complete the following tasks to receive even more rewards
      </p>

      <div className="taskgrid">
        <div className="taskind">
          <h3>Task 1</h3>
          <div className="tcoin">
            <img src={Coins} alt="Coins image" />
            <p>500</p>
          </div>
          <p>Description of Task 1</p>
          <button className="comp">Complete</button>
        </div>
        <div className="taskind">
          <h3>Task 2</h3>
          <div className="tcoin">
            <img src={Coins} alt="Coins image" />
            <p>400</p>
          </div>
          <p>Description of Task 2</p>
          <button className="comp">Complete</button>
        </div>
        <div className="taskind">
          <h3>Task 3</h3>
          <div className="tcoin">
            <img src={Coins} alt="Coins image" />
            <p>200</p>
          </div>
          <p>Description of Task 3</p>
          <button className="comp">Complete</button>
        </div>
        <div className="taskind">
          <h3>Task 4</h3>
          <div className="tcoin">
            <img src={Coins} alt="Coins image" />
            <p>1500</p>
          </div>
          <p>Description of Task 4</p>
          <button className="comp">Complete</button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
