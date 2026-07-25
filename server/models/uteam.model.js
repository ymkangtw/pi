module.exports = (sequelize, DataTypes) => {
    const uteam = sequelize.define('uteam', {
        teamno:             { type: DataTypes.STRING(4), primaryKey: true, unique: true },
        name:               { type: DataTypes.STRING(30) },
        visible:            { type: DataTypes.BOOLEAN }    // 是否顯示於選單（PM01/PS01/PS02 以 visible=1 篩選）
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define uteam model');
    return uteam;
};