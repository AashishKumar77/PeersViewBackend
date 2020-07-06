/*eslint-disable max-len*/
'use strict';

module.exports = function (sequelize, dataTypes) {
    const ManualJob = sequelize.define('manualJob', {
        id: {
            type: dataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: dataTypes.STRING
        },
        company: {
            type: dataTypes.STRING
        },
        jobfunction: {
            type: dataTypes.TEXT
        },
        deadline: {
            type: dataTypes.DATE
        },
        source_link: {
            type: dataTypes.TEXT
        },
        status: {
            type: dataTypes.STRING
        },
        isApplied: {
            type: dataTypes.BOOLEAN,
            default: false
        }
    }, {
        tableName: 'manual-job',
        timestamp: true,
        collate: 'utf8_unicode_ci',
        indexes: []
    });

    ManualJob.associate = function (models) {
        this.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return ManualJob;
};
