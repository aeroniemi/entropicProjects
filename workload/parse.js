// create array of readings in this timeframe
const fs = require('fs');
var activities = require("./activities.js")

activities.validReadings(new Date("2020-01-14 19:42:00"), new Date())
    .then((subset) => activities.assembleUsefulTable(subset))
    .then((table) => activities.mergeIdentities(table))
    .then((res) => {
        var array = Object.entries(res)
        console.log(`Summary Statistics:
        Flights managed: ${array.length}
        THY: `
            , res[1542929]
        )
    })
    // .then((res) => console.log(res))
    // .then((res) => console.log(res[1208728]))
