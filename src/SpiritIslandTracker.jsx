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

// For innate trackers, we exclude Energy.
const innateElements = elements.filter((el) => el.name !== "Energy");

export default function SpiritIslandTracker() {
  // Global (original) tracker state
  const [counts, setCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
  );

  // Update global element counts
  const updateCount = (element, delta) => {
    setCounts((prev) => ({
      ...prev,
      [element]: Math.max(0, prev[element] + delta)
    }));
  };

  // Reset global tracker (Energy remains unchanged)
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

  // Innate trackers state:
  // Each tracker now holds a "requirements" object.
  // Only elements that have been added as requirements will be present.
  const [innateTrackers, setInnateTrackers] = useState([]);

  // Create a new innate tracker with no requirements initially.
  const createInnateTracker = () => ({ requirements: {} });

  // Add/Remove entire innate tracker (max 12)
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

  // Update a specific requirement's count for a given tracker
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

  // Add an element requirement to an innate tracker
  const addElementRequirement = (trackerIndex, element) => {
    setInnateTrackers((prev) =>
      prev.map((tracker, index) => {
        if (index === trackerIndex) {
          // Only add if it's not already present
          if (tracker.requirements[element] === undefined) {
            return {
              ...tracker,
              requirements: { ...tracker.requirements, [element]: 0 }
            };
          }
        }
        return tracker;
      })
    );
  };

  // Remove an element requirement from an innate tracker
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
      {/* Global Tracker Section */}
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

      {/* Innate Trackers Section */}
      <div style={{ marginTop: "40px" }}>
        <h2>Innate Trackers</h2>
        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={removeInnateTracker}
            disabled={innateTrackers.length === 0}
          >
            Remove Innate Tracker
          </button>
          <button
            onClick={addInnateTracker}
            disabled={innateTrackers.length >= 12} // Changed max limit to 12
            style={{ marginLeft: "10px" }}
          >
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
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              {Object.keys(tracker.requirements).length === 0 ? (
                <p>No element requirements. Add one below.</p>
              ) : (
                Object.entries(tracker.requirements).map(
                  ([elementName, reqCount]) => {
                    const element = innateElements.find(
                      (el) => el.name === elementName
                    );
                    return (
                      <div
                        key={elementName}
                        style={{ margin: "0 10px", textAlign: "center" }}
                      >
                        <div style={{ fontSize: "2em" }}>{element.emoji}</div>
                        <div style={{ fontSize: "1.5em" }}>{reqCount}</div>
                        <div>
                          <button
                            onClick={() =>
                              updateInnateRequirement(trackerIndex, elementName, 1)
                            }
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              updateInnateRequirement(trackerIndex, elementName, -1)
                            }
                          >
                            -
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() =>
                              removeElementRequirement(trackerIndex, elementName)
                            }
                          >
                            Remove
                          </button>
                        </div>
                        {/* Fulfillment indicator */}
                        <div style={{ fontSize: "1.2em", marginTop: "5px" }}>
                          {counts[elementName] >= reqCount ? (
                            <span style={{ color: "green", fontWeight: "bold" }}>
                              ✔
                            </span>
                          ) : (
                            <span style={{ color: "red" }}>✘</span>
                          )}
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
            {/* Dropdown to add new element requirements */}
            <AvailableElementSelector
              trackerIndex={trackerIndex}
              tracker={tracker}
              addElementRequirement={addElementRequirement}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AvailableElementSelector({ trackerIndex, tracker, addElementRequirement }) {
  const availableElements = innateElements.filter(
    (el) => !(el.name in tracker.requirements)
  );

  const [selectedElement, setSelectedElement] = useState("");

  // Ensure the dropdown has a valid initial selection when available elements change
  useEffect(() => {
    if (availableElements.length > 0) {
      setSelectedElement(availableElements[0].name);
    }
  }, [availableElements]);

  return (
    <div style={{ marginTop: "10px" }}>
      {availableElements.length > 0 ? (
        <>
          <select
            value={selectedElement}
            onChange={(e) => setSelectedElement(e.target.value)}
          >
            {availableElements.map((el) => (
              <option key={el.name} value={el.name}>
                {el.emoji} {el.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (selectedElement) {
                addElementRequirement(trackerIndex, selectedElement);
              }
            }}
          >
            Add Requirement
          </button>
        </>
      ) : (
        <p>All innate elements added.</p>
      )}
    </div>
  );
}