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

const loadedSpiritImages = import.meta.glob('./assets/spirits/*.png', {
  eager: true,
  import: 'default',
});

const spiritImages = Object.fromEntries(
  Object.entries(loadedSpiritImages).map(([path, src]) => {
    const fileName = path.split('/').pop().split('.').shift();
    return [fileName, src];
  })
);

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

// Format the Spirit Name for class
function spiritClass(spiritName, includeAspect = false) {
  if (!spiritName) return '';
  const baseName = includeAspect ? spiritName : spiritName.split(' - ')[0];
  return baseName.toLowerCase().replaceAll(/\s|'/g, '-');
}

// Format the Spirit Name for fetching img
function spiritImgKey(spiritName, includeAspect = false) {
  const baseName = includeAspect ? spiritName : spiritName.split(' - ')[0];
  return baseName.toLowerCase().replaceAll(/\s|'/g, '');
}

// Format the Spirit Name for display
function spiritDisplay(spiritName) { 
  return (
    <>
      {spiritName.split(' - ')[0]}
      {spiritName.split(' - ')[1] && <sup className="aspect">{spiritName.split(' - ')[1]}</sup>}
    </>
  )
}

const SpiritIslandTracker = () => {
  const [spiritArray, setSpiritArray] = useState([{ id: crypto.randomUUID() }]);

  const removeSpirit = id => {
    if (spiritArray.length === 1) return;
    setSpiritArray(spiritArray.filter(spirit => spirit.id !== id))
  }
  
  const addSpirit = () => {
    setSpiritArray([
      ...spiritArray,
      {id: crypto.randomUUID()}
    ])
  }

  return (
    <div className="spirits">
      {spiritArray.map(spirit => <SpiritTracker key={spirit.id} spiritId={spirit.id} removeSpirit={removeSpirit} />)}
      {spiritArray.length < 6 && (
        <div className="add-sprit" onClick={addSpirit}>
          <div class="plus-button"></div>
        </div>
      )}
    </div>
  )
}

const SpiritTracker = ({spiritId, removeSpirit}) => {
  const [counts, setCounts] = useState(
    // track persistant elements (from board) and temporay ones
    elements.reduce((acc, el) => ({ ...acc, [el.name]: {temp: 0, persist: 0} }), {})
  );
  // toggles for hide/unhide information
  const [spiritOpen, setSpiritOpen] = useState(true);
  const [elementsOpen, setElementsOpen] = useState(true);
  const [innatesOpen, setInnatesOpen] = useState(true);

  const [selectedSpirit, setSelectedSpirit] = useState(null);

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

  return (
    <div test={spiritId} className={`spirit ${spiritClass(selectedSpirit)} ${spiritOpen ? 'open' : 'closed'}`} onClick={e => setSpiritOpen(true)}>
      <div className="spirit-toggle" onClick={(e) => {e.stopPropagation(); setSpiritOpen(!spiritOpen)}}></div>
      <div className="spirit-remove" onClick={() => removeSpirit(spiritId)}></div>
      <SpiritContext.Provider value={{selectedSpirit, setSelectedSpirit}}>
        <div className="global-controls">
          <SpiritSelector/>
        </div>
      </SpiritContext.Provider>
      <h4 className={elementsOpen ? 'open' : 'closed'} onClick={e => setElementsOpen(!elementsOpen)}>Elements</h4>
      <SpiritContext.Provider value={{resetCounts, counts, updateCount}}>
      <div className="elements">
        {elements.map((el) => (
            <Element key={el.name} el={el} />
        ))}
        <ResetButton />
      </div>
      </SpiritContext.Provider>
      {selectedSpirit && (
        <>
          <h4 className={innatesOpen ? 'open' : 'closed'} onClick={e => setInnatesOpen(!innatesOpen)}>Innates</h4>
          <div className="innate-requirements">
            {spiritsData[selectedSpirit].map((innate, index) => (
              <Innate innate={innate} counts={counts} index={index} key={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Innate = ({ innate, counts, index }) => {

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
                    <span>🃏</span>
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
  const {selectedSpirit, setSelectedSpirit} = useContext(SpiritContext);
  var [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(!open);
    document.addEventListener('click', function removeOpen() {
      document.removeEventListener('click', removeOpen);
      setOpen(false);
    });
  }

  const handleSpiritChange = (event) => {
    const { dataset } = event.currentTarget;
    console.log(event.currentTarget, dataset);
    const spiritName = dataset.spiritName;
    setSelectedSpirit(spiritName);
  };

  return (
    <div className="spirit-selector">
      {selectedSpirit ? (
        <h2 onClick={handleOpen}>
          <img src={spiritImages[spiritImgKey(selectedSpirit)]} />
          <span>{spiritDisplay(selectedSpirit)}</span>
        </h2>
      ) : (
        <h2 onClick={handleOpen}>Select a Spirit</h2>
      )}
      <div className={`spirit-list ${open && 'open'}`}>
        {Object.keys(spiritsData)
          .sort()
          .map((spiritName) => (
            <div onClick={handleSpiritChange} className={`spirit-name ${spiritClass(spiritName)}`} key={spiritName} data-spirit-name={spiritName}>
              <img src={spiritImages[spiritImgKey(spiritName)]} />
              <span>{spiritDisplay(spiritName)}</span>
            </div>
          ))}
      </div>
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

const Element = ({el}) => {
  const {counts} = useContext(SpiritContext);

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
      <Incrementor el={el} type="temp" />
      {((el.name !== "Joker" && el.name !== "Energy") ) && <Incrementor el={el} type="persist" />}
    </div>
  )
}

const Incrementor = ({ el, type }) => {
  const {updateCount} = useContext(SpiritContext);

  return (
    <div className={`incrementors ${type}`}>
      <button onClick={() => updateCount(el.name, 1, type)}><span>+</span></button>
      <button onClick={() => updateCount(el.name, -1, type)}><span>-</span></button>
    </div>
  )
}

export default SpiritIslandTracker;
