var speedtest = require("speedtest-net");
var createCsvWriter = require("csv-writer").createObjectCsvWriter;

var settings = require("./settings.json");

var csvWriter = createCsvWriter({
  path: "log.csv",
  header: [
    { id: "startedOn", title: "Started on" },
    { id: "finishedOn", title: "Finished on" },
    { id: "ping", title: "Ping" },
    { id: "download", title: "Download speed" },
    { id: "upload", title: "Upload speed" },
    { id: "serverUrl", title: "Server URL" },
    { id: "serverLocation", title: "Server location" },
    { id: "serverLat", title: "Server latitude" },
    { id: "serverLon", title: "Server longitude" },
    { id: "distance", title: "Distance" }
  ],
  append: true
});

function runTest() {
  var startedOn = new Date().toISOString();
  var test = speedtest({ maxTime: 5000 });

  test.on("data", data => {
    var finishedOn = new Date().toISOString();
    csvWriter
      .writeRecords([
        {
          startedOn,
          finishedOn,
          ping: data.server.ping,
          download: data.speeds.originalDownload,
          upload: data.speeds.originalUpload,
          serverUrl: data.server.host,
          serverLocation: data.server.location,
          serverLat: data.server.lat,
          serverLon: data.server.lon,
          distance: data.server.distance
        }
      ])
      .then(() => {
        console.log(
          `[${finishedOn}] D: ${data.speeds.download} Mbit/s, U: ${
            data.speeds.upload
          } Mbit/s`
        );
      })
      .catch(console.error);
  });
  test.on("error", console.error);
}

setInterval(runTest, settings.interval);
runTest();
