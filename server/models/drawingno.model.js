module.exports = (sequelize, DataTypes) => {
    const drawingno = sequelize.define('drawingno', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        employeeno:         { type: DataTypes.STRING(6) },
        drawingtitle:       { type: DataTypes.STRING(60) },
        drawingno_st:       { type: DataTypes.STRING(18) },
        drawingno_sp:       { type: DataTypes.STRING(18) },
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define drawingno model');
    return drawingno;
};