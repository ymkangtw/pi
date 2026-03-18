module.exports = (sequelize, DataTypes) => {
    const monthbyitem = sequelize.define('monthbyitem', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        //jobno:              { type: DataTypes.STRING(13) },
        subjobno:           { type: DataTypes.INTEGER },
        yearmonth:          { type: DataTypes.STRING(6) },
        jobid:              { type: DataTypes.STRING(3) },
        lmn_mh:             { type: DataTypes.INTEGER },
        lmn_dwg:            { type: DataTypes.INTEGER },
        accu_mh:            { type: DataTypes.INTEGER },
        accu_dwg:           { type: DataTypes.INTEGER },
        esti_prg:           { type: DataTypes.INTEGER },
        act_prg:            { type: DataTypes.INTEGER },
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define monthbyitem model');
    return monthbyitem;
};