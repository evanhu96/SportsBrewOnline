const Rankings = require("../../../server/models/Rankings");
const DefRankings = require("../../../server/models/DefRankings");
const { dailyAveragesPlayers,teamDefRankings } = require("../../aggregates");
async function main() {
  try {
    console.log("inside rankings");
    const players = await dailyAveragesPlayers();
    console.log(players);
    console.log("Players created");
    // console.log(players);
    await Rankings.deleteMany({});
    console.log("Rankings deleted");
    await Rankings.insertMany(players);
    console.log("Rankings created");

    const defense = await teamDefRankings();
    console.log("DefRankings created", defense);
    await DefRankings.deleteMany({});
    console.log("DefRankings deleted");
    await DefRankings.insertMany(defense);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}
module.exports = main;
