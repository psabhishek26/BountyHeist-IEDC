import React, { useContext } from "react";
import "./login.css";
import { GoogleOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, get } from "firebase/database";
import { generateCodeSix } from "../../utils/Utils";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const generateUniqueCode = async () => {
    const db = getDatabase();
    let newCode;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      newCode = generateCodeSix();
      const codeRef = ref(db, `referrals/${newCode}`);
      const snapshot = await get(codeRef);
      if (!snapshot.exists()) {
        return newCode;
      }
      attempts++;
    } while (attempts < maxAttempts);

    throw new Error("Failed to generate a unique code. Please try again.");
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const db = getDatabase();
        const userRef = ref(db, "users/" + user.uid);

        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          const uniqueCode = await generateUniqueCode();

          const userData = {
            username: user.displayName,
            email: user.email,
            uid: user.uid,
            coins: 100,
            referralUsed: false,
            referralCode: uniqueCode,
          };

          await set(ref(db, `users/${user.uid}`), userData);
          await set(ref(db, `referrals/${uniqueCode}`), { uid: user.uid });

          setUser(userData);
        } else {
          const data = snapshot.val();
          setUser(data);
        }

        navigate("/");
        message.success("Login successful!");
      }
    } catch (error) {
      console.error("Google Login error:", error);
      message.error("Google login failed: " + error.message);
    }
  };

  return (
    <div className="loginmotham">
      <div className="headme">
        <h3>Bounty Heist</h3>
        <p>IEDC JECC</p>
      </div>
      <div className="theloginmenu">
        <Button
          block
          type="primary"
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
