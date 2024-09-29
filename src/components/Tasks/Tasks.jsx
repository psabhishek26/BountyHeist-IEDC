import React, { useContext, useEffect, useState } from "react";
import "./tasks.css";
import Coins from "../../img/coins.png";
import { Flex, Input, message, Spin } from "antd";
import { UserContext } from "../../context/UserContext";
import { getDatabase, ref, get, update } from "firebase/database";

const Tasks = () => {
  const { user, setUser } = useContext(UserContext);
  const [code, setCode] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const db = getDatabase();
      const tasksRef = ref(db, "tasks");
      try {
        const snapshot = await get(tasksRef);
        if (snapshot.exists()) {
          const tasksData = snapshot.val();
          const tasksArray = Object.keys(tasksData).map((key) => ({
            id: key,
            ...tasksData[key],
          }));
          setTasks(tasksArray);
        } else {
          message.warning("No tasks found.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        message.error("Failed to fetch tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async () => {
    message.success("Loading...");
    if (user.referralUsed) {
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

  const handleComplete = async (task) => {
    message.success("Loading...");
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);

    try {
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      const updatedCoins = (userData.coins || 0) + parseInt(task.taskPoints);
      window.location.href = task.redirectLink;

      await update(userRef, {
        coins: updatedCoins,
        completedTasks: [...(userData.completedTasks || []), task.id],
      });

      setUser((prevUser) => ({
        ...prevUser,
        coins: updatedCoins,
        completedTasks: [...(prevUser.completedTasks || []), task.id],
      }));

      message.success(`Task completed! You earned ${task.taskPoints} coins.`);
    } catch (error) {
      console.error("Error completing task:", error);
      message.error("Failed to complete task. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <Spin size="large"></Spin>
      </div>
    );
  }

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

      <p className="taskup">
        Complete the following tasks to receive even more rewards
      </p>

      <div className="taskgrid">
        {tasks.map((task) => (
          <div
            className={`taskind ${
              user.completedTasks?.includes(task.id) ? "completed" : ""
            }`}
            key={task.id}
          >
            <h3>{task.taskName}</h3>
            <div className="tcoin">
              <img src={Coins} alt="Coins image" />
              <p>{task.taskPoints}</p>
            </div>
            <p>{task.taskDescription}</p>
            <button
              className="comp"
              onClick={() => handleComplete(task)}
              disabled={user.completedTasks?.includes(task.id)}
            >
              {user.completedTasks?.includes(task.id)
                ? "Completed"
                : "Complete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
