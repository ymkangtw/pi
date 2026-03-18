module.exports = (sequelize, DataTypes) => {
    const weeklyreportbyprj = sequelize.define('weeklyreportbyprj', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        inputdate:          { type: DataTypes.STRING }, 
        ofgroup:            { type: DataTypes.STRING(4) }, 
        weekwork:           { type: DataTypes.TEXT } // as NVARCHAR(MAX)
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define weeklyreportbyprj model');
    return weeklyreportbyprj;
};