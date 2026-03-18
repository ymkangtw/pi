module.exports = (sequelize, DataTypes) => {
    const servicevalue = sequelize.define('servicevalue', {
        item:               { type: DataTypes.INTEGER, primaryKey: true, unique: true },
        setdate:            { type: DataTypes.STRING },
        genvalue:           { type: DataTypes.INTEGER },
        dcsvalue:           { type: DataTypes.INTEGER },
        plcvalue:           { type: DataTypes.INTEGER },
        approvalvalue:      { type: DataTypes.INTEGER },
        comvalue:           { type: DataTypes.INTEGER },
        unithourcost:       { type: DataTypes.INTEGER }

    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define servicevalue model');
    return servicevalue;
};