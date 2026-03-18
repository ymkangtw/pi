module.exports = (sequelize, DataTypes) => {
    const taskcategory = sequelize.define('taskcategory', {
        jobtype:            { type: DataTypes.STRING(4), primaryKey: true, unique: true },
        category:           { type: DataTypes.STRING(12) },
        taskindex:          { type: DataTypes.INTEGER },
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define taskcategory model');
    return taskcategory;
};