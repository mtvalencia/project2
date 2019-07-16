var db = require("../models");

module.exports = function (app) {
  // Get all games
  app.get("/api/games", function (req, res) {
    db.game.findAll({}).then(function (dbGames) {
      res.json(dbGames);
    });
  });

  // Create a new game
  app.post("/api/games", function (req, res) {
    db.game
      .create({
        name: req.body.name
      })
      .then(function (dbGames) {
        res.json(dbGames);
      });
  });

  // Delete a game by id
  app.delete("/api/games/:gameId", function (req, res) {
    db.game
      .destroy({ where: { id: req.params.gameId } })
      .then(function (dbGames) {
        res.json(dbGames);
      });
  });

  // create entry
  app.post("/api/games/:gameId/enter", function(req, res) {
    db.entry
      .create({
        gameId: req.params.gameId,
        name: req.body.name,
        avatar: req.body.avatar,
        points: req.body.points
      })
      .then(function(entry) {
        res.json(entry);
      })
      .catch(function(e) {
        res.status(500).json(e);
      });
  });
};
