const { Sequelize, Op, Model, DataTypes, Deferrable } = require('sequelize');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs')
const { Flight } = require("./models/flight.js");
const { Navlog } = require("./models/navlog.js");
const { resolve } = require('path');
// define the database to use
const sequelize = new Sequelize("sqlite::memory:", {
    dialect: 'sqlite',
    storage: './db/core.db',
    logging: false
});



async function setup() {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
    return
}
function readDatafeed(fileName) {
    return new Promise(function (resolve, reject) {
        var file = path.join(`./temp/`, fileName)
        try {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) reject(err)
                resolve(JSON.parse(data))
            })
        } catch (error) {
            console.log(chalk.bgRed("error:" + error))
            reject(error)
        }
    })
}
async function addDatafeed(data) {
    var promises = data.pilots.map(function (ele) {
        return new Promise(function (resolve, reject) {
            var flight = new Flight()
            resolve(flight.addFlightFromDatafeed(ele))
        })
    })

    // var promises = pilots.map(function (ele) {
    //     return addPilot(ele)
    // })
    Promise.all(promises).then((results) => {
        console.log(chalk.bgBlue("finished promising"))
    })
}
async function addNavlogEntry(flight_id, data) {
    var entry = await new Navlog().fromDetails(flight_id, data.update_time)
    if (entry === null) { // no flights matching these details
        data.flight_id = flight_id
        entry = await Navlog.create(data)
    }
    return entry.getID()
}
async function addPilotToDatabase(pilot) {
    var flight = await new Flight().fromDetails(pilot.cid, pilot.callsign)
    console.log(chalk.red("we're checking pilots"))
    if (flight === null) { // no flights matching these details
        // console.log(pilot)
        flight = await Flight.create({
            logon_time: pilot.logon_time,
            cid: pilot.cid,
            pilot_name: pilot.name,
            callsign: pilot.callsign,
        })
    }
    // console.log(flight.getFlightId())
    await addNavlogEntry(flight.getFlightId(), {
        update_time: pilot.last_updated,
        latitude: pilot.latitude,
        longitude: pilot.longitude,
        altitude: pilot.altitude,
        groundspeed: pilot.groundspeed,
        transponder: pilot.transponder,
        heading: pilot.heading,
        qnh: pilot.qnh_mb,
        source: pilot.source
    })
    return flight.getFlightId()
}

function addPilotsToDatabase(pilots) {
    return new Promise(function (resolve, reject) {
        var promises = pilots.map(function (ele) {
            return addPilotToDatabase(ele)
        })
        Promise.all(promises).then((results) => {
            console.log(results)
            resolve(results)
        })
    })
}
async function findFilesInFolder(folder) {
    return new Promise(function (resolve, reject) {
        fs.readdir(folder, (err, files) => {
            if (err) throw err;
            if (files === undefined || files.length == 0) {
                reject("no valid files")
            }
            resolve(files)
        })
    })
}
async function manageDatafeedEntry(file) {
    var data = await readDatafeed(file)
    return await addPilotsToDatabase(data.pilots)
}
function importFolderOfDatafeed(folder) {
    return new Promise(function (resolve, reject) {
        findFilesInFolder(folder)
            .then((files) => {
                var filePromises = files.map(function (file) {
                    return manageDatafeedEntry(file)
                })
                Promise.all(filePromises).then((results) => {
                    resolve(results)
                })
            })

    })
}

async function bulkAddAllTheNavlogs(navlog) {

}
async function run() {
    console.log(chalk.bgGreen("Starting"))
    await setup()
    await importFolderOfDatafeed("./temp/")
    // var data = await readDatafeed("1610818044.json")
    // await addPilotsToDatabase(data.pilots)
    var lenny = await new Flight().fromId(2000)
    var lennyNav = await new Navlog().getEntrysByFlightId(lenny.getID())
    // var table = await lenny.findFlightsByCid(1302142)#

    var coordinates = []
    lennyNav.forEach((point) => {
        coordinates.push(point.getCoord())
    })
    console.log(coordinates)

}
run()