module.exports = (sequelize, DataTypes) => {
    const ugroup = sequelize.define('ugroup', {
        groupno:            { type: DataTypes.STRING(5), primaryKey: true, unique: true },
        ofteam:             { type: DataTypes.STRING(4) },
        name:               { type: DataTypes.STRING(30) }
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define ugroup model');
    return ugroup;
};