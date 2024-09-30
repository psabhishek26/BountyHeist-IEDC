import React, { useState, useEffect } from "react";
import { Modal } from "antd";

function PortraitOnly({ children }) {
  const [isPortrait, setIsPortrait] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortraitMode = window.matchMedia("(orientation: portrait)").matches;
      if (!isPortraitMode) {
        setIsPortrait(false);
        setIsModalVisible(true);
      } else {
        setIsPortrait(true);
        setIsModalVisible(false);
      }
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {isPortrait ? (
        children
      ) : (
        <>
          <Modal
            title="Portrait Mode Only"
            visible={isModalVisible}
            onOk={handleOk}
            cancelButtonProps={{ style: { display: "none" } }}
            closable={false}
          >
            <p>This website is only accessible in portrait mode.</p>
          </Modal>
        </>
      )}
    </>
  );
}

export default PortraitOnly;