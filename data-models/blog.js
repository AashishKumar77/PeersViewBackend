/*eslint-disable max-len*/
'use strict';

module.exports = function (sequelize, dataTypes) {
    const Blog = sequelize.define('blog', {
        id: {
            type: dataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: dataTypes.STRING
        },
        content: {
            type: dataTypes.TEXT
        },
        userId: {
            type: dataTypes.STRING,
            required: true
        }
    }, {
        tableName: 'blog',
        timestamp: true,
        collate: 'utf8_unicode_ci',
        indexes: []
    });

    Blog.associate = function (models) {
        this.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return Blog;
};
