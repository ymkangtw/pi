module.exports = (sequelize, DataTypes) => {
    const weeklyworkbyproject = sequelize.define('weeklyworkbyproject', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        subjobno:           { type: DataTypes.INTEGER }, 
        inputdate:          { type: DataTypes.STRING }, 
        content:            { type: DataTypes.TEXT } // as NVARCHAR(MAX)
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define weeklyworkbyproject model');
    return weeklyworkbyproject;
};