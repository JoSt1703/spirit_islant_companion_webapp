import React, { useState } from "react";

const elements = [
  { name: "Sun", emoji: "☀️" },
  { name: "Moon", emoji: "🌙" },
  { name: "Fire", emoji: "🔥" },
  { name: "Air", emoji: "🌪️" },
  { name: "Water", emoji: "💧" },
  { name: "Earth", emoji: "🪨" },
  { name: "Plant", emoji: "🌿" },
  { name: "Animal", emoji: "🐾" },
  { name: "Energy", emoji: "⚡" }
];

// For Innate trackers, we exclude Energy.
const innateElements = elements.filter(el => el.name !== "Energy");

export default function SpiritIslandTracker() {
  // Original tracker state (this one resets)
  const [counts, setCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
  );

  // Helper: creates a new innate tracker (without Energy)
  const createInnateTracker = () =>
    innateElements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {});

  // Innate trackers state: start with 0 innate trackers
  const [innateTrackers, setInnateTrackers] = useState([]);

  // Update original tracker counts
  const updateCount = (element, delta) => {
    setCounts(prev => ({
      ...prev,
      [element]: Math.max(0, prev[element] + delta)
    }));
  };

  // Update a specific innate tracker by its index
  const updateInnateTracker = (trackerIndex, element, delta) => {
    setInnateTrackers(prev =>
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
      Sun: 0,
      Moon: 0,
      Fire: 0,
      Air: 0,
      Water: 0,
      Earth: 0,
      Plant: 0,
      Animal: 0,
      Energy: counts["Energy"]
    });
  };

  // Add an innate tracker (max 5)
  const addInnateTracker = () => {
    setInnateTrackers(prev => (prev.length < 5 ? [...prev, createInnateTracker()] : prev));
  };

  // Remove an innate tracker (min 0)
  const removeInnateTracker = () => {
    setInnateTrackers(prev => (prev.length > 0 ? prev.slice(0, prev.length - 1) : prev));
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

      {/* Innate Trackers Section */}
      <div style={{ marginTop: "40px" }}>
        <h2>Innate Trackers</h2>
        <div style={{ marginBottom: "10px" }}>
          <button onClick={removeInnateTracker} disabled={innateTrackers.length === 0}>
            Remove Innate Tracker
          </button>
          <button onClick={addInnateTracker} disabled={innateTrackers.length >= 5} style={{ marginLeft: "10px" }}>
            Add Innate Tracker
          </button>
        </div>
        {innateTrackers.map((tracker, trackerIndex) => (
          <div
            key={trackerIndex}
            style={{
              margin: "20px 0",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "4px"
            }}
          >
            <h3>Innate Tracker #{trackerIndex + 1}</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {innateElements.map(el => (
                <div key={el.name} style={{ margin: "0 10px", textAlign: "center" }}>
                  <div style={{ fontSize: "2em" }}>{el.emoji}</div>
                  <div style={{ fontSize: "1.5em" }}>{tracker[el.name]}</div>
                  <div>
                    <button onClick={() => updateInnateTracker(trackerIndex, el.name, 1)}>+</button>
                    <button onClick={() => updateInnateTracker(trackerIndex, el.name, -1)}>-</button>
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
