var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.game.findAll({}).then(function (dbGames) {
      res.render("index", {
        msg: "Create a Raffle",
        games: dbGames
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/games/:id", function (req, res) {
    db.game
      .findOne({
        where: { id: req.params.id },
        include: {
          model: db.entry,
          as: "entries"
        }
      })
      .then(function (dbGames) {
        var entries = 0;
        var winner;
        dbGames.entries.map(function (entry) {
          entries += entry.points;
          if (entry.didWin) {
            winner = entry;
          }
        });
        res.render("gameDetail", {
          game: dbGames,
          numPeople: dbGames.entries.length,
          numEntries: entries,
          winner: winner
        });
      });
  });

  // Load game page and run raffle
  app.get("/games/:id/raffle", function (req, res) {
    // check game is open
    db.game
      .findOne({
        where: { id: req.params.id },
        include: {
          model: db.entry,
          as: "entries"
        }
      })
      .then(function (currentGame) {
        var winner;
        if (!currentGame) {
          return res.status(404).render("raffle", {
            error: "No game with id " + req.params.id + " found."
          });
        } else if (currentGame.isOver) {
          // find existing winner
          for (var i = 0; i < currentGame.entries.length; i++) {
            if (currentGame.entries[i].didWin) {
              winner = currentGame.entries[i];
              break;
            }
          }
          console.log(winner);
           res.render("raffle", {
            game: currentGame,
            winner: winner
          });
        } else {
          // get new winner
          var tickets = [];
          for (var i = 0; i < currentGame.entries.length; i++) {
            for (var j = 0; j < currentGame.entries[i].points; j++) {
              tickets.push(currentGame.entries[i].id);
            }
          }
          var winningEntryId = tickets[Math.floor(Math.random() * tickets.length)];
          for (var i = 0; i < currentGame.entries.length; i++) {
            if (currentGame.entries[i].id === winningEntryId) {
              winner = currentGame.entries[i];
            }
          }
          // update entry and game
          db.entry
            .update(
              { didWin: 1 },
              {
                where: {
                  id: winningEntryId
                }
              })
            .then(function (resultEntry) {
              if (resultEntry) {
                db.game
                  .update(
                    {isOver: 1},
                    {
                      where: {
                        id: req.params.id
                      }
                    }
                  )
                  .then(function (resultGame) {
                     res.render("raffle", {
                      game: currentGame,
                      winner: winner
                    });
                  })
              }
            })
          }
        
        
      })
      .catch(function (error) {
        return res.status(500).render("raffle", {
          error: "Error getting winner: " + error
        });
      });
    // get entries
    // select winner
    // close game
    // db.game 





    // db.game.findOne({ where: { id: req.params.id } }).then(function (dbGames) {
    //   res.render("raffle", {
    //     game: dbGames
    //   });
    // });
  });

  app.get("/raffle", function (req, res) {
    res.render("raffle");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
