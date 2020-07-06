/*eslint-disable max-len*/
'use strict';

module.exports = function (sequelize, dataTypes) {
    const SavedJob = sequelize.define('savedJob', {
        id: {
            type: dataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: dataTypes.STRING
        }
    }, {
        tableName: 'saved-job',
        timestamp: true,
        collate: 'utf8_unicode_ci',
        indexes: []
    });

    SavedJob.associate = function (models) {
        this.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user'
        });
        this.belongsTo(models.job, {
            foreignKey: 'jobId',
            as: 'job'
        });
    };

    return SavedJob;
};
