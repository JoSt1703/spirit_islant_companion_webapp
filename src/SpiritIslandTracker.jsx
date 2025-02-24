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
import energyImg from "./assets/energy.png"; // Energy image added
import presenceImg from "./assets/presence.png"; // Presence image added

// Element definitions
const elements = [
  { name: "Energy", image: energyImg }, // Using energy image
  { name: "Sun", image: sunImg },
  { name: "Moon", image: moonImg },
  { name: "Fire", image: fireImg },
  { name: "Air", image: airImg },
  { name: "Water", image: waterImg },
  { name: "Earth", image: earthImg },
  { name: "Plant", image: plantImg },
  { name: "Animal", image: animalImg },
  { name: "Presence", image: presenceImg } // Using presence image
];

const SpiritIslandTracker = () => {
  const [counts, setCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
  );
  const [selectedSpirit, setSelectedSpirit] = useState(null);
  const [innateRequirements, setInnateRequirements] = useState([]);

  // Function to update element counts
  const updateCount = (element, delta) => {
    setCounts((prev) => ({
      ...prev,
      [element]: Math.max(0, prev[element] + delta)
    }));
  };

  // Reset all counts except for Energy
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
      // Energy remains unchanged
      Presence: 0,
    }));
  };

  // Handle spirit selection
  const handleSpiritChange = (event) => {
    const spiritName = event.target.value;
    const spirit = spiritsData[spiritName];
    setSelectedSpirit(spiritName);
    setInnateRequirements(spirit ? spirit : []);
  };

  return (
    <div style={{ textAlign: "center", margin: "10px", overflowX: "auto" }}>
      <button onClick={resetCounts} style={{ marginBottom: "10px", fontSize: "0.9em" }}>
        Reset Elements
      </button>
      <div>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {elements.map((el) => (
            <div key={el.name} style={{ margin: "5px", textAlign: "center", flex: "1 0 9%", maxWidth: "60px" }}>
              <img src={el.image} alt={el.name} style={{ width: "40px", height: "40px" }} /> {/* Show image for all elements */}
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
        <select onChange={handleSpiritChange} style={{ fontSize: "0.9em" }}>
          <option value="">Select a Spirit</option>
          {Object.keys(spiritsData)
            .sort()
            .map((spiritName) => (
              <option key={spiritName} value={spiritName}>{spiritName}</option>
            ))}
        </select>
      </div>
      {selectedSpirit && (
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {innateRequirements.map((innate, index) => (
              <div key={index} style={{ margin: "10px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", width: "300px" }}>
                <h3 style={{ fontSize: "1.1em" }}>{innate.Innate}</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  {innate.Thresholds.map((threshold, thresholdIndex) => (
                    <div key={thresholdIndex} style={{ marginRight: "10px", padding: "5px", border: "1px solid #ddd", borderRadius: "5px", width: "80px" }}>
                      <h4 style={{ fontSize: "1em" }}>Threshold {thresholdIndex + 1}</h4>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {threshold.Elements.filter(elem => elem.Element !== "Energy").map((elem, elemIndex) => {
                          const hasRequirement = counts[elem.Element] >= elem.Quantity;
                          return (
                            <div key={elemIndex} style={{
                              border: `2px solid ${hasRequirement ? 'green' : 'red'}`,
                              borderRadius: '5px',
                              padding: '5px',
                              margin: '5px 0',
                              textAlign: 'center'
                            }}>
                              <img src={elements.find(el => el.name === elem.Element)?.image || ""} 
                                   alt={elem.Element} 
                                   style={{ width: "40px", height: "40px" }} />
                              <div style={{ fontSize: "1.1em" }}>{elem.Quantity}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritIslandTracker;
