import React, { createContext, useContext, useState } from "react";
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
  { name: "Sun", image: sunImg },
  { name: "Moon", image: moonImg },
  { name: "Fire", image: fireImg },
  { name: "Air", image: airImg },
  { name: "Water", image: waterImg },
  { name: "Earth", image: earthImg },
  { name: "Plant", image: plantImg },
  { name: "Animal", image: animalImg },
  { name: "Energy", image: energyImg },
  { name: "Joker", image: "🃏" },
];

const SpiritContext = createContext();

const SpiritIslandTracker = () => {
  const [spiritCount, setSpiritCount] = useState(1);

  return (
    <div className="spirits">
      <SpiritTracker />
      <SpiritTracker />
      <SpiritTracker />
      <SpiritTracker />
      <SpiritTracker />
      <SpiritTracker />
    </div>
  )
}

const SpiritTracker = () => {
  const [counts, setCounts] = useState(
    // elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
    elements.reduce((acc, el) => ({ ...acc, [el.name]: {temp: 0, persist: 0} }), {})
  );
  const [selectedSpirit, setSelectedSpirit] = useState(null);
  const [innateRequirements, setInnateRequirements] = useState([]);

  const updateCount = (element, delta, type) => {
    const otherType = type == 'temp' ? 'persist' : 'temp';
    const maxCount = element === "Energy" ? 20 : 9;

    setCounts((prev) => ({
      ...prev,
      [element]: {
        [type]: Math.min(Math.max(0, prev[element][type] + delta), (maxCount - prev[element][otherType])),
        [otherType]: prev[element][otherType]
      }
    }));
  };

  const resetCounts = () => {
    setCounts((prev) => ({
      ...elements.reduce(
        (acc, el) => ({
          ...acc,
          [el.name]: {
            temp: el.name === "Energy" ? prev.Energy.temp : 0,
            persist: prev[el.name].persist
          },
        }),
        {}
      ),
    }));
  };

  const handleSpiritChange = (event) => {
    const spiritName = event.target.value;
    const spirit = spiritsData[spiritName];
    setSelectedSpirit(spiritName);
    setInnateRequirements(spirit ? spirit : []);
  };

  return (
    <div className="spirit">
      <SpiritContext.Provider value={{resetCounts, handleSpiritChange}}>
        <div className="global-controls">
          <SpiritSelector/>
          <ResetButton />
        </div>
      </SpiritContext.Provider>
      <div className="elements">
        {elements.map((el) => (
          <SpiritContext.Provider value={{el, counts, updateCount}} key={el.name}>
            <Element />
          </SpiritContext.Provider>
        ))}
      </div>
      {selectedSpirit && (
        <div className="innate-requirements">
          {innateRequirements.map((innate, index) => (
            <Innate innate={innate} counts={counts} index={index} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

const Innate = ({ innate, counts, index }) => {
  console.log('all Thresholds',innate.Thresholds, 'counts', counts);

  function isThresholdADefinedElement(elem) {
    return elements.some(
      (e) => e.name === elem.Element
    );
  }
  
  return (
    <div
      className="innate-power"
    >
      <h6>{innate.Innate}</h6>
      {innate.Thresholds.map((threshold, thresholdIndex) => {

        const [totalThreshold, totalApplicableElements] = threshold.Elements.reduce((totalElements, thresholdElement) => {
          const elementKey = isThresholdADefinedElement(thresholdElement) ? thresholdElement.Element : "Joker";
          const elementTotal = counts[elementKey].temp + counts[elementKey].persist;
          return [
            totalElements[0] + thresholdElement.Quantity,
            totalElements[1] + Math.min(elementTotal, thresholdElement.Quantity)
          ]
        }, [0, 0]);

        const linePercentage = (totalApplicableElements / totalThreshold) * 100;

        return (
          <div
            className={`threshold-line ${linePercentage >= 100 ? "met" : "unmet"} ${linePercentage === 0 && "empty"}`}
            style={{"--line-percentage": `${linePercentage}%`}}
            key={thresholdIndex}
          >
            {threshold.Elements.map((elem, elemIndex) => {
              // Use "Joker" for unknown element requirements.
              const elementKey = isThresholdADefinedElement(elem) ? elem.Element : "Joker";
              const elementTotal = counts[elementKey].temp + counts[elementKey].persist
              const requirementPercentage = (elementTotal / elem.Quantity) * 100;

              return (
                <div
                  className={`threshold-element ${requirementPercentage >= 100 ? "met" : "unmet"} ${elementKey.toLowerCase()}`}
                  style={{"--percentage": `${requirementPercentage}%`}}
                  key={elemIndex}
                >
                  {isThresholdADefinedElement(elem) ? (
                    <img
                      src={
                        elements.find(
                          (el) => el.name === elem.Element
                        )?.image
                      }
                      alt={elem.Element}
                    />
                  ) : (
                    <span style={{ fontSize: "30px" }}>🃏</span>
                  )}
                  <div style={{ fontSize: "0.9em" }}>
                    {elem.Quantity}
                  </div>
                </div>
              );
            })}
          </div>
        )
      })}
    </div>
  )
}

const SpiritSelector = () => {
  const {handleSpiritChange} = useContext(SpiritContext);
  var [open, setOpen] = useState(false);

  return (
    <div className="spirit-selector">
      <select onChange={handleSpiritChange} style={{ fontSize: "1em" }}>
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
  )
}

const ResetButton = () => {
  const {resetCounts} = useContext(SpiritContext);

  return (
    <button
      onClick={resetCounts}
      className="reset-button"
    >
      Reset Elements
    </button>
  )
}

const Element = () => {
  const {el, counts} = useContext(SpiritContext);

  return (
    <div className={`element ${el.name.toLowerCase()}`} key={el.name} style={{ textAlign: "center" }}>
      <div className="element-info">
        {el.name === "Joker" ? (
          <div className="joker">
            {el.image}
          </div>
        ) : (
          <img
            src={el.image}
            alt={el.name}
          />
        )}
        {(el.name !== "Joker" && el.name !== "Energy") && <div className="persist-count">{counts[el.name].persist}</div>}
        <div className="total-count">{counts[el.name].temp + counts[el.name].persist}</div>
      </div>
      <Incrementor type="temp" />
      {((el.name !== "Joker" && el.name !== "Energy") ) && <Incrementor type="persist" />}
    </div>
  )
}

const Incrementor = ({ type }) => {
  const {el, updateCount} = useContext(SpiritContext);

  return (
    <div className={`incrementors ${type}`}>
      <button onClick={() => updateCount(el.name, 1, type)}>+</button>
      <button onClick={() => updateCount(el.name, -1, type)}>-</button>
    </div>
  )
}

export default SpiritIslandTracker;
