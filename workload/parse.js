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

function managePilot(pilot) {

}
async function findIdentities(old, data) {
    return new Promise(function (resolve, reject) {
        // // resolve(data.pilots[1].callsign)
        // var pilotPromises = data.pilots.map(function (pilot) {
        //     return pilot.callsign
        // })
        // Promise.all(pilotPromises).then((results) =>
        //     resolve(results)
        // )
        var output = {
            connected_clients: Math.random(),
            unique_users: Math.random()
        }
        old.push(output)
        resolve(old)

    })
}

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
// function managePilotOne(pilot) {
//     return new Promise(function (resolve, reject) {
//         var outputPilot = {
//             cid: pilot.cid,
//             name: pilot.name,
//             callsign: pilot.callsign,
//             logon_time = pilot.logon_time
//         }
//         var currentLog = {
//             timestamp = pilot.last_updated,
//             latitude = pilot.latitude,
//             longitude = pilot.longitude,
//             altitude = pilot.altitude,
//             groundspeed = pilot.groundspeed,
//             heading = pilot.heading,
//             qnh_mb = pilot.qnh_mb
//         }
//     })
// }
function mergeIdentities(table) {
    return new Promise(function (resolve, reject) {
        // var promises = table.map(function (ele) {
        //     return findIdentities(ele)
        // })
        var base = []
        findIdentities(base, table[0]).then(result =>
            findIdentities(result, table[1]).then(result =>
                findIdentities(result, table[1])
                    .then(result => {
                        console.log(result)
                    }
                    )))
        // console.log(promises)

        const asyncRes = await table.reduce(async (last, e) => {
            await last;
            return (await findIdentities(last, e))
        }, 0);
        // return promises[0].then(result1 =>
        //     promises[1].then(result2 =>
        //         promises[2].then(result3 =>
        //             [result1, result2, result3]
        //         )
        //     )
        // ).then(arrayOfResults => {
        //     // Do something with all results
        // });
        // table.reduce((promiseChain, currentTask) => {
        //     return promiseChain.then(chainResults =>
        //         currentTask(promiseChain).then(currentResult => [...chainResults, currentResult]));
        // }, Promise.resolve([])).then(arrayOfResults => {    // Do something with all results});
        //     console.log(arrayOfResults)
        // })
    })
}

validReadings(new Date("2020-01-14 19:42:00"), new Date())
    .then((subset) => assembleUsefulTable(subset))
    .then((table) => mergeIdentities(table))
    .then((res) => console.log(res))
