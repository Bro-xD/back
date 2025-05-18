module.exports = (sequelize, DataTypes) => {
    const RefugeElement = sequelize.define('RefugeElement', {
        refugeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('emoji', 'image'),
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false, // Ex. "😊" pour emoji, ou URL pour image
        },
        positionX: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0, // Position X dans le cadre (en pourcentage ou pixels)
        },
        positionY: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0, // Position Y dans le cadre
        },
        size: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 50, // Taille de l'élément (en pixels ou pourcentage)
        },
    });

    RefugeElement.associate = models => {
        RefugeElement.belongsTo(models.Refuge, { foreignKey: 'refugeId' });
    };

    return RefugeElement;
};