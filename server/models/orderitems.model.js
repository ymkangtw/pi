module.exports = (sequelize, DataTypes) => {
    const orderitems = sequelize.define('orderitems', {
        jobno:                      { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        subjobno:                   { type: DataTypes.INTEGER },
        serialno:                   { type: DataTypes.INTEGER },        // 請購案編號 F.K. => Orders.item
        orderno:                    { type: DataTypes.STRING(16) },     // 訂單號碼 (合約編號)
        item:                       { type: DataTypes.INTEGER },        // 細項編號
        name:                       { type: DataTypes.STRING(1024) },   // 物品名稱
        materialcode:               { type: DataTypes.STRING(16) },     // 物料編號
        quality:                    { type: DataTypes.STRING(60) },     // 品質 <-- 未使用
        main_specification:         { type: DataTypes.TEXT },           // 主要規範 <-- 未使用
        specification_code:         { type: DataTypes.STRING(12) },     // 規範編號 <-- 未使用
        unit_price:                 { type: DataTypes.FLOAT },          // 單價
        unit:                       { type: DataTypes.STRING(12) },     // 單位
        quantity:                   { type: DataTypes.INTEGER },        // 數量
        supplierid:                 { type: DataTypes.STRING(20) },     // 廠商編號(統編)
        esti_unit_price:            { type: DataTypes.INTEGER },        // 預估單價
        specification_path:         { type: DataTypes.STRING(120) },    // 規範存放位置 <-- 未使用
        receivecheck_esti_date:     { type: DataTypes.STRING },         // 預定驗收日期
        receivecheck_date:          { type: DataTypes.STRING },         // 驗收日期
        delivery_esti_date:         { type: DataTypes.STRING },         // 預定交貨日期
        delivery_date:              { type: DataTypes.STRING },         // 交貨日期
        currency:                   { type: DataTypes.STRING(10) },     // 幣別
        exchangerate:               { type: DataTypes.FLOAT },          // 匯率
        category:                   { type: DataTypes.STRING(16) },     // 產品類別
        estiexchangerate:           { type: DataTypes.FLOAT },          // 預估匯率
        receivecheckratio:          { type: DataTypes.FLOAT },          // 驗收比例 0~100
        checkquantity:              { type: DataTypes.FLOAT },          // 驗收數量? <-- 未使用
        name_q:                     { type: DataTypes.STRING(1024) },   // ? <-- 未使用
        wage:                       { type: DataTypes.FLOAT }           // ? <-- 未使用
    }, {
        //tableName: 'orders',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define orderitems model');
    return orderitems;
};