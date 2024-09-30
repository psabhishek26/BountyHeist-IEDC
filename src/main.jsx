import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.jsx";
import { BrowserRouter } from "react-router-dom";
import PortraitOnly from "./components/PortraitOnly/PortraitOnly.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PortraitOnly>
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </PortraitOnly>
  </StrictMode>
);
