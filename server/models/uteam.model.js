module.exports = (sequelize, DataTypes) => {
    const uteam = sequelize.define('uteam', {
        teamno:             { type: DataTypes.STRING(4), primaryKey: true, unique: true },
        name:               { type: DataTypes.STRING(30) }
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define uteam model');
    return uteam;
};