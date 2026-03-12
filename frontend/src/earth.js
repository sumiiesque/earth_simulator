import Globe from "react-globe.gl";
import { useEffect, useState } from "react";


function Earth({ year , filters}) {

  const [events, setEvents] = useState([]);
  const visibleEvents = events.filter(e => filters[e.type]);

  useEffect(() => {

  fetch(`http://localhost:3001/events?year=${year}`)
    .then(res => res.json())
    .then(data => setEvents(data));

}, [year]);

  return (
    <div style={{ height: "100vh" }}>
<Globe
  globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
  pointsData={visibleEvents}
  pointLat="lat"
  pointLng="lng"
  pointAltitude={(d) => {
  if (d.type === "meteor") return 0.05;
  return 0.02;
}}

  pointColor={(d) => {
    if (d.type === "earthquake") return "red";
    if (d.type === "volcano") return "orange";
    if (d.type === "extinction") return "yellow";
    if (d.type === "meteor") return "lime";
    return "white";
  }}

pointLabel={(d) => {

  if (d.type === "earthquake") {
    return `
<b>Earthquake</b><br/>
Magnitude: ${d.magnitude}<br/>
`;
  }

  if (d.type === "volcano") {
    return `
<b>${d.name}</b><br/>
Country: ${d.country}<br/>
Type: ${d.volcanoType}
`;
  }

  if (d.type === "meteor") {
    return `
<b>Meteor Impact</b><br/>
Year: ${d.year}<br/>
Mass: ${d.mass}
`;
  }

  if (d.type === "extinction") {
    return `
<b>${d.name}</b><br/>
Year: ${d.year}<br/>
${d.description}
`;
  }

}}

pointRadius={(d) => {
  if (d.type === "extinction") return 0.7;
  if (d.type === "meteor") return 0.4;
  if (d.type === "earthquake") return (d.magnitude || 1) * 0.03;
  return 0.25;
}}

  showAtmosphere={true}
  atmosphereColor="lightskyblue"
  atmosphereAltitude={0.25}
/>
    </div>
  );
}

export default Earth;