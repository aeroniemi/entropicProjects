#!/usr/bin/env node
let activities = require("./activities.js")
var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('watch', 'download datafeed every [seconds]', (yargs) => {
        yargs
            .option('maxAge', {
                describe: 'maximum age of last feed',
                default: 1000 * 60 * 1,
                type: "number"
            })
            .option('verbose', {
                alias: 'v',
                type: 'boolean',
                description: 'Run with verbose logging',
                default: true
            })
    }, (argv) => {
        if (argv.verbose) console.info(`Watching the datafeed. Will download every ${argv.maxAge} seconds.`)
        watch(argv.maxAge, argv.verbose)
    })
    .argv;
function watch(maxAge, verbose) {
    setInterval(() => activities.getNewest().then(
        function (newest) {
            let lastUpdated = new Date(newest * 1000);
            let age = Date.now() - lastUpdated
            if (age > maxAge) {
                if (verbose) console.info(`It's too old. Last updated: ${Math.round(age / (1000 * 60))} minutes ago`)
                activities.downloadLatestData()
            } else {
                if (verbose) console.info(`Last updated ${Math.round(age / (1000))} seconds ago`)
            }
        },
        function (error) { console.log(error) }
    ), maxAge / 2)
}