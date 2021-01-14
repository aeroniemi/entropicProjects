const https = require('https');
const fs = require('fs');
const apiUrl = "https://data.vatsim.net/v3/vatsim-data.json";

function downloadLatestData() {
    return new Promise(function (resolve, reject) {
        https.get(apiUrl, function (res) {
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                var data = JSON.parse(body);
                var date = Math.trunc(new Date(data.general.update_timestamp).getTime() / 1000);
                var fileName = date + ".json";
                fs.mkdir('./temp/', { recursive: true }, (err) => { if (err) throw err });
                fs.writeFile("./temp/" + fileName, JSON.stringify(data), "utf8", function (err) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    };
                    resolve(fileName);
                });
            });
        }).on('error', function (e) {
            console.error("Got an error: ", e);
            reject(e);
        });
    });
};
function getNewest() {
    return new Promise(function (resolve, reject) {
        var newest = 0;
        fs.readdir("./temp/", (err, files) => {
            // if (err) reject(err);
            if (files === undefined || files.length == 0) {
                resolve(1)
                return
            }
            newest = Math.max(...files.map(function (file) {
                return parseInt(file.substring(0, file.length - 5));
            }));
            resolve(newest);
            return
        });
    });
};


exports.downloadLatestData = downloadLatestData
exports.getNewest = getNewest