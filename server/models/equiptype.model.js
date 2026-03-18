module.exports = (sequelize, DataTypes) => {
    const equiptype = sequelize.define('equiptype', {
        //資料表若未定義primaryKey, model會自動新增id column
        typeid:     { type: DataTypes.STRING(8), primaryKey: true, unique: true },
        typename:   { type: DataTypes.STRING(20) }
    }, {
        //tableName: 'equiptype',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define equiptype model');
    return equiptype;  
};