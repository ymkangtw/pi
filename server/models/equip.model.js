module.exports = (sequelize, DataTypes) => {
    const equip = sequelize.define('equip', {
        //資料表若未定義primaryKey, model會自動新增id column
        equipid:    { type: DataTypes.STRING(8), primaryKey: true, unique: true },
        typeid:     { type: DataTypes.STRING(8) },
        equipno:    { type: DataTypes.STRING(20) },
        equipspec:  { type: DataTypes.STRING(40) },
        equipstatus:{ type: DataTypes.STRING(20) },
        note:       { type: DataTypes.STRING(20) }
    }, {
        //tableName: 'equip',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define equip model');
    return equip;
};