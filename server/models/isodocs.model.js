module.exports = (sequelize, DataTypes) => {
    const isodocs = sequelize.define('isodocs', {
        isodocid:           { type: DataTypes.STRING(20), primaryKey: true, unique: true },
        formdept:           { type: DataTypes.STRING(4) },
        isono:              { type: DataTypes.STRING(10) },
        isoname:            { type: DataTypes.TEXT },
        isoversion:         { type: DataTypes.STRING(4) },
        approveddate:       { type: DataTypes.STRING },
        docno:              { type: DataTypes.STRING(4) },
        docname:            { type: DataTypes.TEXT },
        filename:           { type: DataTypes.TEXT },
        filepath:           { type: DataTypes.TEXT },
        note:               { type: DataTypes.STRING(20) }
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define isodocs model');
    return isodocs;
};