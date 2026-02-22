import React from "react";
import { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "./Confetti";

export default function App() {
  const [dice, setDice] = useState(generateAllNewDice);

  const gameWon = dice.every(
    (die) => die.isHeld && die.value === dice[0].value,
  );

  /*
        Reactive logic: Happens because state changed.
        Correct — because it's reacting to state change.
    */
  useEffect(() => {
    if (gameWon) {
      console.log("You won the game! Tenzieeeeeees!");
    }
  }, [gameWon]);

  function generateAllNewDice() {
    return Array.from({ length: 10 }, () => ({
      // Call this inline function to create n dies where n = length
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
      id: nanoid(),
    }));
  }

  const hold = (id) => {
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die,
      ),
    );
  };

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      isHeld={die.isHeld}
      value={die.value}
      hold={() => hold(die.id)}
    />
  ));

  const rollDice = () => {
    /* Event driven function and not Declarative React Style just 
     like gameWon 
     function above but correct because reset is user-triggered.*/
    if (gameWon) {
      setDice(generateAllNewDice());
      return;
    }

    setDice((prevDice) =>
      prevDice.map((die) =>
        die.isHeld ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 },
      ),
    );
  };

  return (
    <main>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      {gameWon && <Confetti />}
      <button className="roll-dice" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

/*

Here is your **React Mental Model Cheat Sheet** — using Tenzies + the spreadsheet analogy.

---

# 🧠 1. The Core Law of React

> **UI is a function of state.**

Mathematically:

```
UI = f(state)
```

In Tenzies:

```
dice  →  rendered <Die /> components
```

You do NOT manually update the UI.

You update state → React re-renders → UI updates automatically.

---

# 📊 Spreadsheet Analogy (The Best Mental Model)

Imagine:

* Column A = dice values
* Column B = whether dice are held
* Cell C1 = formula checking if game is won

If you change Column A or B…

C1 updates automatically.

You don’t manually update C1.

That’s React.

```
State changes
     ↓
Component re-renders
     ↓
Derived values recalculate
     ↓
UI updates
```

---

# 🧱 2. Two Types of Data

This is critical.

## 1️⃣ Source of Truth (State)

Stored with `useState`.

Example:

```js
const [dice, setDice] = useState(...)
```

This is the raw data.

---

## 2️⃣ Derived Data (Calculated from State)

Example:

```js
const gameWon = dice.every(...)
```

This should NOT be stored in state.

Why?

Because if you store:

* dice
* gameWon

Now you must manually keep them in sync.

That creates bugs.

---

# 🔥 Golden Rule

> If something can be calculated from existing state, do NOT store it in state.

---

# 🎯 3. Render Logic vs Side Effects

This is where many people get confused.

## 🟢 Render Logic

Pure calculations based on state.

Examples:

* `gameWon`
* `diceElements`
* conditional rendering

These belong directly in the component body.

They run every render.

They should be pure.

---

## 🔴 Side Effects

Things outside React’s pure rendering world:

* console.log
* network requests
* timers
* localStorage
* DOM focus
* animations
* playing sounds

These belong in `useEffect`.

Mental rule:

> If it touches the outside world, it’s a side effect.

---

# 🧠 4. State Updates Are Asynchronous

This is where you had your “trap moment.”

When you do:

```js
setDice(...)
checkGameWinningStatus()
```

The state has NOT updated yet.

React works like this:

```
Call setState
     ↓
React schedules update
     ↓
Function continues running
     ↓
React re-renders later
```

So you never immediately read state after setting it.

Instead, you derive values during render.

---

# 🏗 5. Correct Flow in Tenzies

Here’s the clean architecture:

### User clicks Roll

```
rollDice()
    ↓
setDice(...)
    ↓
React re-renders
    ↓
gameWon recalculates
    ↓
UI updates
```

You never manually sync `gameWon`.

It recalculates automatically.

---

# 👤 6. The “Key” Analogy (Human Identity)

Keys are like passports.

If React uses index as key:

It’s like identifying people by seat number.

If people shuffle seats:

React thinks the same person changed identity.

If you use `id`:

It’s like identifying people by passport.

They can move seats — identity stays consistent.

---

# 🧼 7. Don’t Mirror State

Bad pattern:

```js
const [gameWon, setGameWon] = useState(false)
```

And then manually updating it.

Now you have two sources of truth:

* dice
* gameWon

That’s duplication.

Better:

```js
const gameWon = ...
```

Single source of truth.

Always.

---

# 🧩 8. Event Logic vs Reactive Logic

## Event-driven logic

Happens because user did something.

Example:

```js
function rollDice() {
    if (gameWon) {
        setDice(generateAllNewDice())
        return
    }
}
```

Correct — because reset is user-triggered.

---

## Reactive logic

Happens because state changed.

Example:

```js
useEffect(() => {
    if (gameWon) {
        playSound()
    }
}, [gameWon])
```

Correct — because it's reacting to state change.

---

# 🧠 9. Think Declaratively, Not Imperatively

Imperative thinking:

```
Update this
Then update that
Then check this
Then change that
```

Declarative thinking:

```
Given this state,
UI should look like this.
```

React is declarative.

You describe what the UI should be for a given state.

React handles the how.

---

# 🏁 10. The Final Mental Model

Here is React in one diagram:

```
           USER ACTION
                ↓
          setState()
                ↓
        React schedules update
                ↓
          Component re-renders
                ↓
     Derived values recalculate
                ↓
             UI updates
                ↓
        useEffect runs (if needed)
```

Notice:

* You never manually update UI.
* You never manually sync derived values.
* You never read state immediately after setting it.
* You keep one source of truth.

---

# 🧠 The 5 Laws of Clean React

1. UI = f(state)
2. Keep a single source of truth
3. Don’t store derived data
4. Separate render logic from side effects
5. Let re-renders do the synchronization

---

You are no longer just following Scrimba.

You are now thinking in React architecture.

If you re-read this a few times while building small projects, React will feel natural instead of mechanical.

If you want, I can next give you:

* A “common beginner mistakes” checklist
* Or a “how to think like a senior React dev” guide

*/

/*

This is an excellent architectural question. You’re now distinguishing between:

* Declarative rendering
* Side effects

Let’s break it cleanly.

---

# ✅ Short Answer

Your declarative version is **correct**:

```jsx
{gameWon && <Confetti />}
```

You do NOT need `useEffect` to render confetti.

---

# 🧠 Why?

Because showing `<Confetti />` is **UI**.

And UI must be a function of state.

You are saying:

> If `gameWon` is true, the UI should include Confetti.

That is pure declarative React.

---

# 🔥 Important Distinction

There are two different things here:

## 🟢 1️⃣ Rendering a component (UI)

```jsx
{gameWon && <Confetti />}
```

This is not a side effect.

This is just conditional rendering.

It belongs in render.

---

## 🔴 2️⃣ Triggering something external

Examples:

* Play a sound
* Send analytics
* Start a timer
* Manipulate DOM manually

Those belong in `useEffect`.

---

# 🎯 So What About Animation?

You asked:

> Is it like playing a sound?

No.

Because the animation is happening *inside the component*.

You're not manually starting it.

You're just mounting a component.

When React mounts `<Confetti />`, that library handles animation internally.

From your component’s perspective, it's just UI.

---

# 🧠 The Correct Mental Model

Think like this:

If something can be expressed as:

> “When state looks like this, UI should look like this.”

→ It belongs in render.

If something is:

> “When state changes, run some imperative code.”

→ It belongs in `useEffect`.

---

# 🏗 In Your Case

This is perfect:

```jsx
{gameWon && <Confetti />}
```

And this is perfect:

```jsx
<button>
    {gameWon ? "New Game" : "Roll"}
</button>
```

Both are pure UI decisions.

---

# 🚨 When WOULD you use useEffect here?

If you wanted:

* Confetti to show for only 3 seconds
* Then automatically disappear

Then you'd need:

```js
useEffect(() => {
    if (gameWon) {
        const timer = setTimeout(() => {
            setShowConfetti(false)
        }, 3000)

        return () => clearTimeout(timer)
    }
}, [gameWon])
```

Because now you're using timers (side effect).

---

# 🧠 Final Clean Rule

Mounting/unmounting a component = declarative.

Manually triggering something = side effect.

---

# 🎯 Your Code Verdict

This is architecturally correct React:

```jsx
{gameWon && <Confetti />}
```

You are thinking declaratively.

And that means React is clicking for you.

---

Let me test your depth:

If the Confetti library required you to manually call `startConfetti()` when the game is won…

Would that belong in render or `useEffect`?
useEffect

Correct. ✅

And here’s *why*, so it’s fully locked in your brain:

If the library required something like:

```js
startConfetti()
```

that is **imperative code**.

It is not describing UI.

It is telling the system to *do something*.

That makes it a **side effect**.

So the correct place would be:

```js
useEffect(() => {
    if (gameWon) {
        startConfetti()
    }
}, [gameWon])
```

Why?

Because:

* `gameWon` changes
* React re-renders
* After render commits
* `useEffect` runs
* Imperative code executes safely

---

# The Big Separation (Burn This Into Memory)

### Render phase:

* Pure
* No side effects
* No mutations
* Just describe UI

### Effect phase:

* Imperative
* External interactions
* Timers
* Sounds
* Animations (if manually triggered)
* Subscriptions

---

# Why Not Call `startConfetti()` Inside Render?

Because render must stay pure.

If you did:

```js
if (gameWon) {
    startConfetti()
}
```

That would:

* Run on every render
* Potentially run multiple times
* Break React’s purity model
* Cause unpredictable behavior

Render = description
Effect = execution

---

*/

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
