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

// For enate trackers, we exclude Energy.
const enateElements = elements.filter(el => el.name !== "Energy");

export default function SpiritIslandTracker() {
  // Original tracker state (this one resets)
  const [counts, setCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
  );

  // Helper: creates a new enate tracker (without Energy)
  const createEnateTracker = () =>
    enateElements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {});

  // Enate trackers state: start with 0 enate trackers
  const [enateTrackers, setEnateTrackers] = useState([]);

  // Update original tracker counts
  const updateCount = (element, delta) => {
    setCounts(prev => ({
      ...prev,
      [element]: Math.max(0, prev[element] + delta)
    }));
  };

  // Update a specific enate tracker by its index
  const updateEnateTracker = (trackerIndex, element, delta) => {
    setEnateTrackers(prev =>
      prev.map((tracker, index) =>
        index === trackerIndex
          ? { ...tracker, [element]: Math.max(0, tracker[element] + delta) }
          : tracker
      )
    );
  };

  // Reset the original tracker (leaving Energy unchanged on purpose)
  const resetCounts = () => {
    setCounts({
      Fire: 0,
      Water: 0,
      Earth: 0,
      Air: 0,
      Sun: 0,
      Moon: 0,
      Plant: 0,
      Animal: 0,
      Energy: counts["Energy"]
    });
  };

  // Add an enate tracker (max 5)
  const addEnateTracker = () => {
    setEnateTrackers(prev => (prev.length < 5 ? [...prev, createEnateTracker()] : prev));
  };

  // Remove an enate tracker (min 0)
  const removeEnateTracker = () => {
    setEnateTrackers(prev => (prev.length > 0 ? prev.slice(0, prev.length - 1) : prev));
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      {/* Reset Button resets only the original tracker */}
      <button onClick={resetCounts} style={{ marginBottom: "20px" }}>
        Reset Elements
      </button>

      {/* Original Tracker */}
      <div>
        <h2>Element Tracker</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {elements.map(el => (
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

      {/* Enate Trackers Section */}
      <div style={{ marginTop: "40px" }}>
        <h2>Enate Trackers</h2>
        <div style={{ marginBottom: "10px" }}>
          <button onClick={removeEnateTracker} disabled={enateTrackers.length === 0}>
            Remove Enate Tracker
          </button>
          <button onClick={addEnateTracker} disabled={enateTrackers.length >= 5} style={{ marginLeft: "10px" }}>
            Add Enate Tracker
          </button>
        </div>
        {enateTrackers.map((tracker, trackerIndex) => (
          <div
            key={trackerIndex}
            style={{
              margin: "20px 0",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "4px"
            }}
          >
            <h3>Enate Tracker #{trackerIndex + 1}</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {enateElements.map(el => (
                <div key={el.name} style={{ margin: "0 10px", textAlign: "center" }}>
                  <div style={{ fontSize: "2em" }}>{el.emoji}</div>
                  <div style={{ fontSize: "1.5em" }}>{tracker[el.name]}</div>
                  <div>
                    <button onClick={() => updateEnateTracker(trackerIndex, el.name, 1)}>+</button>
                    <button onClick={() => updateEnateTracker(trackerIndex, el.name, -1)}>-</button>
                  </div>
                  {/* Fulfillment indicator */}
                  <div style={{ fontSize: "1.2em", marginTop: "5px" }}>
                    {counts[el.name] >= tracker[el.name] ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>✔</span>
                    ) : (
                      <span style={{ color: "red" }}>✘</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
