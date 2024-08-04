const BoxScore = require("../../server/models/BoxScore");
const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb+srv://evanhughes66:r74JYDnfjSONT28r@cluster0.6fswh5n.mongodb.net/NBA",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", async () => {
const main = async () => {
  try {
    const teamAverages = await BoxScore.aggregate([
      { $match: { starter: true } }, // Filter for starters
      // lookup game
      {
        $lookup: {
          from: "games",
          let: { gameId: "$gameId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$gameId", "$$gameId"] } } },
            { $project: { dateEpoch: 1, year: 1 } },
          ],
          as: "game",
        },
      },
      // match 2024
      { $match: { "game.year": 2024 } },
      { $unwind: "$game" },
      // lookup teamgame with same gameId and team and projecgt only team
      {
        $lookup: {
          from: "teamgames",
          let: { gameId: "$gameId", team: "$team" },

          // sort by gameId and only get last 30 games with greatest gameIds
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$gameId", "$$gameId"] },
                    { $ne: ["$team", "$$team"] },
                  ],
                },
              },
            },
            { $project: { team: 1 } },
          ],
          as: "teamgame",
        },
      },
      { $unwind: "$teamgame" },
      // sort by dateEpoch
      { $sort: { "game.dateEpoch": 1 } },

      {
        // group by teamgame.team and position  and get arrays of pts, ast, reb

        $group: {
          _id: { team: "$teamgame.team", position: "$position" },
          pts: { $push: "$PTS" },
          ast: { $push: "$AST" },
          reb: { $push: "$REB" },
        },
      },
      // $slice to get last 30 games
      {
        $project: {
          team: "$_id.team",
          pts: { $sum: { $slice: ["$pts", -30] } },
          ast: { $sum: { $slice: ["$ast", -30] } },
          reb: { $sum: { $slice: ["$reb", -30] } },
        },
      },
    ]);
    const filtered = [];
    teamAverages.forEach((team) => {
      if (!team._id.team.includes("-")) filtered.push(team);
    });
    // group by position
    const grouped = await filtered.reduce((acc, curr) => {
      // get trimmed position
      curr._id.position = curr._id.position.trim();
      if (!acc[curr._id.position]) {
        acc[curr._id.position] = [];
      }
      acc[curr._id.position].push(curr);
      return acc;
    }, {});
    // !!! figure out if  i am getting different lengths of arrays for each position depending on how many of that player they saw
    const ranked = [];
    const positions = Object.keys(grouped);
    for (const position of positions) {
      const ptsArray = grouped[position].map((team) => team.pts);
      const astArray = grouped[position].map((team) => team.ast);
      const rebArray = grouped[position].map((team) => team.reb);
      const ptsRank = ptsArray.sort((a, b) => b - a);
      const astRank = astArray.sort((a, b) => b - a);
      const rebRank = rebArray.sort((a, b) => b - a);
      const ptsRankings = grouped[position].map((team) => {
        return {
          team: team._id.team,
          pts: ptsRank.indexOf(team.pts) + 1,
        };
      });
      const astRankings = grouped[position].map((team) => {
        return {
          team: team._id.team,
          ast: astRank.indexOf(team.ast) + 1,
        };
      });
      const rebRankings = grouped[position].map((team) => {
        return {
          team: team._id.team,
          reb: rebRank.indexOf(team.reb) + 1,
        };
      });
      const ptsRankingsObj = ptsRankings.reduce((acc, curr) => {
        acc[curr.team] = curr.pts;
        return acc;
      }, {});
      const astRankingsObj = astRankings.reduce((acc, curr) => {
        acc[curr.team] = curr.ast;
        return acc;
      }, {});
      const rebRankingsObj = rebRankings.reduce((acc, curr) => {
        acc[curr.team] = curr.reb;
        return acc;
      }, {});
      ptsRankingsObj.position = position;
      astRankingsObj.position = position;
      rebRankingsObj.position = position;
      ptsRankingsObj.prop = "PTS";
      astRankingsObj.prop = "AST";
      rebRankingsObj.prop = "REB";

      ranked.push(ptsRankingsObj, astRankingsObj, rebRankingsObj);
    }
    return ranked;
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = main;
// main();
// });
