import React, { useContext, useState } from "react";
import { Flex, Input, Typography, message } from "antd";
import { getDatabase, ref, set, get } from "firebase/database";
import "./redeem.css";
import { UserContext } from "../../context/UserContext";

const { Title } = Typography;

const Redeem = () => {
  const { user, setUser } = useContext(UserContext);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (loading) return;
    setLoading(true);

    const codeRegex = /^[A-Z0-9]+$/;
    if (code.length !== 8 || !codeRegex.test(code)) {
      message.error("Invalid code.");
      setLoading(false);
      return;
    }

    message.success("Redeeming..");
    const db = getDatabase();
    const codeRef = ref(db, `redeemCodes/${code}`);

    get(codeRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const receivedAmount = 100;

          const userRef = ref(db, `users/${user.uid}/coins`);
          const newBalance = user.coins + receivedAmount;

          set(userRef, newBalance)
            .then(() => set(codeRef, null))
            .then(() => {
              message.success(
                `Coins redeemed successfully! You've gained ${receivedAmount} coins.`
              );
              setUser((prevUser) => ({ ...prevUser, coins: newBalance }));
              setCode("");
            })
            .catch((error) => {
              console.error("Error processing transaction:", error);
              message.error("Failed to redeem coins. Please try again.");
            });
        } else {
          message.error("This code is expired.");
        }
      })
      .catch((error) => {
        console.error("Error checking code:", error);
        message.error("Failed to redeem code. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="redeemdiv">
      <h3>Enter Code to Redeem</h3>
      <p>Enter 8-character alphanumeric code that was generated</p>

      <Flex className="optt" gap="middle" align="flex-start" vertical>
        <Input.OTP
          length={7}
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
