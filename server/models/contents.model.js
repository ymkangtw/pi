module.exports = (sequelize, DataTypes) => {
    const contents = sequelize.define('contents', {
        jobno:              { type: DataTypes.STRING(13), primaryKey: true, unique: true },
        workcontent:        { type: DataTypes.TEXT }, // as NVARCHAR(MAX)
        basicby:            { type: DataTypes.STRING(16) },
        hardwareby:         { type: DataTypes.STRING(16) },
        softwareby:         { type: DataTypes.STRING(16) },
        condesignby:        { type: DataTypes.STRING(16) },
        materialby:         { type: DataTypes.STRING(16) },
        constructionby:     { type: DataTypes.STRING(16) },
        equipmentby:        { type: DataTypes.STRING(16) },
        workduty:           { type: DataTypes.TEXT }
    }, {
        //tableName: 'basic',
        freezeTableName: true, //model name == table name
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    console.log('define contents model');
    return contents;
};