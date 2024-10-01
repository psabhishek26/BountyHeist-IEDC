import React, { useState, useContext } from "react";
import "./home.css";
import Coins from "../../img/coins.png";
import Redeem from "../../components/Redeem/Reedem";
import Receive from "../../components/Receive/Receive";
import { CopyOutlined } from "@ant-design/icons";
import { Button, message, Progress, Tooltip } from "antd";
import Send from "../../components/Send/Send";
import Tasks from "../../components/Tasks/Tasks";
import { UserContext } from "../../context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [activeButton, setActiveButton] = useState("redeem");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();


  const tiers = {
    tier1: 2000,
    tier2: 2800,
    tier3: 3600,
    grandPrize: 5000,
  };
  // Determine the current tier
  const getCurrentTier = () => {
    const { coins } = user;

    if (coins >= tiers.grandPrize) return "Grand Prize";
    if (coins >= tiers.tier3) return "Tier 3";
    if (coins >= tiers.tier2) return "Tier 2";
    if (coins >= tiers.tier1) return "Tier 1";
    return "No Tier Reached";
  };

  // Calculate the progress percentage based on the user's coins
  const calculateProgress = () => {
    const { coins } = user;

    if (coins >= tiers.grandPrize) return 100;
    if (coins >= tiers.tier3) return ((coins - tiers.tier3) / (tiers.grandPrize - tiers.tier3)) * 28 + 72;
    if (coins >= tiers.tier2) return ((coins - tiers.tier2) / (tiers.tier3 - tiers.tier2)) * 16 + 56;
    if (coins >= tiers.tier1) return ((coins - tiers.tier1) / (tiers.tier2 - tiers.tier1)) * 16 + 40;
    return (coins / tiers.tier1) * 40;
  };
  // Handle sign-out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        setUser(null);
        message.success("Successfully signed out!");
        navigate("/landing");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        message.error("Sign-out failed");
      });
  };

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Copy referral ID to clipboard
  const copyToClipboard = () => {
    const referralId = document.getElementById("referral-id").textContent;
    navigator.clipboard.writeText(referralId);
    messageApi.open({
      type: "success",
      content: "Referral ID Copied Successfully!",
    });
  };

  // Button click handler
  const handleButtonClick = (buttonValue) => setActiveButton(buttonValue);

  // Render content based on active button
  const renderContent = () => {
    switch (activeButton) {
      case "redeem":
        return <Redeem />;
      case "send":
        return <Send />;
      case "receive":
        return <Receive />;
      case "tasks":
        return <Tasks />;
      default:
        return <div>Please select an option</div>;
    }
  };

  return (
    <div className="veed">
      {contextHolder}

      {/* Header section */}
      <div className="vhead">
        <div className="veednav">
          <button className="veedlink" onClick={handleSignOut}>SignOut</button>
          <button className="veedlink" onClick={() => navigate("/landing")}>Leaderboard</button>
          <div className="veednav1" onClick={toggleModal}>
            <h3>{user.username}</h3>
            <p>Referral ID</p>
          </div>
        </div>
        <div className="veedcoins">
          <img src={Coins} alt="Coins" />
          <p>{user.coins}</p>
        </div>
      </div>

      {/* Task buttons */}
      <div className="veedtask">
        <div className="veedmenu">
          
          <div className="veedmenu1">
            <button
              className={activeButton === "redeem" ? "veedlink" : "veedlinkmon"}
              onClick={() => handleButtonClick("redeem")}
            >
              Redeem
            </button>
            <button
              className={activeButton === "send" ? "veedlink" : "veedlinkmon"}
              onClick={() => handleButtonClick("send")}
            >
              Send
            </button>
            <button
              className={activeButton === "receive" ? "veedlink" : "veedlinkmon"}
              onClick={() => handleButtonClick("receive")}
            >
              Receive
            </button>
            <button
              className={activeButton === "tasks" ? "veedlink" : "veedlinkmon"}
              onClick={() => handleButtonClick("tasks")}
            >
              Tasks
            </button>
          </div>
        </div>

        {/* Progress Section */}
      <div style={{ paddingTop: "40px",paddingLeft:"20px",paddingRight:"20px", textAlign: "center" }}>
        <h3 className="toolcoin">Progress Bar</h3>
        <Tooltip title={`Current Tier: ${getCurrentTier()}`}>
          <Progress percent={parseInt(calculateProgress())} />
        </Tooltip>
        {user.coins === 2000 ? (<p className="toolcoin">Teir 1 Completed</p>) : user.coins === 2800 ? (<p className="toolcoin">Teir 2 Completed</p>) : user.coins === 3600 ? (<p className="toolcoin">Teir 3 Completed</p>) : user.coins === 5000 ? (<p className="toolcoin">Grand Prize</p>) : (<p></p>)}
      </div>
      
        {/* Render dynamic content */}
        <div className="veedcontent">{renderContent()}</div>
      </div>

      {/* Modal for referral ID */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={toggleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <span className="close" onClick={toggleModal}>&times;</span>
              <h3 style={{ textAlign: "center" }}>{user.username}</h3>
              <p style={{ textAlign: "center" }}>
                Referral ID: <span id="referral-id">{user.referralCode}</span>
                <CopyOutlined
                  onClick={copyToClipboard}
                  style={{ marginLeft: "10px", color: "black", cursor: "pointer" }}
                />
              </p>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default Home;
