module.exports = (sequelize, DataTypes) => {
    const task = sequelize.define('task', {
        jobid:              { type: DataTypes.STRING(3), primaryKey: true, unique: true },
        content:            { type: DataTypes.STRING(60) },
        classcode:          { type: DataTypes.STRING(12) },
        category:           { type: DataTypes.STRING(12) },
        reportindex:        { type: DataTypes.INTEGER },
        note:               { type: DataTypes.STRING(60) },
        fory6n:             { type: DataTypes.STRING(1) }

    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define task model');
    return task;
};