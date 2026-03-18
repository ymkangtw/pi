module.exports = (sequelize, DataTypes) => {
    const member = sequelize.define('member', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        subjobno:           { type: DataTypes.INTEGER },
        employeeno:         { type: DataTypes.STRING(6) },
        weight:             { type: DataTypes.FLOAT },
        begindate:          { type: DataTypes.STRING }, // DATE format 改用 STRING 代替
        enddate:            { type: DataTypes.STRING },
        note:               { type: DataTypes.STRING(60) }
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define member model');
    return member;
};