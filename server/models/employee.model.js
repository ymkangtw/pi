module.exports = (sequelize, DataTypes) => {
    const employee = sequelize.define('employee', {
        employeeno:         { type: DataTypes.STRING(6), primaryKey: true, unique: true },
        name:               { type: DataTypes.STRING(12) },
        ofgroup:            { type: DataTypes.STRING(4) },
        titleid:            { type: DataTypes.STRING(20) },
        birthday:           { type: DataTypes.STRING },
        address:            { type: DataTypes.STRING(60) },
        phone:              { type: DataTypes.STRING(16) },
        mobilephone:        { type: DataTypes.STRING(16) },
        email:              { type: DataTypes.STRING(50) },
        ofy6tdate:          { type: DataTypes.STRING },
        ofcscdate:          { type: DataTypes.STRING },
        title:              { type: DataTypes.STRING(20) },
        state:              { type: DataTypes.STRING(10) },
        ofgroup1:           { type: DataTypes.STRING(4) }
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define employee model');
    return employee;
};