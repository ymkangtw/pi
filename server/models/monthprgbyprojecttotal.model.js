module.exports = (sequelize, DataTypes) => {
    const monthprgbyprojecttotal = sequelize.define('monthprgbyprojecttotal', {
        jobno:                  { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        yearmonth:              { type: DataTypes.STRING(6) }, 
        prg_esti:               { type: DataTypes.FLOAT },
        prg:                    { type: DataTypes.FLOAT },
        prg_design_esti:        { type: DataTypes.FLOAT },
        prg_design:             { type: DataTypes.FLOAT },
        y6ncntestiprg:          { type: DataTypes.FLOAT },
        y6ncntprg:              { type: DataTypes.FLOAT },
        y6nconestiprg:          { type: DataTypes.FLOAT },
        y6nconprg:              { type: DataTypes.FLOAT },
        y69estiprg:             { type: DataTypes.FLOAT },
        y69prg:                 { type: DataTypes.FLOAT },
        worksummaried:          { type: DataTypes.TEXT },
        worksummariednext:      { type: DataTypes.TEXT },
        tracesummaried:         { type: DataTypes.TEXT },
        isoprogressdescription: { type: DataTypes.TEXT },
        y6nwork:                { type: DataTypes.TEXT },
        y6nrequest:             { type: DataTypes.TEXT }
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define monthprgbyprojecttotal model');
    return monthprgbyprojecttotal;
};