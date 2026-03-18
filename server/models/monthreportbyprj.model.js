module.exports = (sequelize, DataTypes) => {
    const monthreportbyprj = sequelize.define('monthreportbyprj', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        yearmonth:          { type: DataTypes.STRING(6) }, 
        ofgroup:            { type: DataTypes.STRING(4) }, 
        monthwork:          { type: DataTypes.TEXT } // as NVARCHAR(MAX)
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define monthreportbyprj model');
    return monthreportbyprj;
};