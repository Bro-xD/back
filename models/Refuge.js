module.exports = (sequelize, DataTypes) => {
    const Refuge = sequelize.define('Refuge', {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        emotion: {
            type: DataTypes.ENUM('drama', 'humor', 'melancholy', 'cringe', 'zen'),
            defaultValue: 'melancholy',
        },
        primaryColor: {
            type: DataTypes.STRING,
            defaultValue: '#ffffff',
        },
        secondaryColor: {
            type: DataTypes.STRING,
            defaultValue: '#000000',
        },
        emoji: {
            type: DataTypes.STRING,
            defaultValue: '💔',
        },
        sceneType: {
            type: DataTypes.ENUM('island', 'room', 'desert', 'forest'),
            defaultValue: 'room',
        },
        soundUrl: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        story: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },
        backgroundUrl: {
            type: DataTypes.STRING,
            defaultValue: '', // URL de l'image de fond ou vide pour un fond par défaut
        },
        elements: {
            type: DataTypes.JSON,
            allowNull: true
        },
         background: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reactions: {
            type: DataTypes.JSON,
            allowNull: true
        },
    });

    Refuge.associate = models => {
        Refuge.belongsTo(models.User, { foreignKey: 'userId' });
        Refuge.hasMany(models.RefugeElement, { foreignKey: 'refugeId', onDelete: 'CASCADE' });
    };

    return Refuge;
};