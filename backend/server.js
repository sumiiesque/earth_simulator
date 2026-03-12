const cors = require("cors");
const express = require("express");
const earthquakes = require("./data/earthquakes.json");
const extinctions = require("./data/extinctions.json");
const fs = require("fs");
const csv = require("csv-parser");

const app=express();

app.use(cors());

app.get("/",(req,res)=>{
    res.send("earth simulator backend running");
});

//server start
app.listen(3001,()=>{
    console.log("server running on port 3001");
});

app.get("/earthquakes", (req, res) => {
  res.json(earthquakes);
});

app.get("/extinctions", (req, res) => {
  res.json(extinctions);
});

app.get("/volcanoes", (req, res) => {

  const results = [];

  fs.createReadStream("./data/volcanoes.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results);
    });

});

app.get("/meteors", (req, res) => {

  const results = [];

  fs.createReadStream("./data/meteors.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results);
    });

});

app.get("/population", (req, res) => {

  const results = [];

  fs.createReadStream("./data/population.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results);
    });

});

//timeline api
app.get("/events", (req, res) => {

  const selectedYear = parseInt(req.query.year) || 2100;

  // Earthquakes
  const earthquakeEvents = earthquakes.features
    .map(e => {
      const eventYear = new Date(e.properties.time).getFullYear();

      return {
        type: "earthquake",
        lat: e.geometry.coordinates[1],
        lng: e.geometry.coordinates[0],
        magnitude: e.properties.mag,
        year: eventYear
      };
    })
    .filter(e => !isNaN(e.year) && e.year <= selectedYear);

  //volcanoes
  const volcanoEvents = [];

  fs.createReadStream("./data/volcanoes.csv")
    .pipe(csv())
    .on("data", (row) => {

     volcanoEvents.push({
  type: "volcano",
  lat: parseFloat(row["Latitude"]),
  lng: parseFloat(row["Longitude"]),
  name: row["Volcano Name"],
  country: row["Country"],
  region: row["Region"],
  volcanoType: row["Type"]
});

    })
    .on("end", () => {
  // meteors
const meteorEvents = [];

fs.createReadStream("./data/meteors.csv")
  .pipe(csv())
  .on("data", (row) => {

    const eventYear = parseInt(row.year);

    if (!isNaN(eventYear) && eventYear <= selectedYear) {

      meteorEvents.push({
        type: "meteor",
        lat: parseFloat(row.reclat),
        lng: parseFloat(row.reclong),
        year: eventYear,
        mass: row.mass
      });

    }

  })
  .on("end", () => {

    // Extinctions
  const extinctionEvents = extinctions
  .filter(e => e.year <= selectedYear)
  .map(e => ({
    type: "extinction",
    lat: Math.random() * 180 - 90,
    lng: Math.random() * 360 - 180,
    year: e.year,
    name: e.name,
    description: e.description
  }));

    const events = [
      ...earthquakeEvents,
      ...volcanoEvents,
      ...meteorEvents,
      ...extinctionEvents
    ];

    res.json(events);

  });

});

});