module.exports = (sequelize, DataTypes) => {
    const factorycode = sequelize.define('factorycode', {
        fcode:              { type: DataTypes.STRING(4), primaryKey: true, unique: true },
        name:               { type: DataTypes.STRING(60) },
        description:        { type: DataTypes.STRING(60) },
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define factorycode model');
    return factorycode;
};