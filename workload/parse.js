// create array of readings in this timeframe
const fs = require('fs');
function validReadings(oldest, newest) {
    return new Promise(function (resolve, reject) {
        var output = []
        var oldestUnix = Math.trunc(oldest.getTime() / 1000);
        var newestUnix = Math.trunc(newest.getTime() / 1000);
        fs.readdir("./temp/", (err, files) => {
            if (err) throw err;
            if (files === undefined || files.length == 0) {
                reject("no valid files")
            }
            var images = files.map(function (file) {
                return parseInt(file.substring(0, file.length - 5));
            })
            images.forEach((image) => {
                if (image > oldestUnix && image < newestUnix) {
                    output.push(image)
                }
            })
            resolve(output)
        })
    })
}
function assembleUsefulTable(subset) {
    return new Promise(function (resolve, reject) {
        var res = subset.map(function (ele) {
            return assembleUsefulSubTable(ele)
        })
        Promise.all(res).then((results) =>
            resolve(results)
        )

    })
}
function assembleUsefulSubTable(image) {
    return new Promise(function (resolve, reject) {
        var name = image + ".json"
        fs.readFile("./temp/" + name, (err, body) => {
            if (err) reject(err)
            var results = JSON.parse(body)
            resolve(results)
        })
    })
}

// async function findIdentities(old, data) {
//     var output = {
//         connected_clients: Math.random(),
//         unique_users: Math.random()
//     }
//     if (old == 0) {
//         return output
//     }
//     console.log("hi", old)
//     old.push(output)
//     return old
// }

// function mergeIdentities(table) {
//     return new Promise(function (resolve, reject) {
//         var result = []
//         table.forEach((data) => {
//             var pilotPromises = data.pilots.map(function (pilot) {
//                 return managePilotOne(pilot)
//             })
//             Promise.all(pilotPromises).then((results) =>
//                 result.push(results)
//             )

//         })
//         resolve(result)
//     })
// }
function managePilotOne(pastTable, pilot) {
    // return new Promise(function (resolve, reject) {
    // console.log(pastTable)
    var pastIndex = -1
    var currentLog = {
        timestamp: pilot.last_updated,
        latitude: pilot.latitude,
        longitude: pilot.longitude,
        altitude: pilot.altitude,
        groundspeed: pilot.groundspeed,
        heading: pilot.heading,
        qnh_mb: pilot.qnh_mb
    }
    var outputPilot = {
        cid: pilot.cid,
        name: pilot.name,
        callsign: pilot.callsign,
        logon_time: pilot.logon_time,
        log: [currentLog]
    }

    pastTable.forEach((v, i) => {
        if (v.cid == pilot.cid) {
            console.log("found a match")
            outputPilot.log = v.log
            outputPilot.log.push(currentLog)
            return [outputPilot, true]
        }
    })
    return [outputPilot, false]
}
function findIdentities(last, data) {
    return new Promise(function (resolve, reject) {
        // console.log({}, data.pilots[1])
        var pilot = managePilotOne(last, data.pilots[1])
        var output = {
            connected_clients: data.general.connected_clients,
            unique_users: data.general.unique_users
        }
        var cur = last
        if (pilot[2] == true) {

        } else {
            cur.push(pilot[1])
        }


        resolve(cur)
    })
}
function mergeIdentities(table) {
    return new Promise(function (resolve, reject) {
        // var promises = table.map(function (ele) {
        //     return findIdentities(ele)
        // })
        var base = []
        table.forEach((v, i) => {
            // console.log(v.general.unique_users)
            findIdentities(base, v).then(result => {
                resolve(result)
            })
        })
        resolve(base)
    })
}

validReadings(new Date("2020-01-14 19:42:00"), new Date())
    .then((subset) => assembleUsefulTable(subset))
    .then((table) => mergeIdentities(table))
    .then((res) => console.log(res))
