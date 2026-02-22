import React from "react";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  return (
    <button style={styles} onClick={props.hold}>
      {props.value}
    </button>
  );
}

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
