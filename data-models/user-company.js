'use strict';

/**
 * This is the course of the student
 * or the course the ex-student(professionals) in which
 * the ex-student can have many course or field
 * of expertise
 */

module.exports = function (sequelize, dataTypes) {
  const UserCompany = sequelize.define('userCompany', {
    id: {
      type: dataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'user_company',
    timestamp: true,
    collate: 'utf8_unicode_ci',
    indexes: []
  });

  UserCompany.associate = function (models) {
    this.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user'
    });
    this.belongsTo(models.user, {
      foreignKey: 'companyUserId',
      as: 'companyuser'
    });
  };

  return UserCompany;
};
