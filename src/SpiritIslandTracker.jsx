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
  { name: "Joker", image: "🃏" }, 
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
    setCounts((prev) => ({
      ...elements.reduce((acc, el) => ({ ...acc, [el.name]: el.name === "Energy" ? prev.Energy : 0 }), {}),
    }));
  };

  const handleSpiritChange = (event) => {
    const spiritName = event.target.value;
    const spirit = spiritsData[spiritName];
    setSelectedSpirit(spiritName);
    setInnateRequirements(spirit ? spirit : []);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "800px", margin: "5vh auto", padding: "20px" }}>
      <button onClick={resetCounts} style={{ marginBottom: "15px", fontSize: "1em" }}>Reset Elements</button>
      <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", gap: "15px", overflowX: "auto" }}>
        {elements.map((el) => (
          <div key={el.name} style={{ textAlign: "center" }}>
            <img src={el.image} alt={el.name} style={{ width: "45px", height: "45px" }} />
            <div style={{ fontSize: "1em" }}>{counts[el.name]}</div>
            <div>
              <button onClick={() => updateCount(el.name, 1)}>+</button>
              <button onClick={() => updateCount(el.name, -1)}>-</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <select onChange={handleSpiritChange} style={{ fontSize: "1em" }}>
          <option value="">Select a Spirit</option>
          {Object.keys(spiritsData).sort().map((spiritName) => (
            <option key={spiritName} value={spiritName}>{spiritName}</option>
          ))}
        </select>
      </div>

      {selectedSpirit && (
        <div style={{ marginTop: "20px", width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
          {innateRequirements.map((innate, index) => (
            <div key={index} style={{ margin: "5px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", minWidth: "250px", maxWidth: "300px" }}>
              {innate.Thresholds.map((threshold, thresholdIndex) => (
                <div key={thresholdIndex} style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                  {threshold.Elements.map((elem, elemIndex) => {
                    const isElement = elements.some(e => e.name === elem.Element);
                    const hasRequirement = counts[elem.Element] >= elem.Quantity;

                    return (
                      <div key={elemIndex} style={{ padding: "5px", margin: "5px", textAlign: "center", border: `2px solid ${hasRequirement ? "green" : "red"}`, borderRadius: "5px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {isElement ? (
                          <img src={elements.find((el) => el.name === elem.Element)?.image} alt={elem.Element} style={{ width: "30px", height: "30px" }} />
                        ) : (
                          <span style={{ fontSize: "30px" }}>🃏</span> 
                        )}
                        <div style={{ fontSize: "0.9em" }}>{elem.Quantity}</div>
                      </div>
                    );
                  })}
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
