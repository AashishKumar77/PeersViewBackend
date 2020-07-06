'use strict';

module.exports = function (sequelize, dataTypes) {
  const Industry = sequelize.define('industry', {
    id: {
      type: dataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: dataTypes.STRING
    }
  }, {
    tableName: 'industry',
    timestamp: true,
    collate: 'utf8_unicode_ci',
    indexes: []
  });

  return Industry;
};
