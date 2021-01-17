const chalk = require('chalk');
const { Sequelize, Op, Model, DataTypes, Deferrable } = require('sequelize');
// const { Flight } = require("./models/flight.js");
// const { Navlog } = require("./navlog.js");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/core.db'
});
class Flight extends Model {
    async fromId(id) {
        return await Flight.findOne({ where: { flight_id: id } })
    }
    async fromDetails(cid, callsign) { //! may have scenarios where more than one flight with same callsign
        return await Flight.findOne({ where: { cid: cid, callsign: callsign } })
    }
    getID() {
        return this.getFlightId()
    }
    getFlightId() {
        return this.flight_id
    }
    getLogon() {
        return this.logon_time
    }
    getDep() {
        return this.departure
    }
    getDest() {
        return this.arrival
    }
    getCallsign() {
        return this.callsign
    }
    getCid() {
        return this.cid
    }
    getPilotName() {
        return this.pilot_name
    }
}

Flight.init({
    flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    logon_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    cid: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    pilot_name: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    callsign: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    // modelName: 'Flight' // We need to choose the model name
});


// -----------------------------------------------------------------------------
// THings you could want to do
// -----------------------------------------------------------------------------
//? create a flight in code only
// flight.build({cid:1302142})
//? create a flight and push it to the database
// Flight.create({cid:1302142})
//? update
// edit the instance, then 
// await lenny.save()
//? delete
// await lenny.delete()
//? reload
// await lenny.reload();
//? only save some things
// await lenny.save({fields['cid']})
exports.Flight = Flight