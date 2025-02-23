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

  const addInnateTracker = () => {
    setInnateTrackers((prev) =>
      prev.length < 12 ? [...prev, { count: 0, requirements: {} }] : prev
    );
  };

  const removeInnateTracker = () => {
    setInnateTrackers((prev) => prev.slice(0, prev.length - 1));
  };

  const updateTrackerCount = (index, delta) => {
    setInnateTrackers((prev) =>
      prev.map((tracker, i) =>
        i === index ? { ...tracker, count: Math.max(0, tracker.count + delta) } : tracker
      )
    );
  };

  const addElementRequirement = (trackerIndex, element) => {
    setInnateTrackers((prev) =>
      prev.map((tracker, index) => {
        if (index === trackerIndex && !(element in tracker.requirements)) {
          return {
            ...tracker,
            requirements: { ...tracker.requirements, [element]: tracker.count }
          };
        }
        return tracker;
      })
    );
  };

  const removeElementRequirement = (trackerIndex, element) => {
    setInnateTrackers((prev) =>
      prev.map((tracker, index) => {
        if (index === trackerIndex) {
          const newRequirements = { ...tracker.requirements };
          delete newRequirements[element];
          return { ...tracker, requirements: newRequirements };
        }
        return tracker;
      })
    );
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <button onClick={resetCounts} style={{ marginBottom: "20px" }}>
        Reset Elements
      </button>
      <div>
        <h2>Element Tracker</h2>
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
      <div style={{ marginTop: "40px" }}>
        <h2>Innate Trackers</h2>
        <button onClick={removeInnateTracker} disabled={innateTrackers.length === 0}>
          Remove Innate Tracker
        </button>
        <button onClick={addInnateTracker} disabled={innateTrackers.length >= 12}>
          Add Innate Tracker
        </button>
        {innateTrackers.map((tracker, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "20px 0" }}>
            <h3>Innate Tracker #{index + 1}</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.5em", marginRight: "10px" }}>{tracker.count}</span>
              <button onClick={() => updateTrackerCount(index, 1)}>+</button>
              <button onClick={() => updateTrackerCount(index, -1)}>-</button>
            </div>
            <AvailableElementSelector
              trackerIndex={index}
              tracker={tracker}
              addElementRequirement={addElementRequirement}
            />
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              {Object.entries(tracker.requirements).map(([elementName, reqCount]) => (
                <div key={elementName} style={{ margin: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "2em" }}>{innateElements.find(el => el.name === elementName).emoji}</div>
                  <div style={{ fontSize: "1.5em" }}>{reqCount}</div>
                  <button onClick={() => removeElementRequirement(index, elementName)}>Remove</button>
                  {/* Add the indicator below the element */}
                  {counts[elementName] >= reqCount ? (
                    <div style={{ color: 'green' }}>🟢</div>
                  ) : (
                    <div style={{ color: 'red' }}>🔴</div> 
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvailableElementSelector({ trackerIndex, tracker, addElementRequirement }) {
  const availableElements = innateElements.filter(el => !(el.name in tracker.requirements));
  const [selectedElement, setSelectedElement] = useState(availableElements[0]?.name || "");

  useEffect(() => {
    setSelectedElement(availableElements[0]?.name || "");
  }, [availableElements]);

  return (
    <div style={{ marginTop: "10px" }}>
      {availableElements.length > 0 ? (
        <>
          <select value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
            {availableElements.map(el => (
              <option key={el.name} value={el.name}>{el.emoji} {el.name}</option>
            ))}
          </select>
          <button onClick={() => selectedElement && addElementRequirement(trackerIndex, selectedElement)}>Add</button>
        </>
      ) : <p>All innate elements added.</p>}
    </div>
  );
}
