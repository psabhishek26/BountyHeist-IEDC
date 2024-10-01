import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing/Landing";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import PrivateRoute from "./components/PrivateRoute";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useEffect, useContext } from "react";
import { UserContext } from "./context/UserContext";
import { getDatabase, ref, onValue } from "firebase/database";
import AddTask from "./pages/AddTask/AddTask";
import AdminRoute from "./components/AdminRoute";
import CoinProgressBar from "./components/CoinProg/CoinProg";

function App() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const db = getDatabase();
        const userRef = ref(db, "users/" + currentUser.uid);

        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUser(data);
          }
        });
      } else {
        setUser(null);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            // <PrivateRoute>
              <ComingSoon />
            // </PrivateRoute>
          }
        />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/prog" element={<CoinProgressBar/>}/>
        <Route path="/coming" element={<ComingSoon />} />
        <Route path="/landing" element={<Landing />} />
        <Route
          path="/addtask"
          element={
            <AdminRoute>
              <AddTask />
            </AdminRoute>
          }
        /> */}
      </Routes>
    </>
  );
}

export default App;
