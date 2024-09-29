import React, { useContext, useState, useEffect } from "react";
import "./send.css";
import Coins from "../../img/coins.png";
import { Flex, Input, message } from "antd";
import { UserContext } from "../../context/UserContext";
import { generateCodeSeven } from "../../utils/Utils";
import { getDatabase, ref, set, get } from "firebase/database";
import { CopyOutlined } from "@ant-design/icons";

const Send = () => {
  const { user, setUser } = useContext(UserContext);
  const [amount, setAmount] = useState(0);
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const validateInputs = () => {
    if (user.coins >= 2000) {
      message.error("You have reached the limit of 2000 coins and cannot send more.");
      return false;
    }

    if (amount <= 0) {
      message.error("You need to enter a valid amount!");
      return false;
    }

    if (user.coins < 500) {
      message.error("You need at least 500 coins to send!");
      return false;
    }

    if (user.coins - amount < 0) {
      message.error("You don't have enough coins!");
      return false;
    }

    return true;
  };

  const updateUserCoins = (newBalance) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);

    return set(userRef, { ...user, coins: newBalance });
  };

  const addSendCode = async (newCode) => {
    const db = getDatabase();
    const codesRef = ref(db, `sendCodes/${newCode}`);

    return set(codesRef, {
      amount: amount,
      sender: user.uid,
      timestamp: Date.now(),
    });
  };

  const generateNewCode = async () => {
    let newCode;
    let attempts = 0;
    const maxAttempts = 10;

    const db = getDatabase();
    do {
      newCode = generateCodeSeven();
      const codeRef = ref(db, `sendCodes/${newCode}`);
      const snapshot = await get(codeRef);
      if (!snapshot.exists()) {
        return newCode;
      }
      attempts++;
    } while (attempts < maxAttempts);

    throw new Error("Failed to generate a unique code. Please try again.");
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    message.success("Sending...");

    if (!validateInputs()) return;
    const newCode = await generateNewCode();
    const newBalance = user.coins - amount;

    updateUserCoins(newBalance)
      .then(() => addSendCode(newCode))
      .then(() => {
        message.success("Coins sent successfully!");
        setUser((prevUser) => ({ ...prevUser, coins: newBalance }));
        setCode(newCode);
        setAmount(0);
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Failed to send coins. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copyToClipboard = () => {
    const referralId = document.getElementById("send-code-id").textContent;
    navigator.clipboard.writeText(referralId);
    messageApi.open({
      type: "success",
      content: "Code Copied Sucessfully !",
    });
  };

  return (
    <div className="send">
      {contextHolder}
      <div className="sendhead">
        <h3>Send</h3>
        <p>Enter the amount to transfer</p>
        <div className="sendcoins">
          <img src={Coins} alt="COins image" />
          <Input
            className="antdins"
            type="number"
            placeholder="0"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
        </div>
        <button onClick={() => handleSubmit()} className="genbutt">
          Generate
        </button>
      </div>
      {code && (
        <div className="sendmain">
          <div className="code">
            <h3 id="send-code-id">{code}</h3>
            <CopyOutlined
              onClick={copyToClipboard}
              style={{ marginLeft: "10px", color: "black", cursor: "pointer" }}
            />
          </div>
          <p>Share this code to send your coins</p>
        </div>
      )}
    </div>
  );
};

export default Send;
