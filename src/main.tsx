import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register the self-unregistering SW to clear old hitster-v1 cache
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/prompster-frontend/sw.js");
}
