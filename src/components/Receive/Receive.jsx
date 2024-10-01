import React, { useContext, useState } from "react";
import { Flex, Input, Typography, message } from "antd";
import { getDatabase, ref, runTransaction, get } from "firebase/database";
import "./receive.css";
import { UserContext } from "../../context/UserContext";

const { Title } = Typography;

const Receive = () => {
  const { user, setUser } = useContext(UserContext);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    const codeRegex = /^[A-Z0-9]+$/;
    if (code.length !== 7 || !codeRegex.test(code)) {
      message.error("Invalid code.");
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const codeRef = ref(db, `sendCodes/${code}/amount`);

    try {
      let sendAmount = 0;
      await runTransaction(codeRef, (codeData) => {
        sendAmount = codeData;
        return 0;
      });

      if (sendAmount === 0) {
        message.error("Code expired.");
        return;
      }

      const receivedAmount = sendAmount * 0.5;
      const userRef = ref(db, `users/${user.uid}/coins`);
      await runTransaction(userRef, (currentCoins) => {
        return (currentCoins || 0) + receivedAmount;
      });

      message.success(
        `Coins received successfully! You've gained ${receivedAmount} coins.`
      );
      setUser((prevUser) => ({
        ...prevUser,
        coins: user.coins + receivedAmount,
      }));

      setCode("");
    } catch (error) {
      console.error("Error processing transaction:", error);
      message.error("Failed to redeem code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="redeemdiv">
      <h3>Enter Code to Receive</h3>
      <p>Enter 7-character alphanumeric code that was generated</p>

      <Flex className="optt" gap="middle" align="flex-start" vertical>
        <Input.OTP
          length={7}
          size="large"
          onChange={(e) => setCode(e)}
          formatter={(str) => str.toUpperCase()}
          value={code}
        />
      </Flex>

      <button className="redsub" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Receive;
