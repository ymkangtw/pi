module.exports = (sequelize, DataTypes) => {
    const orders = sequelize.define('orders', {
        jobno:                      { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        subjobno:                   { type: DataTypes.INTEGER },
        item:                       { type: DataTypes.INTEGER },
        orderno:                    { type: DataTypes.STRING(16) }, // 訂單號碼 (合約編號)
        purchase_esti_issue_date:   { type: DataTypes.STRING },     // 預定請購日期
        purchase_issue_date:        { type: DataTypes.STRING },     // 請購日期
        c1_issue_date:              { type: DataTypes.STRING },     // C1承辦日期
        c1_query_date:              { type: DataTypes.STRING },     //
        c1_order_esti_date:         { type: DataTypes.STRING },     // 預定訂購日期
        c1_order_date:              { type: DataTypes.STRING },     // 訂購日期
        delivery_esti_date:         { type: DataTypes.STRING },     // 預定交貨日期
        delivery_date:              { type: DataTypes.STRING },     // 交貨日期
        receivecheck_esti_date:     { type: DataTypes.STRING },     // 預定驗收日期
        receivecheck_date:          { type: DataTypes.STRING },     // 驗收日期
        c1_member:                  { type: DataTypes.STRING(12) }, // C1承辦人
        y6tserialno:                { type: DataTypes.STRING(12) }, // 請購序號
        content:                    { type: DataTypes.STRING(80) }, // 用途
        category:                   { type: DataTypes.INTEGER },     // 類別, ref: ordercategory
        jobid:                      { type: DataTypes.STRING(3) },  // 工作編號
        note:                       { type: DataTypes.TEXT },       // as NVARCHAR(MAX) <-- 未使用
        isturnkey:                  { type: DataTypes.BOOLEAN  },   // 外包
        budgetno:                   { type: DataTypes.STRING(16) }, // 預算編號 <-- 未使用
        estimateamount:             { type: DataTypes.FLOAT },      // 預估總價
        amount:                     { type: DataTypes.FLOAT },      // 總價
        formalorderno:              { type: DataTypes.STRING(10) }, // <-- 未使用
        currency:                   { type: DataTypes.STRING(3) },  // <-- 未使用
        jobcommandno:               { type: DataTypes.STRING(15) }, // <-- 未使用
        supplier_id:                { type: DataTypes.STRING(8) },  // <-- 未使用
        supplier_name:              { type: DataTypes.STRING(70) }, // <-- 未使用
        autoupdate:                 { type: DataTypes.BOOLEAN },    // <-- 未使用
        latedelivery2y61:           { type: DataTypes.STRING }      // <-- 未使用
    }, {
        //tableName: 'orders',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define orders model');
    return orders;
};