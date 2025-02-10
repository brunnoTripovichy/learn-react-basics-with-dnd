import "./App.css";
import { useState, useEffect } from "react";

// ✅ Main App Component
export default function App() {
  const [classes, setClasses] = useState([]); // Stores list of classes
  const [selectedClass, setSelectedClass] = useState(""); // Selected class
  const [classInfo, setClassInfo] = useState(null); // Class details
  const [count, setCount] = useState(0); // API call count

  // Fetch all DnD classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("https://www.dnd5eapi.co/api/classes/");
        const data = await res.json();
        setClasses(data.results); // Store list of classes
        setSelectedClass(data.results[0].index); // Default: first class
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch selected class details
  useEffect(() => {
    if (!selectedClass) return;

    const fetchClassDetails = async () => {
      try {
        const res = await fetch(
          `https://www.dnd5eapi.co/api/classes/${selectedClass}`
        );
        const data = await res.json();
        setClassInfo(data);
        setCount((c) => c + 1);
      } catch (error) {
        console.error("Error fetching class details:", error);
      }
    };

    fetchClassDetails();
  }, [selectedClass]); // Runs when selectedClass changes

  return (
    <div>
      <h1>⚔️ DnD 5e: Classes</h1>

      {/* Dropdown to select a class */}
      <label>
        Choose a class:
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map((cls) => (
            <option key={cls.index} value={cls.index}>
              {cls.name}
            </option>
          ))}
        </select>
      </label>

      {/* Display class details */}
      {classInfo ? <ClassDetails classInfo={classInfo} /> : <p>Loading...</p>}

      {/* Show API call count */}
      <Message count={count} />
    </div>
  );
}

// ✅ Component: Displays Class Details
function ClassDetails({ classInfo }) {
  return (
    <div>
      <h2>{classInfo.name}</h2>
      <p>🎲 Hit Die: d{classInfo.hit_die}</p>
      <h3>Proficiencies:</h3>
      <ul>
        {classInfo.proficiencies.map((prof) => (
          <li key={prof.index}>{prof.name}</li>
        ))}
      </ul>
    </div>
  );
}

// ✅ Component: Displays Message
function Message({ count }) {
  return (
    <p>
      📜 You have fetched class details <strong>{count}</strong> times.
    </p>
  );
}
