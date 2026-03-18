module.exports = (sequelize, DataTypes) => {
    const estibyitem = sequelize.define('estibyitem', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        subjobno:           { type: DataTypes.INTEGER },
        jobid:              { type: DataTypes.STRING(3) },
        esti_dwg:           { type: DataTypes.INTEGER },
        esti_mh:            { type: DataTypes.INTEGER },
        esti_start_date:    { type: DataTypes.STRING },
        start_date:         { type: DataTypes.STRING },
        esti_fin_date:      { type: DataTypes.STRING },
        fin_date:           { type: DataTypes.STRING },
        design_type:        { type: DataTypes.STRING(12) },
        dwgno:              { type: DataTypes.STRING(20) },
        classcode:          { type: DataTypes.STRING(12) },
        listorder:          { type: DataTypes.INTEGER }
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define estibyitem model');
    return estibyitem;
};