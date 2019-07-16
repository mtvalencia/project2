// var sequelize = require ("sequelize");
module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.import("./game");
  var Entry = sequelize.define("entry", {
    gameId: {
      unique: "uniqueUserForGame",
      type: DataTypes.INTEGER,
      references: {
        model: Game,
        key: "id",
        field: "game_id"
      }
    },
    name: {
      unique: "uniqueUserForGame",
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: DataTypes.STRING,
    points: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    didWin: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      field: "did_win"
    }
  });
  return Entry;
};
