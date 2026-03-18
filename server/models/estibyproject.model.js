module.exports = (sequelize, DataTypes) => {
    const estibyproject = sequelize.define('estibyproject', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        subjobno:           { type: DataTypes.INTEGER },
        
        id_esti_mh:         { type: DataTypes.INTEGER },
        id_esti_dwg:        { type: DataTypes.INTEGER },
        id_esti_start_date: { type: DataTypes.STRING },
        id_start_date:      { type: DataTypes.STRING },
        id_esti_fin_date:   { type: DataTypes.STRING },
        id_fin_date:        { type: DataTypes.STRING },
        id_wt:              { type: DataTypes.FLOAT },      // used
        id_type:            { type: DataTypes.STRING(10) }, // used

        bd_esti_mh:         { type: DataTypes.INTEGER },
        bd_esti_dwg:        { type: DataTypes.INTEGER },
        bd_esti_start_date: { type: DataTypes.STRING },
        bd_start_date:      { type: DataTypes.STRING },
        bd_esti_fin_date:   { type: DataTypes.STRING },
        bd_fin_date:        { type: DataTypes.STRING },
        bd_wt:              { type: DataTypes.FLOAT },      // used
        bd_type:            { type: DataTypes.STRING(10) }, // used

        dd_esti_mh:         { type: DataTypes.INTEGER },
        dd_esti_dwg:        { type: DataTypes.INTEGER },
        dd_esti_start_date: { type: DataTypes.STRING },
        dd_start_date:      { type: DataTypes.STRING },
        dd_esti_fin_date:   { type: DataTypes.STRING },
        dd_fin_date:        { type: DataTypes.STRING },
        dd_wt:              { type: DataTypes.FLOAT },      // used
        dd_type:            { type: DataTypes.STRING(10) }, // used

        cnt_esti_mh:         { type: DataTypes.INTEGER },
        cnt_esti_dwg:        { type: DataTypes.INTEGER },
        cnt_esti_start_date: { type: DataTypes.STRING },
        cnt_start_date:      { type: DataTypes.STRING },
        cnt_esti_fin_date:   { type: DataTypes.STRING },
        cnt_fin_date:        { type: DataTypes.STRING },
        cnt_wt:              { type: DataTypes.FLOAT },      // used
        cnt_type:            { type: DataTypes.STRING(10) }, // used

        dcs_esti_mh:         { type: DataTypes.INTEGER },
        dcs_esti_dwg:        { type: DataTypes.INTEGER },
        dcs_esti_start_date: { type: DataTypes.STRING },
        dcs_start_date:      { type: DataTypes.STRING },
        dcs_esti_fin_date:   { type: DataTypes.STRING },
        dcs_fin_date:        { type: DataTypes.STRING },
        dcs_wt:              { type: DataTypes.FLOAT },      // used
        dcs_type:            { type: DataTypes.STRING(10) }, // used

        plc_esti_mh:         { type: DataTypes.INTEGER },
        plc_esti_dwg:        { type: DataTypes.INTEGER },
        plc_esti_start_date: { type: DataTypes.STRING },
        plc_start_date:      { type: DataTypes.STRING },
        plc_esti_fin_date:   { type: DataTypes.STRING },
        plc_fin_date:        { type: DataTypes.STRING },
        plc_wt:              { type: DataTypes.FLOAT },      // used
        plc_type:            { type: DataTypes.STRING(10) }, // used

        buy_esti_mh:         { type: DataTypes.INTEGER },
        buy_esti_dwg:        { type: DataTypes.INTEGER },
        buy_esti_start_date: { type: DataTypes.STRING },
        buy_start_date:      { type: DataTypes.STRING },
        buy_esti_fin_date:   { type: DataTypes.STRING },
        buy_fin_date:        { type: DataTypes.STRING },
        buy_wt:              { type: DataTypes.FLOAT },      // used
        buy_type:            { type: DataTypes.STRING(10) }, // used

        con_esti_mh:         { type: DataTypes.INTEGER },
        //**con_esti_dwg:        { type: DataTypes.INTEGER },
        con_esti_start_date: { type: DataTypes.STRING },
        con_start_date:      { type: DataTypes.STRING },
        con_esti_fin_date:   { type: DataTypes.STRING },
        con_fin_date:        { type: DataTypes.STRING },
        con_wt:              { type: DataTypes.FLOAT },      // used
        con_type:            { type: DataTypes.STRING(10) }, // used

        com_esti_mh:         { type: DataTypes.INTEGER },
        //**com_esti_dwg:        { type: DataTypes.INTEGER },
        com_esti_start_date: { type: DataTypes.STRING },
        com_start_date:      { type: DataTypes.STRING },
        com_esti_fin_date:   { type: DataTypes.STRING },
        com_fin_date:        { type: DataTypes.STRING },
        com_wt:              { type: DataTypes.FLOAT },      // used
        com_type:            { type: DataTypes.STRING(10) }, // used

        rpt_esti_mh:         { type: DataTypes.INTEGER },
        rpt_esti_dwg:        { type: DataTypes.INTEGER },
        rpt_esti_start_date: { type: DataTypes.STRING },
        rpt_start_date:      { type: DataTypes.STRING },
        rpt_esti_fin_date:   { type: DataTypes.STRING },
        rpt_fin_date:        { type: DataTypes.STRING },
        rpt_wt:              { type: DataTypes.FLOAT },      // used
        rpt_type:            { type: DataTypes.STRING(10) }, // used

        esti_start_date:    { type: DataTypes.STRING },
        esti_fin_date:      { type: DataTypes.STRING },

        estiprogresstext:   { type: DataTypes.STRING(2048) },
        estiprogresstexty6n:{ type: DataTypes.STRING(2048) }

    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define estibyproject model');
    return estibyproject;
};