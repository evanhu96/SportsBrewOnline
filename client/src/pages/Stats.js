import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import PlayerCard from "../components/PlayerCard";
import Chart from "../components/Chart";
import Teams from "../components/Teams";
import {
  QUERY_TEAM_PLAYERS,
  GET_ODDS,
  GET_DEF_RANKINGS,
} from "../utils/queries";

const Stats = () => {
  const [team, setTeam] = useState("");
  const [player, setPlayer] = useState({});
  const [playerName, setPlayerName] = useState("");
  const { error, data } = useQuery(QUERY_TEAM_PLAYERS);
  if (error) console.log(error);
  if (data) console.log(data.teamPlayers[0]);
  const { data: oddsData } = useQuery(GET_ODDS);
  const { data: defenseData, error: e } = useQuery(GET_DEF_RANKINGS);

  const handlePlayerSelect = (player) => {
    setPlayer(player);
    setPlayerName(player.name);
  };

  const renderPlayerButtons = () => {
    if (!data || !data.teamPlayers || !data.teamPlayers.length) {
      return null;
    }
    const teamPlayers = data.teamPlayers;
    // alphabetize players by name
    const sortedPlayers = [];
    for (let i = 0; i < teamPlayers.length; i++) {
      if (teamPlayers[i].team === team) sortedPlayers.push(teamPlayers[i]);
    }
    sortedPlayers.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    // Chunk players into arrays with 3 players each
    const chunkedPlayers = [];
    for (let i = 0; i < sortedPlayers.length; i += 3) {
      chunkedPlayers.push(sortedPlayers.slice(i, i + 3));
    }

    return chunkedPlayers.map((row, index) => (
      <div className="buttonRow" key={index}>
        {row.map((player) => (
          <div key={player.name}>
            <Button
              className="selectButton"
              onClick={() => handlePlayerSelect(player)}
            >
              {player.name}
            </Button>
          </div>
        ))}
      </div>
    ));
  };
  return (
    <div>
      {team === "" && oddsData ? (
        <div>
          <Teams setTeam={setTeam} oddsData={oddsData.odds} data={data} />
        </div>
      ) : data && defenseData ? (
        <>
          <div className="buttonGrid">{renderPlayerButtons()}</div>
          <span style={{ display: "flex", justifyContent: "center" }}>
            <h1>{playerName}</h1>
          </span>
          <Button onClick={() => setTeam("")}>Back</Button>
          <Container
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
            key={playerName}
          >
            {/* stack sideways */}
            <Stack direction="horizontal">
              {playerName !== "" && (
                <>
                  <Stack
                    direction="horizontal"
                    spacing={2}
                    sx={{
                      maxWidth: "100%",
                      "@media (max-width: 600px)": {
                        flexDirection: "column",
                      },
                    }}
                  >
                    <Stack>
                      <PlayerCard
                        player={player}
                        odds={oddsData}
                        team={team}
                        defenseData={defenseData.defense}
                        data={data}
                      />
                      <Chart playerName={player.name} data={data} />
                    </Stack>
                  </Stack>
                </>
              )}
            </Stack>
          </Container>
        </>
      ) : (
        <div>loading</div>
      )}
    </div>
  );
};

export default Stats;
