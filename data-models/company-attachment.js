'use strict';

module.exports = function (sequelize, dataTypes) {
  const CompanyAttachment = sequelize.define('companyAttachment', {
    id: {
      type: dataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    usage: {
      type: new dataTypes.ENUM('logo','image', 'poster', 'video')
    },
    cloudinaryPublicId: {
      type: dataTypes.STRING,
    }
  }, {
    tableName: 'company_attachment',
    timestamp: true,
    collate: 'utf8_unicode_ci',
    indexes: []
  });

  return CompanyAttachment;
};
