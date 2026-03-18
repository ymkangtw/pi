module.exports = (app, router) => {

  const fs = require('fs');
  const path = require('path');

  const basename = path.basename(__filename);

  //load all route model
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      //get filename: [xxxxx.route].js
      const filename = file.slice(0, -3);
      //get routename: [xxxxx].route.js
      const routename = file.slice(0, -9);
      //console.log(`${filename}, ${routename}`);
      require(path.join(__dirname, filename))(app, router);
      //db[modelname] = require(path.join(__dirname, filename))(sequelize, DataTypes);
    });
};