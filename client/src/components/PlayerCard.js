// import button from react

import React from "react";
import { useState } from "react";
import { Button, Container, Stack, Table } from "react-bootstrap";
// import css
import "./app.css";

const propNamer = {
  PTS: "point",
  AST: "assist",
  REB: "rebound",
};
const PlayerCard = ({ player, odds, team, defenseData }) => {
  const [customProp, setCustomProp] = useState(null);
  const [customOdds, setCustomOdds] = useState(null);

  // find odds with player.name and team props
  var pointOdds, assistOdds, reboundOdds, vsTeam;
  if (odds) {
    vsTeam = odds.odds.find((odd) => odd.home === team || odd.away === team);
    console.log(odds)
    vsTeam = vsTeam.home === team ? vsTeam.away : vsTeam.home;
    try {
      pointOdds = odds.odds.find(
        (odd) =>
          (odd.home === team || odd.away === team) &&
          odd.prop === propNamer["PTS"] &&
          player.name === odd.name
      ).overAmt;
    } catch {}
    try {
      assistOdds = odds.odds.find(
        (odd) =>
          (odd.home === team || odd.away === team) &&
          odd.prop === propNamer["AST"] &&
          player.name === odd.name
      ).overAmt;
    } catch {}
    try {
      reboundOdds = odds.odds.find(
        (odd) =>
          (odd.home === team || odd.away === team) &&
          odd.prop === propNamer["REB"] &&
          player.name === odd.name
      ).overAmt;
    } catch {}
  }
  const getHitRate = (array, odds) => {
    var hits = 0;
    const length = array.length;
    for (var i = length - 1; i >= 0; i--) if (array[i] > odds) hits++;
    return (hits / length).toFixed(2) * 100;
  };
  console.log(player);
  console.log(customOdds);
  console.log(customProp);
  // get streak
  const getStreak = (array, odds) => {
    var streak = 0;
    for (var i = array.length - 1; i >= 0; i--) {
      if (array[i] > odds) {
        if (streak < 0) return streak;
        streak++;
      } else {
        if (streak > 0) return streak;
        streak--;
      }
    }
  };
  const getAvg = (array) => {
    const sum = array.reduce((a, b) => a + b, 0);
    const avg = sum / array.length || 0;
    return avg;
  };
  const getVs = (position, prop) => {
    if (defenseData !== undefined) {
      try {
        var vs = defenseData.find(
          (team) => team.position === position && team.prop === prop
        )[vsTeam];
        if (vs > 30) vs = 30;
        return vs;
      } catch (error) {
        return "none";
      }
    }
  };
  const handleSelectChange = (e) => {
    setCustomProp(e.target.value);
  };
  const handleInputChange = (event) => {
    setCustomOdds(event.target.value);
  };

  const renderTable = () => {
    const pointsVs = getVs(player.position, "PTS");
    const assistsVs = getVs(player.position, "AST");
    const reboundsVs = getVs(player.position, "REB");
    const ptsVsRedShade = pointsVs < 15 ? 0 : (pointsVs * 255) / 30;
    const astVsRedShade = assistsVs < 15 ? 0 : (assistsVs * 255) / 30;
    const rebVsRedShade = reboundsVs < 15 ? 0 : (reboundsVs * 255) / 30;
    const ptsVsGreenShade = pointsVs > 14 ? 0 : ((31 - pointsVs) * 255) / 30;
    const astVsGreenShade = assistsVs > 14 ? 0 : ((31 - assistsVs) * 255) / 30;
    const rebVsGreenShade =
      reboundsVs > 14 ? 0 : ((31 - reboundsVs) * 255) / 30;
    const ptsStreak = pointOdds ? getStreak(player.PTS, pointOdds) : null;
    const astStreak = assistOdds ? getStreak(player.AST, assistOdds) : null;
    const rebStreak = reboundOdds ? getStreak(player.REB, reboundOdds) : null;
    const customStreak = customOdds
      ? getStreak(player[customProp], customOdds)
      : null;
    const pointColorStyle = {
      backgroundColor:
        ptsStreak > 1
          ? `rgba(0, 255, 0, 0.7)` // Green tint
          : ptsStreak < -1
          ? `rgba(255, 0, 0, 0.7)` // Red tint
          : null, // No background color if not greater than 1 or less than -1
    };
    const assistColorStyle = {
      backgroundColor:
        astStreak > 1
          ? `rgba(0, 255, 0, 0.7)` // Green tint
          : astStreak < -1
          ? `rgba(255, 0, 0, 0.7)` // Red tint
          : null, // No background color if not greater than 1 or less than -1
    };
    const reboundColorStyle = {
      backgroundColor:
        rebStreak > 1
          ? `rgba(0, 255, 0, 0.7)` // Green tint
          : rebStreak < -1
          ? `rgba(255, 0, 0, 0.7)` // Red tint
          : null, // No background color if not greater than 1 or less than -1
    };

    return (
      <Table>
        <thead className="pcThead">
          <tr className="pcTr">
            <th className="pcTh"></th>
            <th className="pcTh">10GameAvg</th>
            <th className="pcTh">Odds</th>
            <th className="pcTh">Hit Rate</th>
            <th className="pcTh">Streak</th>
            <th className="pcTh">Avg First Hit</th>
            <th className="pcTh">VS Ranking</th>
          </tr>
        </thead>
        <tbody>
          <tr className="pcTr">
            <th className="pcTh">Points</th>
            <td className="pcTd">{Math.ceil(getAvg(player.PTS.slice(-10)))}</td>
            {/* if pointOdds else return No Bet */}
            <td className="pcTd">{pointOdds ? pointOdds : "None"}</td>
            <td className="pcTd">
              {pointOdds ? getHitRate(player.PTS, pointOdds) : "None"}%
            </td>
            <td className="pcTd" style={pointColorStyle}>
              {ptsStreak !== null ? ptsStreak : "None"}
            </td>

            <td className="pcTd">{(player.firstHits.make / 60).toFixed(2)}</td>
            <td
              className="pcTd"
              style={{
                backgroundColor: `rgba(${ptsVsRedShade}, ${ptsVsGreenShade}, 0, .7)`,
              }}
            >
              {pointOdds ? pointsVs : "none"}
            </td>
          </tr>
          <tr className="pcTr">
            <th className="pcTh">Rebounds</th>
            <td className="pcTd">{Math.ceil(getAvg(player.REB.slice(-10)))}</td>
            <td className="pcTd">{reboundOdds ? reboundOdds : "None"}</td>
            <td className="pcTd">
              {reboundOdds ? getHitRate(player.REB, reboundOdds) : "None"}%
            </td>
            <td className="pcTd" style={reboundColorStyle}>
              {rebStreak !== null ? rebStreak : "None"}
            </td>
            <td className="pcTd">{(player.firstHits.reb / 60).toFixed(2)}</td>
            <td
              className="pcTd"
              style={{
                backgroundColor: `rgba(${rebVsRedShade}, ${rebVsGreenShade}, 0, .7)`,
              }}
            >
              {reboundOdds ? reboundsVs : "none"}
            </td>
          </tr>
          <tr className="pcTr">
            <th className="pcTh">Assists</th>
            <td className="pcTd">{Math.ceil(getAvg(player.AST.slice(-10)))}</td>
            <td className="pcTd">{assistOdds ? assistOdds : "None"}</td>
            <td className="pcTd">
              {assistOdds ? getHitRate(player.AST, assistOdds) : "None"}%
            </td>
            <td className="pcTd" style={assistColorStyle}>
              {astStreak !== null ? astStreak : "None"}
            </td>
            <td className="pcTd">
              {(player.firstHits.assist / 60).toFixed(2)}
            </td>
            <td
              className="pcTd"
              style={{
                backgroundColor: `rgba(${astVsRedShade}, ${astVsGreenShade}, 0, .7)`,
              }}
            >
              {assistOdds ? assistsVs : "none"}
            </td>{" "}
          </tr>
          <tr className="pcTr">
            <th className="pcTh">
              <select
                id="statsDropdown"
                onChange={handleSelectChange}
                value={customProp}
              >
                <option value="">Select...</option>
                <option value="PTS">PTS</option>
                <option value="AST">AST</option>
                <option value="REB">REB</option>
              </select>
            </th>
            <td className="pcTd">-</td>
            <td className="pcTd">
              <input
                type="number"
                id="numberInput"
                value={customOdds}
                onChange={handleInputChange}
                style={{ width: "65px" }}
              />
            </td>
            <td className="pcTd">
              {customOdds ? getHitRate(player[customProp], customOdds) : "None"}%
            </td>
            <td className="pcTd" style={assistColorStyle}>
              {customStreak !== null ? customStreak : "None"}
            </td>
            <td className="pcTd">-</td>
            <td className="pcTd">-</td>{" "}
          </tr>
        </tbody>
      </Table>
    );
  };

  // !!! ADD CUSTOM NUMBER INPUT FOR PROPS TO GET SEPERETE ODDS SEPERATE TABLE

  return (
    <Container className="playerCard">
      <div>{renderTable()}</div>
    </Container>
  );
};

export default PlayerCard;
