import React, { useState } from "react";
import { Button, Container, Dropdown, Form, Stack } from "react-bootstrap";
import LineChart from "./LineChart";
function sma(arr, length) {
  const result = [];
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= length - 1) {
      result.push(sum / length);
      sum -= arr[i - length + 1];
    }
  }

  return result;
}

const YourComponent = ({ playerName, data }) => {
  const [dataSets, setDataSets] = useState([]); // [ { label: "Player 1", data: [1, 2, 3, 4, 5] }, { label: "Player 2", data: [1, 2, 3, 4, 5] }

  const handlePropChange = (prop) => {
    console.log(playerName);
    // log player using data array
    const playerStats = data.teamPlayers.filter(
      (player) => player.name === playerName
    );
    console.log(playerStats, prop);
    setDataSets([
      {
        label: playerName + " " + prop,
        data: sma(playerStats[0][prop], 5),
      },
    ]);
  };

  return (
    <Container className="calculator">
      <Stack>
        <Form id="chartForm">
          <Button
            variant="primary"
            value="PTS"
            onClick={(e) => handlePropChange(e.target.value)}
          >
            Points
          </Button>
          <Button
            variant="primary"
            value="REB"
            onClick={(e) => handlePropChange(e.target.value)}
          >
            Rebounds
          </Button>
          <Button
            variant="primary"
            value="AST"
            onClick={(e) => handlePropChange(e.target.value)}
          >
            Assists
          </Button>
        </Form>

        {dataSets.length > 0 && <LineChart datasets={dataSets} />}
      </Stack>
    </Container>
  );
};

export default YourComponent;
