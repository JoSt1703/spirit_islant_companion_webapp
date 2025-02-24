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
      [element]: Math.max(0, prev[element] + delta)
    }));
  };

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
    }));
  };

  const handleSpiritChange = (event) => {
    const spiritName = event.target.value;
    const spirit = spiritsData[spiritName];
    setSelectedSpirit(spiritName);
    setInnateRequirements(spirit ? spirit : []);
  };

  return (
    <div style={{ textAlign: "center", margin: "10px", overflowX: "auto" }}>
      <button onClick={resetCounts} style={{ marginBottom: "10px", fontSize: "0.8em" }}>
        Reset Elements
      </button>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {elements.map((el) => (
          <div key={el.name} style={{ margin: "5px", textAlign: "center", flex: "1 0 9%", maxWidth: "50px" }}>
            <img src={el.image} alt={el.name} style={{ width: "30px", height: "30px" }} />
            <div style={{ fontSize: "0.9em" }}>{counts[el.name]}</div>
            <div>
              <button onClick={() => updateCount(el.name, 1)} style={{ fontSize: "0.7em" }}>+</button>
              <button onClick={() => updateCount(el.name, -1)} style={{ fontSize: "0.7em" }}>-</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <select onChange={handleSpiritChange} style={{ fontSize: "0.8em" }}>
          <option value="">Select a Spirit</option>
          {Object.keys(spiritsData)
            .sort()
            .map((spiritName) => (
              <option key={spiritName} value={spiritName}>{spiritName}</option>
            ))}
        </select>
      </div>
      {selectedSpirit && (
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {innateRequirements.map((innate, index) => (
            <div key={index} style={{ margin: "5px", border: "1px solid #ccc", borderRadius: "5px", padding: "5px", minWidth: "200px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {innate.Thresholds.map((threshold, thresholdIndex) => (
                  <div key={thresholdIndex} style={{ marginBottom: "5px", padding: "5px", border: "1px solid #ddd", borderRadius: "5px", display: "flex", justifyContent: "center" }}>
                    {threshold.Elements.filter(elem => elem.Element !== "Energy").map((elem, elemIndex) => {
                      const hasRequirement = counts[elem.Element] >= elem.Quantity;
                      return (
                        <div key={elemIndex} style={{
                          border: `2px solid ${hasRequirement ? 'green' : 'red'}`,
                          borderRadius: '5px',
                          padding: '5px',
                          margin: '2px',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          {elements.find(el => el.name === elem.Element)?.image ? (
                            <img src={elements.find(el => el.name === elem.Element)?.image} 
                                 alt={elem.Element} 
                                 style={{ width: "30px", height: "30px" }} />
                          ) : (
                            <div style={{ fontSize: "1.5em" }}>❓</div> // Emoji fallback
                          )}
                          <div style={{ fontSize: "0.8em" }}>{elem.Quantity}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpiritIslandTracker;