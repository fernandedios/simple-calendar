'use strict';
module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    start: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Task.associate = function(models) {
    Task.belongsTo(models.User, {
      foreignKey: 'userID',
      onDelete: 'CASCADE'
    });
  };
  return Task;
};