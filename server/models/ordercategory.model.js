module.exports = (sequelize, DataTypes) => {
    const ordercategory = sequelize.define('ordercategory', {
        categoryid:                 { type: DataTypes.INTEGER },
        categoryname:               { type: DataTypes.STRING(50) }
    }, {
        //tableName: 'orders',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define ordercategory model');
    return ordercategory;
};