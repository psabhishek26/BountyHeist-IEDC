import React, { useContext, useState } from "react";
import { Flex, Input, Typography, message } from "antd";
import { getDatabase, ref, runTransaction } from "firebase/database";
import "./redeem.css";
import { UserContext } from "../../context/UserContext";

const { Title } = Typography;

const Redeem = () => {
  const { user, setUser } = useContext(UserContext);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    const codeRegex = /^[A-Z0-9]+$/;
    if (code.length !== 8 || !codeRegex.test(code)) {
      message.error("Invalid code.");
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const codeRef = ref(db, `redeemCodes/${code}`);

    try {
      let expired = false
      await runTransaction(codeRef, (status) => {
        if (status == null || status) expired = true;
        return true;
      });

      if (expired) {
        message.error("Code expired.");
        return;
      }

      const receivedAmount = 100;
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
    <div className="redeemdiv" style={{ paddingTop: "10px" }}>
      <h3>Enter Code to Redeem</h3>
      <p>Enter 8-character alphanumeric code</p>

      <Flex className="optt" gap="middle" align="flex-start" vertical>
        <Input.OTP
          length={8}
          size="large"
          formatter={(str) => str.toUpperCase()}
          onChange={(e) => setCode(e)}
          value={code}
        />
      </Flex>

      <button className="redsub" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Redeem;
