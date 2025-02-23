import React, { useState, useEffect } from "react";

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

const innateElements = elements.filter((el) => el.name !== "Energy");

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

  const [innateTrackers, setInnateTrackers] = useState([]);

  const createInnateTracker = () => ({ requirements: {} });

  const addInnateTracker = () => {
    setInnateTrackers((prev) =>
      prev.length < 12 ? [...prev, createInnateTracker()] : prev
    );
  };

  const removeInnateTracker = () => {
    setInnateTrackers((prev) =>
      prev.length > 0 ? prev.slice(0, prev.length - 1) : prev
    );
  };

  const addElementRequirement = (trackerIndex, element, value) => {
    setInnateTrackers((prev) =>
      prev.map((tracker, index) => {
        if (index === trackerIndex) {
          if (tracker.requirements[element] === undefined) {
            return {
              ...tracker,
              requirements: { ...tracker.requirements, [element]: value }
            };
          }
        }
        return tracker;
      })
    );
  };

  return (
    <div style={{ textAlign: "center", margin: "10px" }}>
      <button onClick={resetCounts} style={{ marginBottom: "10px" }}>
        Reset Elements
      </button>
      <h2>Element Tracker</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {elements.map((el) => (
          <div key={el.name} style={{ margin: "5px", textAlign: "center" }}>
            <div style={{ fontSize: "1.8em" }}>{el.emoji}</div>
            <div style={{ fontSize: "1.2em" }}>{counts[el.name]}</div>
            <div>
              <button onClick={() => updateCount(el.name, 1)}>+</button>
              <button onClick={() => updateCount(el.name, -1)}>-</button>
            </div>
          </div>
        ))}
      </div>

      <h2>Innate Trackers</h2>
      <button onClick={removeInnateTracker} disabled={innateTrackers.length === 0}>
        Remove Innate Tracker
      </button>
      <button onClick={addInnateTracker} disabled={innateTrackers.length >= 12}>
        Add Innate Tracker
      </button>

      {innateTrackers.map((tracker, trackerIndex) => (
        <div key={trackerIndex} style={{ margin: "10px 0", border: "1px solid #ccc", padding: "10px", borderRadius: "4px" }}>
          <h3>Innate Tracker #{trackerIndex + 1}</h3>
          {Object.entries(tracker.requirements).map(([elementName, reqCount]) => (
            <div key={elementName} style={{ margin: "5px", textAlign: "center" }}>
              <div style={{ fontSize: "1.8em" }}>{innateElements.find((el) => el.name === elementName).emoji}</div>
              <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>{reqCount}</div>
            </div>
          ))}
          <AvailableElementSelector
            trackerIndex={trackerIndex}
            tracker={tracker}
            addElementRequirement={addElementRequirement}
          />
        </div>
      ))}
    </div>
  );
}

function AvailableElementSelector({ trackerIndex, tracker, addElementRequirement }) {
  const availableElements = innateElements.filter(
    (el) => !(el.name in tracker.requirements)
  );

  const [selectedElement, setSelectedElement] = useState(availableElements.length > 0 ? availableElements[0].name : "");
  const [selectedValue, setSelectedValue] = useState(1);

  return (
    <div style={{ marginTop: "5px" }}>
      {availableElements.length > 0 ? (
        <>
          <select value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
            {availableElements.map((el) => (
              <option key={el.name} value={el.name}>{el.emoji} {el.name}</option>
            ))}
          </select>
          <input type="number" min="1" value={selectedValue} onChange={(e) => setSelectedValue(parseInt(e.target.value) || 1)} style={{ width: "40px", marginLeft: "5px" }} />
          <button onClick={() => addElementRequirement(trackerIndex, selectedElement, selectedValue)}>
            Add
          </button>
        </>
      ) : (
        <p>All innate elements added.</p>
      )}
    </div>
  );
}
