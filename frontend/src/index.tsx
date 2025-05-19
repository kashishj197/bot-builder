import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
document.documentElement.classList.add("dark");
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
