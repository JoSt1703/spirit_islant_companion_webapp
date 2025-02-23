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
        <h2 style={{ fontSize: "1.2em" }}>Innate Trackers</h2>
        <button onClick={removeInnateTracker} disabled={innateTrackers.length === 0} style={{ fontSize: "0.9em" }}>
          Remove Innate Tracker
        </button>
        <button onClick={addInnateTracker} disabled={innateTrackers.length >= 12} style={{ fontSize: "0.9em" }}>
          Add Innate Tracker
        </button>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", flexWrap: "wrap" }}>
          {innateTrackers.map((tracker, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "5px", margin: "5px", flex: "1 0 45%", maxWidth: "200px", boxSizing: "border-box" }}>
              <h3 style={{ fontSize: "1.1em" }}>Innate Tracker #{index + 1}</h3>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "1.3em", marginRight: "5px" }}>{tracker.count}</span>
                <button onClick={() => updateTrackerCount(index, 1)} style={{ fontSize: "0.9em" }}>+</button>
                <button onClick={() => updateTrackerCount(index, -1)} style={{ fontSize: "0.9em" }}>-</button>
              </div>
              <AvailableElementSelector
                trackerIndex={index}
                tracker={tracker}
                addElementRequirement={addElementRequirement}
              />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "5px" }}>
                {Object.entries(tracker.requirements).map(([elementName, reqCount]) => {
                  const hasRequirement = counts[elementName] >= reqCount;
                  return (
                    <div key={elementName} style={{
                      border: `2px solid ${hasRequirement ? 'green' : 'red'}`,
                      borderRadius: '5px',
                      padding: '5px',
                      margin: '5px 0',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: "1.5em" }}>{innateElements.find(el => el.name === elementName).emoji}</div>
                      <div style={{ fontSize: "1.1em" }}>{reqCount}</div>
                      <button onClick={() => removeElementRequirement(index, elementName)} style={{ fontSize: "0.9em" }}>Remove</button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AvailableElementSelector({ trackerIndex, tracker, addElementRequirement }) {
  const availableElements = innateElements.filter(el => !(el.name in tracker.requirements));
  const [selectedElement, setSelectedElement] = useState(availableElements[0]?.name || "");

  useEffect(() => {
    // Set the selected element to the first available element or keep the current selection
    setSelectedElement((prevSelected) =>
      availableElements.length > 0 && availableElements.some(el => el.name === prevSelected) ? prevSelected : availableElements[0]?.name || ""
    );
  }, [availableElements]);

  return (
    <div style={{ marginTop: "5px" }}>
      {availableElements.length > 0 ? (
        <>
          <select value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)} style={{ fontSize: "0.9em" }}>
            {availableElements.map(el => (
              <option key={el.name} value={el.name}>{el.emoji} {el.name}</option>
            ))}
          </select>
          <button onClick={() => addElementRequirement(trackerIndex, selectedElement)} style={{ fontSize: "0.9em" }}>Add</button>
        </>
      ) : <p style={{ fontSize: "0.9em" }}>All innate elements added.</p>}
    </div>
  );
}
