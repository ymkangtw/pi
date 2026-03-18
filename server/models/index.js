const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes, QueryTypes, Op } = require('sequelize');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const basename = path.basename(__filename);

/*
//Override timezone formatting for MSSQL
DataTypes.DATE.prototype._stringify = function _stringify(date, options) {
    date = this._applyTimezone(date, options);
    return date.format('YYYY-MM-DD HH:mm:ss');
}.bind(DataTypes.DATE.prototype);
*/
//

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 1433,
        dialect: 'mssql',
        logging: (msg) => console.log(msg),
        dialectOptions: {
            options: {
                instanceName: process.env.DB_INSTANCE || 'MSSQLSERVER',
                encrypt: process.env.DB_ENCRYPT === 'true'
            }
        },
        pool: {
            max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
            min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
            acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
            idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000
        }
    }
);

const db = {};
//db.equip = require('./equip.model')(sequelize, DataTypes);

//load all database model
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    //get filename: [xxxxx.model].js
    const filename = file.slice(0, -3);
    //get modelname: [xxxxx].model.js
    const modelname = file.slice(0, -9);
    db[modelname] = require(path.join(__dirname, filename))(sequelize, DataTypes);
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the sequelize connection instance to be used around our app.
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.DataTypes = DataTypes;
db.QueryTypes = QueryTypes;
db.Op = Op;

module.exports = db;
