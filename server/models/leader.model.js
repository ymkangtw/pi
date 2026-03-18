module.exports = (sequelize, DataTypes) => {
    const leader = sequelize.define('leader', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        employeeno:         { type: DataTypes.STRING(6) },
        begindate:          { type: DataTypes.STRING },
        enddate:            { type: DataTypes.STRING },
        note:               { type: DataTypes.STRING(60) },
        y6nleader:          { type: DataTypes.STRING(16) }
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define leader model');
    return leader;
};