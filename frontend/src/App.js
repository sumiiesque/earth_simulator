import { useState } from "react";
import Earth from "./earth";

function formatYear(year) {

  if (year < -1000000000)
    return (Math.abs(year) / 1000000000).toFixed(1) + " Billion Years Ago";

  if (year < -1000000)
    return (Math.abs(year) / 1000000).toFixed(1) + " Million Years Ago";

  if (year < 0)
    return Math.abs(year) + " BCE";

  return year + " CE";
}

function App() {

  const [year, setYear] = useState(2100);

  const [filters, setFilters] = useState({
    earthquake: true,
    volcano: true,
    meteor: true,
    extinction: true
  });

  function toggleFilter(type) {
    setFilters({
      ...filters,
      [type]: !filters[type]
    });
  }

  return (
    <div>

      <Earth year={year} filters={filters} />

      {/* Event Selector + Legend */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "rgba(0,0,0,0.6)",
        padding: "12px",
        borderRadius: "8px",
        color: "white",
        fontSize: "14px"
      }}>

        <h4>Events</h4>

        <label>
          <input
            type="checkbox"
            checked={filters.earthquake}
            onChange={() => toggleFilter("earthquake")}
          />
          🔴 Earthquakes
        </label>
        <br/>

        <label>
          <input
            type="checkbox"
            checked={filters.volcano}
            onChange={() => toggleFilter("volcano")}
          />
          🟠 Volcanoes
        </label>
        <br/>

        <label>
          <input
            type="checkbox"
            checked={filters.meteor}
            onChange={() => toggleFilter("meteor")}
          />
          🟢 Meteors
        </label>
        <br/>

        <label>
          <input
            type="checkbox"
            checked={filters.extinction}
            onChange={() => toggleFilter("extinction")}
          />
          🟡 Extinctions
        </label>

      </div>

      {/* Timeline Slider */}
      <div style={{
        position: "absolute",
        bottom: "30px",
        width: "100%",
        textAlign: "center",
        color: "white"
      }}>

        <input
          type="range"
          min="-4500000000"
          max="2100"
          step="1000000"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ width: "60%" }}
        />

        <p>{formatYear(year)}</p>

      </div>

    </div>
  );
}

export default App;