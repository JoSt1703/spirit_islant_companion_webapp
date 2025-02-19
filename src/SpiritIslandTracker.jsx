import { useState } from "react";

const elements = [
  { name: "Fire", emoji: "🔥" },
  { name: "Water", emoji: "💧" },
  { name: "Earth", emoji: "🌍" },
  { name: "Air", emoji: "🌬️" },
  { name: "Sun", emoji: "☀️" },
  { name: "Moon", emoji: "🌙" },
  { name: "Plant", emoji: "🌱" },
  { name: "Animal", emoji: "🐾" }
];

export default function SpiritIslandTracker() {
  const [counts, setCounts] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.name]: 0 }), {})
  );

  const updateCount = (element, delta) => {
    setCounts((prev) => ({ ...prev, [element]: Math.max(0, prev[element] + delta) }));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Spirit Island Element Tracker</h1>
      <div className="flex flex-row justify-center gap-4">
        {elements.map(({ name, emoji }) => (
          <div key={name} className="flex flex-col items-center p-2 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">{emoji}</h2>
            <div className="flex items-center mt-1">
              <button className="px-2 py-1 bg-red-600 rounded-lg" onClick={() => updateCount(name, -1)}>-</button>
              <span className="mx-2 text-lg">{counts[name]}</span>
              <button className="px-2 py-1 bg-green-600 rounded-lg" onClick={() => updateCount(name, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
