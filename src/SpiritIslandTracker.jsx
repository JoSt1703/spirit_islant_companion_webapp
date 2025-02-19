import React, { useState } from "react";

const elements = [
  { name: "Fire", emoji: "🔥" },
  { name: "Water", emoji: "💧" },
  { name: "Earth", emoji: "🪨" },
  { name: "Air", emoji: "🌪️" },
  { name: "Sun", emoji: "☀️" },
  { name: "Moon", emoji: "🌙" },
  { name: "Plant", emoji: "🌿" },
  { name: "Animal", emoji: "🐾" },
  { name: "Energy", emoji: "⚡" }
];

export default function SpiritIslandTracker() {
  // Original tracker state (this one resets)
  const [counts, setCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
  );
  
  // Enate tracker state (this one persists through resets)
  const [enateCounts, setEnateCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
  );

  // Update functions for both trackers
  const updateCount = (element, delta) => {
    setCounts((prev) => ({
      ...prev,
      [element]: Math.max(0, prev[element] + delta)
    }));
  };

  const updateEnateCount = (element, delta) => {
    setEnateCounts((prev) => ({
      ...prev,
      [element]: Math.max(0, prev[element] + delta)
    }));
  };

  const resetCounts = () => {
    setCounts((prev) => ({
      ...prev,
      Fire: 0,
      Water: 0,
      Earth: 0,
      Air: 0,
      Sun: 0,
      Moon: 0,
      Plant: 0,
      Animal: 0,
      // energy left out on purpouse
    }));
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      {/* Reset Button resets only the original tracker */}
      <button onClick={resetCounts} style={{ marginBottom: "20px" }}>
        Reset Elements
      </button>
      
      {/* Original Tracker Row */}
      <div>
        <h2>Original Tracker</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {elements.map((el) => (
            <div key={el.name} style={{ margin: "0 10px", textAlign: "center" }}>
              <div style={{ fontSize: "2em" }}>{el.emoji}</div>
              <div style={{ fontSize: "1.5em" }}>{counts[el.name]}</div>
              <div>
                <button onClick={() => updateCount(el.name, 1)}>+</button>
                <button onClick={() => updateCount(el.name, -1)}>-</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Enate Tracker Row */}
      <div style={{ marginTop: "40px" }}>
        <h2>Enate Tracker</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {elements.map((el) => (
            <div key={el.name} style={{ margin: "0 10px", textAlign: "center" }}>
              <div style={{ fontSize: "2em" }}>{el.emoji}</div>
              <div style={{ fontSize: "1.5em" }}>{enateCounts[el.name]}</div>
              <div>
                <button onClick={() => updateEnateCount(el.name, 1)}>+</button>
                <button onClick={() => updateEnateCount(el.name, -1)}>-</button>
              </div>
              {/* Fulfillment indicator */}
              <div style={{ fontSize: "1.2em", marginTop: "5px" }}>
                {counts[el.name] >= enateCounts[el.name] ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>✔</span>
                ) : (
                  <span style={{ color: "red" }}>✘</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
