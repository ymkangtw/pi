module.exports = (sequelize, DataTypes) => {
    const monthbyproject = sequelize.define('monthbyproject', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        subjobno:           { type: DataTypes.INTEGER }, 
        yearmonth:          { type: DataTypes.STRING(6) },

        id_lmn_mh:          { type: DataTypes.FLOAT },
        id_lmn_dwg:         { type: DataTypes.INTEGER },
        id_accu_mh:         { type: DataTypes.FLOAT },
        id_accu_dwg:        { type: DataTypes.INTEGER },
        id_esti_prg:        { type: DataTypes.FLOAT },
        id_prg:             { type: DataTypes.FLOAT },

        bd_lmn_mh:          { type: DataTypes.FLOAT },
        bd_lmn_dwg:         { type: DataTypes.INTEGER },
        bd_accu_mh:         { type: DataTypes.FLOAT },
        bd_accu_dwg:        { type: DataTypes.INTEGER },
        bd_esti_prg:        { type: DataTypes.FLOAT },
        bd_prg:             { type: DataTypes.FLOAT },

        dd_lmn_mh:          { type: DataTypes.FLOAT },
        dd_lmn_dwg:         { type: DataTypes.INTEGER },
        dd_accu_mh:         { type: DataTypes.FLOAT },
        dd_accu_dwg:        { type: DataTypes.INTEGER },
        dd_esti_prg:        { type: DataTypes.FLOAT },
        dd_prg:             { type: DataTypes.FLOAT },

        cnt_lmn_mh:         { type: DataTypes.FLOAT },
        cnt_lmn_dwg:        { type: DataTypes.INTEGER },
        cnt_accu_mh:        { type: DataTypes.FLOAT },
        cnt_accu_dwg:       { type: DataTypes.INTEGER },
        cnt_esti_prg:       { type: DataTypes.FLOAT },
        cnt_prg:            { type: DataTypes.FLOAT },

        buy_lmn_mh:         { type: DataTypes.FLOAT },
        buy_lmn_dwg:        { type: DataTypes.INTEGER },
        buy_accu_mh:        { type: DataTypes.FLOAT },
        buy_accu_dwg:       { type: DataTypes.INTEGER },
        buy_esti_prg:       { type: DataTypes.FLOAT },
        buy_prg:            { type: DataTypes.FLOAT },

        con_lmn_mh:         { type: DataTypes.FLOAT },
        con_accu_mh:        { type: DataTypes.FLOAT },
        con_esti_prg:       { type: DataTypes.FLOAT },
        con_prg:            { type: DataTypes.FLOAT },

        com_lmn_mh:         { type: DataTypes.FLOAT },
        com_accu_mh:        { type: DataTypes.FLOAT },
        com_esti_prg:       { type: DataTypes.FLOAT },
        com_prg:            { type: DataTypes.FLOAT },

        dcs_lmn_mh:         { type: DataTypes.FLOAT },
        dcs_lmn_dwg:        { type: DataTypes.INTEGER },
        dcs_accu_mh:        { type: DataTypes.FLOAT },
        dcs_accu_dwg:       { type: DataTypes.INTEGER },
        dcs_esti_prg:       { type: DataTypes.FLOAT },
        dcs_prg:            { type: DataTypes.FLOAT },

        plc_lmn_mh:         { type: DataTypes.FLOAT },
        plc_lmn_dwg:        { type: DataTypes.INTEGER },
        plc_accu_mh:        { type: DataTypes.FLOAT },
        plc_accu_dwg:       { type: DataTypes.INTEGER },
        plc_esti_prg:       { type: DataTypes.FLOAT },
        plc_prg:            { type: DataTypes.FLOAT },

        rpt_lmn_mh:         { type: DataTypes.FLOAT },
        rpt_lmn_dwg:        { type: DataTypes.INTEGER },
        rpt_accu_mh:        { type: DataTypes.FLOAT },
        rpt_accu_dwg:       { type: DataTypes.INTEGER },
        rpt_esti_prg:       { type: DataTypes.FLOAT },
        rpt_prg:            { type: DataTypes.FLOAT },

        prg_esti:           { type: DataTypes.FLOAT },
        prg:                { type: DataTypes.FLOAT },
        prg_design_esti:    { type: DataTypes.FLOAT },
        prg_design:         { type: DataTypes.FLOAT },
        
        ifupdated:          { type: DataTypes.BOOLEAN },
        monthwork:          { type: DataTypes.TEXT } // as NVARCHAR(MAX)

    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define monthbyproject model');
    return monthbyproject;
};