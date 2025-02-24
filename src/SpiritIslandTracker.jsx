import React, { useState } from "react";
import spiritsData from "./spirits.json"; // Adjust path if needed

// Importing element images
import airImg from "./assets/air.png";
import fireImg from "./assets/fire.png";
import waterImg from "./assets/water.png";
import earthImg from "./assets/earth.png";
import plantImg from "./assets/plant.png";
import animalImg from "./assets/animal.png";
import moonImg from "./assets/moon.png";
import sunImg from "./assets/sun.png";
import energyImg from "./assets/energy.png";

// Element definitions
const elements = [
  { name: "Energy", image: energyImg },
  { name: "Sun", image: sunImg },
  { name: "Moon", image: moonImg },
  { name: "Fire", image: fireImg },
  { name: "Air", image: airImg },
  { name: "Water", image: waterImg },
  { name: "Earth", image: earthImg },
  { name: "Plant", image: plantImg },
  { name: "Animal", image: animalImg },
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
      [element]: Math.max(0, prev[element] + delta),
    }));
  };

  const resetCounts = () => {
    setCounts(elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {}));
  };

  const handleSpiritChange = (event) => {
    const spiritName = event.target.value;
    const spirit = spiritsData[spiritName];
    setSelectedSpirit(spiritName);
    setInnateRequirements(spirit ? spirit : []);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "90vw", // Adds left & right margin
        minHeight: "90vh", // Adds top & bottom margin
        padding: "20px",
        margin: "5vh auto", // Centers vertically with margin
      }}
    >
      <button
        onClick={resetCounts}
        style={{
          marginBottom: "15px",
          fontSize: "1em",
          padding: "8px 16px",
        }}
      >
        Reset Elements
      </button>

      {/* Element Tracker - Always visible & centered */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {elements.map((el) => (
          <div key={el.name} style={{ textAlign: "center" }}>
            <img
              src={el.image}
              alt={el.name}
              style={{ width: "45px", height: "45px" }}
            />
            <div style={{ fontSize: "1em" }}>{counts[el.name]}</div>
            <div>
              <button
                onClick={() => updateCount(el.name, 1)}
                style={{
                  fontSize: "0.9em",
                  padding: "4px",
                  marginRight: "2px",
                }}
              >
                +
              </button>
              <button
                onClick={() => updateCount(el.name, -1)}
                style={{
                  fontSize: "0.9em",
                  padding: "4px",
                }}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Spirit Selector - Centered */}
      <div style={{ marginTop: "20px" }}>
        <select
          onChange={handleSpiritChange}
          style={{
            fontSize: "1em",
            padding: "6px",
            margin: "10px 0",
          }}
        >
          <option value="">Select a Spirit</option>
          {Object.keys(spiritsData)
            .sort()
            .map((spiritName) => (
              <option key={spiritName} value={spiritName}>
                {spiritName}
              </option>
            ))}
        </select>
      </div>

      {/* Scrollable Innates Section */}
      {selectedSpirit && (
        <div style={{ marginTop: "20px", overflowY: "auto", width: "100%" }}>
          {innateRequirements.map((innate, index) => (
            <div
              key={index}
              style={{
                margin: "5px auto",
                padding: "10px",
                minWidth: "250px",
                maxWidth: "90%",
              }}
            >
              {innate.Thresholds.map((threshold, thresholdIndex) => (
                <div
                  key={thresholdIndex}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  {threshold.Elements.filter((elem) => elem.Element !== "Energy").map(
                    (elem, elemIndex) => {
                      const hasRequirement = counts[elem.Element] >= elem.Quantity;
                      return (
                        <div
                          key={elemIndex}
                          style={{
                            padding: "5px",
                            margin: "5px",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={
                              elements.find((el) => el.name === elem.Element)?.image
                            }
                            alt={elem.Element}
                            style={{
                              width: "30px",
                              height: "30px",
                              opacity: hasRequirement ? "1" : "0.5",
                            }}
                          />
                          <div style={{ fontSize: "0.9em" }}>{elem.Quantity}</div>
                        </div>
                      );
                    }
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpiritIslandTracker;
