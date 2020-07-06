/*eslint-disable max-len*/
'use strict';

module.exports = function (sequelize, dataTypes) {
    const Scholarship = sequelize.define('scholarship', {
        id: {
            type: dataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: dataTypes.STRING
        },
        details: {
            type: dataTypes.TEXT
        },
        country: {
            type: dataTypes.STRING
        },
        city: {
            type: dataTypes.STRING
        },
        contact: {
            type: dataTypes.STRING
        },
        type: {
            type: dataTypes.INTEGER
        },
        eligibility_requirements: {
            type: dataTypes.TEXT
        },
        benefits: {
            type: dataTypes.TEXT
        },
        deadline: {
            type: dataTypes.DATE
        },
        source_link: {
            type: dataTypes.TEXT
        },
        price: {
            type: dataTypes.DECIMAL
        },
        currency: {
            type: dataTypes.STRING
        }
    }, {
        tableName: 'scholarship',
        timestamp: true,
        collate: 'utf8_unicode_ci',
        indexes: []
    });

    Scholarship.associate = function (models) {
        this.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return Scholarship;
};
