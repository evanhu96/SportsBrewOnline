import React, { useState } from "react";
import { Button, ButtonGroup, Image, Stack } from "react-bootstrap";
import "./app.css"; // Import a CSS file for custom styles
import ATL from "../TeamPNGS/ATL.png";
import BKN from "../TeamPNGS/BKN.png";
import BOS from "../TeamPNGS/BOS.png";
import CHA from "../TeamPNGS/CHA.png";
import CHI from "../TeamPNGS/CHI.png";
import CLE from "../TeamPNGS/CLE.png";
import DAL from "../TeamPNGS/DAL.png";
import DEN from "../TeamPNGS/DEN.png";
import DET from "../TeamPNGS/DET.png";
import GS from "../TeamPNGS/GS.png";
import HOU from "../TeamPNGS/HOU.png";
import IND from "../TeamPNGS/IND.png";
import LAC from "../TeamPNGS/LAC.png";
import LAL from "../TeamPNGS/LAL.png";
import MEM from "../TeamPNGS/MEM.png";
import MIA from "../TeamPNGS/MIA.png";
import MIL from "../TeamPNGS/MIL.png";
import MIN from "../TeamPNGS/MIN.png";
import NO from "../TeamPNGS/NO.png";
import NY from "../TeamPNGS/NY.png";
import OKC from "../TeamPNGS/OKC.png";
import ORL from "../TeamPNGS/ORL.png";
import PHI from "../TeamPNGS/PHI.png";
import PHX from "../TeamPNGS/PHX.png";
import POR from "../TeamPNGS/POR.png";
import SAS from "../TeamPNGS/SAS.png";
import SAC from "../TeamPNGS/SAC.png";
import TOR from "../TeamPNGS/TOR.png";
import UTAH from "../TeamPNGS/UTAH.png";
import WAS from "../TeamPNGS/WAS.png";
const teamImages = {
  ATL: ATL,
  BKN: BKN,
  BOS: BOS,
  CHA: CHA,
  CHI: CHI,
  CLE: CLE,
  DAL: DAL,
  DEN: DEN,
  DET: DET,
  GS: GS,
  HOU: HOU,
  IND: IND,
  LAC: LAC,
  LAL: LAL,
  MEM: MEM,
  MIA: MIA,
  MIL: MIL,
  MIN: MIN,
  NO: NO,
  NYK: NY,
  OKC: OKC,
  ORL: ORL,
  PHI: PHI,
  PHX: PHX,
  POR: POR,
  SAS: SAS,
  SAC: SAC,
  TOR: TOR,
  UTAH: UTAH,
  WAS: WAS,
};
const NBATeams = ({ setTeam }) => {
  const teams = {
    Atlantic: ["BOS", "BKN", "NYK", "PHI", "TOR"],
    Central: ["CHI", "CLE", "DET", "IND", "MIL"],
    Southeast: ["ATL", "CHA", "MIA", "ORL", "WAS"],
    Northwest: ["DEN", "MIN", "OKC", "POR", "UTAH"],
    Pacific: ["GS", "LAC", "LAL", "PHX", "SAC"],
    Southwest: ["DAL", "HOU", "MEM", "NO", "SAS"],
  };
  const nbaTeams = {
    ATL: { abbreviation: "ATL", fullName: "Atlanta Hawks" },
    BOS: { abbreviation: "BOS", fullName: "Boston Celtics" },
    BKN: { abbreviation: "BKN", fullName: "Brooklyn Nets" },
    CHA: { abbreviation: "CHA", fullName: "Charlotte Hornets" },
    CHI: { abbreviation: "CHI", fullName: "Chicago Bulls" },
    CLE: { abbreviation: "CLE", fullName: "Cleveland Cavaliers" },
    DAL: { abbreviation: "DAL", fullName: "Dallas Mavericks" },
    DEN: { abbreviation: "DEN", fullName: "Denver Nuggets" },
    DET: { abbreviation: "DET", fullName: "Detroit Pistons" },
    GS: { abbreviation: "GS", fullName: "Golden State Warriors" },
    HOU: { abbreviation: "HOU", fullName: "Houston Rockets" },
    IND: { abbreviation: "IND", fullName: "Indiana Pacers" },
    LAC: { abbreviation: "LAC", fullName: "LA Clippers" },
    LAL: { abbreviation: "LAL", fullName: "Los Angeles Lakers" },
    MEM: { abbreviation: "MEM", fullName: "Memphis Grizzlies" },
    MIA: { abbreviation: "MIA", fullName: "Miami Heat" },
    MIL: { abbreviation: "MIL", fullName: "Milwaukee Bucks" },
    MIN: { abbreviation: "MIN", fullName: "Minnesota Timberwolves" },
    NOP: { abbreviation: "NOP", fullName: "New Orleans Pelicans" },
    NYK: { abbreviation: "NYK", fullName: "New York Knicks" },
    OKC: { abbreviation: "OKC", fullName: "Oklahoma City Thunder" },
    ORL: { abbreviation: "ORL", fullName: "Orlando Magic" },
    PHI: { abbreviation: "PHI", fullName: "Philadelphia 76ers" },
    PHX: { abbreviation: "PHX", fullName: "Phoenix Suns" },
    POR: { abbreviation: "POR", fullName: "Portland Trail Blazers" },
    SAC: { abbreviation: "SAC", fullName: "Sacramento Kings" },
    SAS: { abbreviation: "SAS", fullName: "San Antonio Spurs" },
    TOR: { abbreviation: "TOR", fullName: "Toronto Raptors" },
    UTAH: { abbreviation: "UTAH", fullName: "Utah Jazz" },
    WAS: { abbreviation: "WAS", fullName: "Washington Wizards" },
  };

  const changeTeam = (division, teamName) => {
    const teamAbb = Object.values(nbaTeams).find(
      (team) => team.fullName.toLowerCase() === teamName.toLowerCase()
    );
    setTeam(teamAbb.abbreviation);
  };
  return (
    <div className="divisionContainer">
      {Object.entries(teams).map(([division, teamList]) => (
        <Stack className="division">
          <h2>{division}</h2>
          <ButtonGroup className="TeamButtonGroup">
            {teamList.map((team, index) => (
              <Button
                className="teamButton"
                onClick={() => changeTeam(division, team)}
              >
                <img
                  src={teamImages[team]}
                  alt={team}
                  style={{ height: "6vh" }}
                />
              </Button>
            ))}
          </ButtonGroup>
        </Stack>
      ))}
    </div>
  );
};

export default NBATeams;
