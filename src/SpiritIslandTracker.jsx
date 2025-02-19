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
    setCounts((prev) => ({
      ...Object.fromEntries(elements.map((el) => [el.name, 0])),
      Energy: prev["Energy"]
    }));
  };

  const [innateTrackers, setInnateTrackers] = useState([]);

  const addInnateTracker = () => {
    setInnateTrackers((prev) =>
      prev.length < 12 ? [...prev, { requirements: {} }] : prev
    );
  };

  const removeInnateTracker = () => {
    setInnateTrackers((prev) => prev.slice(0, -1));
  };

  const updateInnateRequirement = (trackerIndex, element, delta) => {
    setInnateTrackers((prev) =>
      prev.map((tracker, index) => {
        if (index === trackerIndex) {
          const current = tracker.requirements[element] || 0;
          return {
            ...tracker,
            requirements: {
              ...tracker.requirements,
              [element]: Math.max(0, current + delta)
            }
          };
        }
        return tracker;
      })
    );
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <button onClick={resetCounts} style={{ marginBottom: "20px" }}>Reset Elements</button>
      <h2>Element Tracker</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
        {elements.map((el) => (
          <div key={el.name} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2em" }}>{el.emoji}</div>
            <div style={{ fontSize: "1.5em" }}>{counts[el.name]}</div>
            <div>
              <button onClick={() => updateCount(el.name, 1)}>+</button>
              <button onClick={() => updateCount(el.name, -1)}>-</button>
            </div>
          </div>
        ))}
      </div>

      <h2>Innate Trackers</h2>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={removeInnateTracker} disabled={innateTrackers.length === 0}>Remove Innate Tracker</button>
        <button onClick={addInnateTracker} disabled={innateTrackers.length >= 12} style={{ marginLeft: "10px" }}>Add Innate Tracker</button>
      </div>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
        {innateTrackers.map((tracker, trackerIndex) => (
          <div key={trackerIndex} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "4px", minWidth: "200px" }}>
            <h3>Innate #{trackerIndex + 1}</h3>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
              {Object.entries(tracker.requirements).length === 0 ? (
                <p>No element requirements. Add one below.</p>
              ) : (
                Object.entries(tracker.requirements).map(([elementName, reqCount]) => {
                  const element = innateElements.find((el) => el.name === elementName);
                  return (
                    <div key={elementName} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "2em" }}>{element.emoji}</div>
                      <div style={{ fontSize: "1.5em" }}>{reqCount}</div>
                      <div>
                        <button onClick={() => updateInnateRequirement(trackerIndex, elementName, 1)}>+</button>
                        <button onClick={() => updateInnateRequirement(trackerIndex, elementName, -1)}>-</button>
                      </div>
                      <div style={{ fontSize: "1.2em", marginTop: "5px" }}>
                        {counts[elementName] >= reqCount ? <span style={{ color: "green", fontWeight: "bold" }}>✔</span> : <span style={{ color: "red" }}>✘</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <AvailableElementSelector trackerIndex={trackerIndex} tracker={tracker} addElementRequirement={(index, el) => {
              setInnateTrackers(prev => prev.map((t, i) => i === index ? { ...t, requirements: { ...t.requirements, [el]: 0 } } : t));
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AvailableElementSelector({ trackerIndex, tracker, addElementRequirement }) {
  const availableElements = innateElements.filter((el) => !(el.name in tracker.requirements));
  const [selectedElement, setSelectedElement] = useState(availableElements.length > 0 ? availableElements[0].name : "");

  useEffect(() => {
    if (availableElements.length > 0) {
      setSelectedElement(availableElements[0].name);
    } else {
      setSelectedElement("");
    }
  }, [availableElements]);

  return (
    <div style={{ marginTop: "10px" }}>
      {availableElements.length > 0 ? (
        <>
          <select value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
            {availableElements.map((el) => (
              <option key={el.name} value={el.name}>{el.emoji} {el.name}</option>
            ))}
          </select>
          <button onClick={() => addElementRequirement(trackerIndex, selectedElement)}>Add</button>
        </>
      ) : <p>All elements added.</p>}
    </div>
  );
}
