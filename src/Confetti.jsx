//Confetti.tsx
// npm install react-confetti
// https://github.com/alampros/react-confetti#readme

import React from "react";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

export default () => {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} />;
};

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
