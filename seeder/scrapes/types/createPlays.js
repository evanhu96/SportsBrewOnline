const puppeteer = require("puppeteer");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const parsePlays = require("../playParseing/index.js");
const { fixTeams } = require("../playParseing/helpers");
const Play = require("../../../server/models/Play");
const translatedSelector = (xpath) => {
  return xpath
    .split("/")
    .filter((part) => part) // Remove empty parts
    .map((part) => {
      if (part.includes("[")) {
        const tagName = part.split("[")[0];
        const index = part.match(/\[(\d+)\]/)[1];
        return `${tagName}:nth-child(${index})`;
      } else {
        return part;
      }
    })
    .join(">");
};

const containerPath = translatedSelector("tbody:nth-child(3)");

const scrape = async ({ gameId, rosters, home, away }) => {
  home = fixTeams(home);
  away = fixTeams(away);
  const url = "https://www.espn.com/nba/playbyplay/_/gameId/" + gameId;
  const allPlays = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  console.log(url);
  const rolePropertyValue = "tablist"; // Replace with the actual value you're looking for

  const buttonSelector = `[role="${rolePropertyValue}"]`;

  const buttonList = await page.$$(buttonSelector);
  var buttonChildrenListLength = 0;
  if (buttonList.length > 0) {
    const buttonListHandle = buttonList[0];
    buttonChildrenListLength = await page.evaluate(
      (tbody) => tbody.children.length,
      buttonListHandle
    );
    console.log(
      `Second Tbody: Number of children - ${buttonChildrenListLength}`
    );
  } else {
    console.log("No second tbody found on the page.");
  }

  for (let i = 1; i <= buttonChildrenListLength; i++) {
    const quarter = i;
    await page.click(`${buttonSelector}>li:nth-child(${i})>button`);
    await delay(25);

    const container = await page.$(containerPath);
    const playsLength = await container.evaluate((el) => el.children.length);
    for (let j = 1; j <= playsLength; j++) {
      const timePath = containerPath + `>tr:nth-child(${j})>td:nth-child(1)`;
      const teamImagePath =
        containerPath + `>tr:nth-child(${j})>td:nth-child(2)>img`;
      const playPath = containerPath + `>tr:nth-child(${j})>td:nth-child(3)`;
      const awayScorePath =
        containerPath + `>tr:nth-child(${j})>td:nth-child(4)`;
      const homeScorePath =
        containerPath + `>tr:nth-child(${j})>td:nth-child(5)`;

      const time = await page.$eval(timePath, (el) => el.textContent);
      const play = await page.$(playPath);
      const playText = await play.evaluate((el) => el.textContent);
      var teamPlay;
      if (
        !playText.includes("Start of the") &&
        !playText.includes("End of the") &&
        !playText.includes("Official timeout") &&
        !playText.includes("End of Game")
      ) {
        var teamImage;
        try {
          teamImage = await page.$eval(teamImagePath, (el) => el.src);
          teamPlay = teamImage.split(".png")[0].split("/500/scoreboard/")[1];
          // make teamplay lowercase
          teamPlay = teamPlay.toUpperCase();
        } catch (err) {}
        teamPlay = fixTeams(teamPlay);
      } else {
        if (playText.includes("official timeout")) {
          console.log(playText, "iiigggnnnoorrreee for now");
        }
        teamPlay = "game";
      }
      const team1 = teamPlay == home ? home : away;
      const team2 = teamPlay == home ? away : home;
      const awayScore = await page.$eval(awayScorePath, (el) => el.textContent);
      const homeScore = await page.$eval(homeScorePath, (el) => el.textContent);
      var minute = parseInt(time.split(":")[0]);
      var second = parseInt(time.split(":")[1]);
      if (!second) {
        minute = 0;
        second = parseFloat(time);
      }

      const playObject = {
        quarter,
        second,
        minute,
        time,
        awayScore,
        homeScore,
        teamPlay,
        playText,
      };

      const playValues = await parsePlays({
        play: playObject,
        team1,
        team2,
        roster1: rosters[team1],
        roster2: rosters[team2],
        gameId,
      });
      allPlays.push(...playValues);
      //   save all to mongodb
    }
  }

  await browser.close();
  checkArray = [];
  return allPlays;
};

const getPlayByPlay = async ({ gameId, home, away, rosters }) => {
  const url = "https://www.espn.com/nba/playbyplay?gameId=" + gameId;
  var plays;
  try {
    plays = await scrape({ gameId, url, home, away, rosters });

    console.log("done");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }

  await Play.insertMany(plays);
  console.log("plays inserted");
  return plays;
};

// main()
module.exports = getPlayByPlay;
