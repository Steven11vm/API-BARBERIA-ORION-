const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Privilege = sequelize.define('Privilege', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'privileges'
});

module.exports = Privilege;