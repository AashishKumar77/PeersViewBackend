/*eslint-disable max-len*/
'use strict';

module.exports = function (sequelize, dataTypes) {
    const Company = sequelize.define('company', {
        id: {
            type: dataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        company: {
            type: dataTypes.STRING
        },
        company_type: {
            type: dataTypes.STRING
        },
        company_size: {
            type: dataTypes.STRING
        },
        company_contact: {
            type: dataTypes.STRING
        },
        country: {
            type: dataTypes.STRING
        },
        city: {
            type: dataTypes.STRING
        },
        recruit: {
            type: dataTypes.INTEGER
        },
        industry: {
            type: dataTypes.STRING
        },
        company_bio: {
            type: dataTypes.TEXT
        },
        logo: {
            type: dataTypes.STRING
        }

    }, {
        tableName: 'company',
        timestamp: true,
        collate: 'utf8_unicode_ci',
        indexes: []
    });
    Company.associate = function (models) {
        this.hasMany(models.companyAttachment);
        this.belongsTo(models.user,{
            foreignKey: 'userId',
            as: 'user'
        });
      };

    return Company;
};
