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
    const spirit = spiritsData[spiritName];
    setSelectedSpirit(spiritName);
    setInnateRequirements(spirit ? spirit : []); // Set to the spirit's innates or an empty array
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
          {Object.keys(spiritsData).map((spiritName) => (
            <option key={spiritName} value={spiritName}>{spiritName}</option>
          ))}
        </select>
      </div>
      {selectedSpirit && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "1.2em" }}>Innate Requirements for {selectedSpirit}</h2>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {innateRequirements.length > 0 ? (
              innateRequirements.map((innate, index) => (
                <div key={index} style={{ margin: "10px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", width: "300px" }}>
                  <h3 style={{ fontSize: "1.1em" }}>{innate.Innate}</h3>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    {innate.Thresholds.map((threshold, thresholdIndex) => (
                      <div key={thresholdIndex} style={{ marginBottom: "5px", padding: "5px", border: "1px solid #ddd", borderRadius: "5px", width: "100%" }}>
                        <h4 style={{ fontSize: "1em" }}>Threshold {thresholdIndex + 1}</h4>
                        {threshold.Elements.map((elem, elemIndex) => {
                          const hasRequirement = counts[elem.Element] >= elem.Quantity;
                          return (
                            <div key={elemIndex} style={{
                              border: `2px solid ${hasRequirement ? 'green' : 'red'}`,
                              borderRadius: '5px',
                              padding: '5px',
                              margin: '5px 0',
                              textAlign: 'center'
                            }}>
                              <div style={{ fontSize: "1.5em" }}>{elements.find(el => el.name === elem.Element)?.emoji || ''}</div>
                              <div style={{ fontSize: "1.1em" }}>{elem.Quantity}</div> {}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No innate requirements available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritIslandTracker;
