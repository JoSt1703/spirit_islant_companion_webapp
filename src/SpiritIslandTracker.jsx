import React, { useState } from "react";
import spiritsData from "./spirits.json"; // Adjust the path as necessary

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

const SpiritIslandTracker = () => {
  const [counts, setCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
  );
  const [selectedSpirit, setSelectedSpirit] = useState(null);
  const [innateRequirements, setInnateRequirements] = useState([]);

  const updateCount = (element, delta) => {
    setCounts((prev) => ({
      ...prev,
      [element]: Math.max(0, prev[element] + delta)
    }));
  };

  const resetCounts = () => {
    setCounts((prev) => ({
      ...prev,
      Sun: 0,
      Moon: 0,
      Fire: 0,
      Air: 0,
      Water: 0,
      Earth: 0,
      Plant: 0,
      Animal: 0,
      "Wild Card": 0
    }));
  };

  const handleSpiritChange = (event) => {
    const spiritName = event.target.value;
    const spirit = spiritsData.Spirits.find((sp) => sp.name === spiritName);
    setSelectedSpirit(spirit);
    setInnateRequirements(spirit ? spirit.innates : []);
  };

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
        <h2 style={{ fontSize: "1.2em" }}>Select Spirit</h2>
        <select onChange={handleSpiritChange} style={{ fontSize: "0.9em" }}>
          <option value="">Select a Spirit</option>
          {spiritsData.Spirits.map((spirit) => (
            <option key={spirit.name} value={spirit.name}>{spirit.name}</option>
          ))}
        </select>
      </div>
      {selectedSpirit && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "1.2em" }}>Innate Requirements for {selectedSpirit.name}</h2>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {innateRequirements.map((innate, index) => (
              <div key={index} style={{ marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", width: "300px" }}>
                <h3 style={{ fontSize: "1.1em" }}>{innate.name}</h3>
                {innate.thresholds.map((threshold, thresholdIndex) => (
                  <div key={thresholdIndex} style={{ marginBottom: "5px" }}>
                    {Object.entries(threshold).map(([elementName, reqCount]) => {
                      const hasRequirement = counts[elementName] >= reqCount;
                      return (
                        <div key={elementName} style={{
                          border: `2px solid ${hasRequirement ? 'green' : 'red'}`,
                          borderRadius: '5px',
                          padding: '5px',
                          margin: '5px 0',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: "1.5em" }}>{elements.find(el => el.name === elementName).emoji}</div>
                          <div style={{ fontSize: "1.1em" }}>Required: {reqCount} | Current: {counts[elementName]}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritIslandTracker;
