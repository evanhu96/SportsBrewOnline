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
const PlayerCard = ({ player, odds, team }) => {
  console.log(player);
  const [statType, setStatType] = useState("");
  const [prop, setProp] = useState("PTS");
  const [input, setInput] = useState(0);
  // find odds with player.name and team props
  const playerOdds = odds.odds.find(
    (odd) =>
      (odd.home === team || odd.away === team) &&
      odd.prop === propNamer[prop] &&
      player.name === odd.name
  );

  const percent =
    (player[prop].filter((x) => x > input).length / player[prop].length) * 100;

  const renderButtons = () => {
    const keysToSkip = ["__typename", "_id", "name", "team", "type"];

    const filteredKeys = Object.keys(player).filter(
      (key) => !keysToSkip.includes(key)
    );

    const columnSize = 5;
    const chunkedKeys = [];
    for (let i = 0; i < filteredKeys.length; i += columnSize) {
      chunkedKeys.push(filteredKeys.slice(i, i + columnSize));
    }

    return chunkedKeys.map((column, colIndex) => (
      <div className="column" key={colIndex}>
        {column.map(
          (key, index) =>
            key.toLowerCase() !== "firsthits" && (
              <div className="propButtons" key={index}>
                <Button
                  className="propButton"
                  style={{
                    variant: "none",
                    margin: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: prop === key ? "yellow" : "transparent",
                  }}
                  variant="none"
                  onClick={() => setProp(key)}
                >
                  {key}
                </Button>
              </div>
            )
        )}
      </div>
    ));
  };
  const getMin = (gamesInteger) => {
    // get Min for the past number of games
    const values = player[prop].slice(-gamesInteger);
    const min = Math.min(...values);
    return min;
  };
  const getMax = (gamesInteger) => {
    // get Max for the past number of games
    const values = player[prop].slice(-gamesInteger);
    const max = Math.max(...values);
    return max;
  };

  const renderRows = (oddsAmt) => {
    const rows = [];
    for (let i = 2; i <= 10; i++) {
      const minValue = getMin(i) - 0.5;
      const maxValue = getMax(i) - 0.5;

      let minClass = "";
      let maxClass = "";

      // Check conditions to determine classes for highlighting
      if (maxValue < oddsAmt && oddsAmt !== 1000) {
        maxClass = "highlight-red";
      } else if (minValue > oddsAmt) {
        minClass = "highlight-green";
      }
      console.log(maxClass);
      rows.push(
        <tr key={i}>
          <td className="text-center firstItem">{i}</td>
          <td className={`text-center ${minClass}`}>{minValue}</td>
          <td className={`text-center ${maxClass}`}>{maxValue}</td>
        </tr>
      );
    }
    return rows;
  };

  const renderFirstHits = () => {
    const firstHits = player.firstHits;
    const keysToSkip = ["__typename", "_id", "name", "team", "type"];
    console.log(firstHits);
    const rows = [];
    // Iterate through the keys in firstHits
    Object.keys(firstHits).forEach((key, index) => {
      // Check if the key is in the keysToSkip array
      if (!keysToSkip.includes(key)) {
        // Assuming your data structure in firstHits[key] is appropriate for rendering
        rows.push(
          <tr key={index}>
            <td className="text-center">{key}</td>
            <td className="text-center">{Math.ceil(firstHits[key])}</td>
            {/* Add additional columns if needed */}
          </tr>
        );
      }
    });
    return rows;
  };

  const handleInputChange = (e) => {
    // Get the input value from the event object
    const value = e.target.value;
    setInput(value);
  };

  return (
    <Container className="playerCard">
      <Stack>
        <span
          style={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <h4>Props</h4>
          <span>
            <Button
              onClick={() => setStatType("streaks")}
              style={{ margin: "5px" }}
            >
              Streaks
            </Button>

            <Button
              onClick={() => setStatType("firstHits")}
              style={{ margin: "5px" }}
            >
              First Hits
            </Button>
          </span>
        </span>
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ margin: "30px" }}>{renderButtons()}</div>
          <div
            style={{
              margin: "30px",
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {statType === "streaks" && (
              <Table border="1">
                <tr>
                  <th className="text-center firstItem"># of games</th>
                  <th className="text-center">Over</th>
                  <th className="text-center">Under</th>
                </tr>
                {renderRows(playerOdds ? playerOdds.overAmt : 1000)}
              </Table>
            )}
            {statType === "rate" && (
              <div>
                <Stack
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h2>{prop}</h2>
                  <input onChange={handleInputChange} />
                  <span>
                    <br />
                    {player.name + " hits " + input + " " + prop}
                    <hr />
                    {percent + " % of the time"}
                  </span>
                </Stack>
              </div>
            )}
            {statType === "firstHits" && (
              <>
                {
                  <Table>
                    <h3>(In Seconds)</h3>
                    <tbody>{renderFirstHits()}</tbody>
                  </Table>
                }
              </>
            )}
          </div>
        </span>
      </Stack>
    </Container>
  );
};

export default PlayerCard;
