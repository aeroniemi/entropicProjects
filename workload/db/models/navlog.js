const chalk = require('chalk');
const { Sequelize, Op, Model, DataTypes, Deferrable } = require('sequelize');
const { Flight } = require("./flight.js");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/core.db'
});
class Navlog extends Model {
    async fromId(id) {
        return await Navlog.findOne({ where: { navlog_id: id } })
    }
    async fromDetails(flight_id, update_time) { //! may have scenarios where more than one flight with same callsign
        return await Navlog.findOne({ where: { flight_id: flight_id, update_time: update_time } })
    }
    async getEntrysByFlightId(flight_id) {
        return await Navlog.findAll({ where: { flight_id: flight_id } })
    }
    getCoord() {
        return [this.latitude, this.longitude]
    }
    getFlightId() {
        return this.flight_id
    }
    getID() {
        return this.navlog_id
    }
}

Navlog.init({
    navlog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    flight_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Flight,
            key: 'flight_id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
    update_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    latitude: {
        type: DataTypes.NUMBER
    },
    longitude: {
        type: DataTypes.NUMBER
    },
    altitude: {
        type: DataTypes.INTEGER
    },
    groundspeed: {
        type: DataTypes.NUMBER
    },
    transponder: {
        type: DataTypes.INTEGER

    },
    heading: {
        type: DataTypes.NUMBER
    },
    qnh: {
        type: DataTypes.NUMBER
    },
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    // modelName: 'Navlog' // We need to choose the model name
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
exports.Navlog = Navlog