module.exports = (sequelize, DataTypes) => {
    const basic = sequelize.define('basic', {
        // note: if model column not define a primarykey, sequelize uses [id] by default. ([id] will be added automatically by insert command)
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        projectno:          { type: DataTypes.STRING(16) },
        jobname:            { type: DataTypes.STRING(60) },
        appdept:            { type: DataTypes.STRING(12) },
        approvalno:         { type: DataTypes.STRING(64) },
        jobtype:            { type: DataTypes.STRING(16) },
        joborderno:         { type: DataTypes.STRING(64) },
        designtype:         { type: DataTypes.STRING(12) },
        totalbudget:        { type: DataTypes.INTEGER },
        electricalbudget:   { type: DataTypes.INTEGER },
        budgetyearst:       { type: DataTypes.INTEGER },
        budgetyearsp:       { type: DataTypes.INTEGER },
        esti_mh:            { type: DataTypes.INTEGER },
        esti_dwg:           { type: DataTypes.INTEGER },
        esti_start_date:    { type: DataTypes.STRING },
        esti_fin_date:      { type: DataTypes.STRING },
        act_start_date:     { type: DataTypes.STRING },
        act_fin_date:       { type: DataTypes.STRING },
        status:             { type: DataTypes.STRING(12) },
        idealreportno:      { type: DataTypes.STRING(20) },
        finalreportno:      { type: DataTypes.STRING(20) },
        penddate:           { type: DataTypes.STRING },
        resumedate:         { type: DataTypes.STRING },
        pendreason:         { type: DataTypes.STRING(255) },
        size:               { type: DataTypes.STRING(2) },
        esti_prg:           { type: DataTypes.FLOAT },
        prg:                { type: DataTypes.FLOAT },
        design_esti_prg:    { type: DataTypes.FLOAT },
        design_prg:         { type: DataTypes.FLOAT },
        leadernow:          { type: DataTypes.STRING(10) },
        availableyearmonth: { type: DataTypes.STRING(6) },
        y6tbudget:          { type: DataTypes.INTEGER },
        budgetequipment:    { type: DataTypes.INTEGER },
        budgetdesign:       { type: DataTypes.INTEGER },
        y6ncntweight:       { type: DataTypes.FLOAT },
        y6nconweight:       { type: DataTypes.FLOAT },
        y6nbudget:          { type: DataTypes.INTEGER },
        y6nexpense:         { type: DataTypes.INTEGER },
        w61budget:          { type: DataTypes.INTEGER },
        w61expense:         { type: DataTypes.INTEGER },
        budgety6turnkey:    { type: DataTypes.INTEGER },
        techfield:          { type: DataTypes.INTEGER },
        ownerdept:          { type: DataTypes.STRING(32) },
        ownername:          { type: DataTypes.STRING(32) }
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define basic model');
    return basic;
};
