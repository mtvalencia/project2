module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("game", {
    name: DataTypes.STRING,
    isOver: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      field: "is_over"
    }
  });
  return Game;
};
