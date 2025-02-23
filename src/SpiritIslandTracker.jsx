import React, { useState, useEffect } from "react";
import spiritsData from './spirits.json'; // Make sure to adjust the path as necessary

const elements = [
  { name: "Energy", emoji: "⚡" },
  { name: "Sun", emoji: "☀️" },
  { name: "Moon", emoji: "🌙" },
  { name: "Fire", emoji: "🔥" },
  { name: "Air", emoji: "🌪️" },
  { name: "Water", emoji: "💧" },
  { name: "Earth", emoji: "🪨" },
  { name: "Plant", emoji: "🌿" },
  { name: "Animal", emoji: "🐾" },
  { name: "Wild Card", emoji: "🃏" }
];

export default function SpiritIslandTracker() {
  const [counts, setCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
  );

  const updateCount = (element, delta) => {
    setCounts((prev) => ({
      ...prev,
      [element]: Math.max(0, prev[element] + delta)
    }));
  };

  const resetCounts = () => {
    setCounts({
      Energy: counts["Energy"],
      Sun: 0,
      Moon: 0,
      Fire: 0,
      Air: 0,
      Water: 0,
      Earth: 0,
      Plant: 0,
      Animal: 0,
      "Wild Card": 0
    });
  };

  const [selectedInnate, setSelectedInnate] = useState(null);

  useEffect(() => {
    // Determine the current innate based on available elements and their thresholds
    const matchedInnate = Object.entries(spiritsData).find(([name, data]) => {
      return data[0].Thresholds.some(threshold => {
        return threshold.Elements.every(({ Element, Quantity }) => {
          return counts[Element] >= Quantity;
        });
      });
    });
    setSelectedInnate(matchedInnate ? matchedInnate[0] : null);
  }, [counts]);

  return (
    <div style={{ textAlign: "center", margin: "10px", overflowX: "auto" }}>
      <button onClick={resetCounts} style={{ marginBottom: "10px", fontSize: "0.9em" }}>
        Reset Elements
      </button>
      <div>
        <h2 style={{ fontSize: "1.2em" }}>Element Tracker</h2>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {elements.map((el) => (
            <div key={el.name} style={{ margin: "5px", textAlign: "center", flex: "1 0 9%", maxWidth: "60px" }}>
              <div style={{ fontSize: "1.5em" }}>{el.emoji}</div>
              <div style={{ fontSize: "1.1em" }}>{counts[el.name]}</div>
              <div>
                <button onClick={() => updateCount(el.name, 1)} style={{ fontSize: "0.9em" }}>+</button>
                <button onClick={() => updateCount(el.name, -1)} style={{ fontSize: "0.9em" }}>-</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "1.2em" }}>Selected Innate Ability</h2>
        {selectedInnate ? (
          <div style={{ border: "1px solid #ccc", padding: "5px", margin: "5px", textAlign: "center" }}>
            <h3>{selectedInnate}</h3>
            <p>{spiritsData[selectedInnate][0].Innate}</p>
          </div>
        ) : (
          <p>No innate ability selected. Increase elemental counts to unlock abilities!</p>
        )}
      </div>
    </div>
  );
}
