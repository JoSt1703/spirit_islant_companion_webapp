import { useState } from "react";

const elements = [
  "Fire", "Water", "Earth", "Air", "Sun", "Moon", "Plant", "Animal"
];

export default function SpiritIslandTracker() {
  const [counts, setCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el]: 0 }), {})
  );

  const updateCount = (element, delta) => {
    setCounts((prev) => ({ ...prev, [element]: Math.max(0, prev[element] + delta) }));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Spirit Island Element Tracker</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {elements.map((element) => (
          <div key={element} className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">{element}</h2>
            <div className="flex items-center mt-2">
              <button className="px-3 py-1 bg-red-600 rounded-lg" onClick={() => updateCount(element, -1)}>-</button>
              <span className="mx-4 text-lg">{counts[element]}</span>
              <button className="px-3 py-1 bg-green-600 rounded-lg" onClick={() => updateCount(element, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}