import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

/*

tenzies-react-app-js/
│
├── index.html
├── package.json
├── vite.config.js
├── node_modules/
│
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── Die.jsx
    ├── Confetti.jsx
    ├── index.css
    └── assets/        (optional — only if you add images later)


*/
