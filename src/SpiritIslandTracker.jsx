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

const initialEnateRows = Array(8).fill({ element: "Fire", required: 0 });

export default function SpiritIslandTracker() {
  const [counts, setCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
  );

  const [enateRows, setEnateRows] = useState(initialEnateRows);

  const updateCount = (element, delta) => {
    setCounts((prev) => ({
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
      // Keep Energy unchanged
    }));
  };

  const handleEnateChange = (index, value) => {
    const newRows = [...enateRows];
    newRows[index].required = Math.max(0, Number(value)); 
    setEnateRows(newRows);
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      {/* Total Count Display */}
      <h2>Total Count: {Object.values(counts).reduce((acc, count) => acc + count, 0)}</h2>
      
      {/* Reset Button at the Top */}
      <button onClick={resetCounts} style={{ marginBottom: "20px" }}>
        Reset Elements
      </button>
      
      {/* Element Tracker */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {elements.map((el) => (
          <div key={el.name} style={{ margin: "0 10px", textAlign: "center" }}>
            <div style={{ fontSize: "2em" }}>{el.emoji}</div>
            <div style={{ fontSize: "1.5em" }}>{counts[el.name]}</div>
            <div>
              <button onClick={() => updateCount(el.name, 1)} aria-label={`Increase ${el.name} count`} style={{ margin: "5px" }}>+</button>
              <button onClick={() => updateCount(el.name, -1)} aria-label={`Decrease ${el.name} count`} style={{ margin: "5px" }}>-</button>
            </div>
          </div>
        ))}
      </div>

      {/* Enate Requirements Tracker */}
      <h3>Enate Requirements</h3>
      {enateRows.map((row, index) => (
        <div key={index} style={{ margin: "10px 0" }}>
          <select
            value={row.element}
            onChange={(e) => {
              const newRows = [...enateRows];
              newRows[index].element = e.target.value;
              setEnateRows(newRows);
            }}
          >
            {elements.map((el) => (
              <option key={el.name} value={el.name}>{el.name}</option>
            ))}
          </select>
          <input
            type="number"
            value={row.required}
            onChange={(e) => handleEnateChange(index, e.target.value)}
            style={{ margin: "0 10px", width: "50px" }}
          />
          <span>
            {counts[row.element] >= row.required 
              ? "✅ Met Requirement" 
              : `❌ Requires ${row.required}, Current: ${counts[row.element]}`}
          </span>
        </div>
      ))}
    </div>
  );
}
