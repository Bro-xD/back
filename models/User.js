const { nanoid } = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
        },

        // Avatar 3D (minimal, mais stylé)
        avatarConfig: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ID unique
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            defaultValue: () => nanoid(10),
        },
    });

    User.associate = models => {
        User.hasOne(models.Refuge, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };

    return User;
};
