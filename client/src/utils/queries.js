import { gql } from "@apollo/client";
export const FIRST_HITS_TYPE = gql`
  type FirstHits {
    make: Float
    assist: Float
    foul: Float
    block: Float
    reb: Float
    steal: Float
    timeout: Float
    subOut: Float
    subIn: Float
    turnover: Float
  }
`;
export const QUERY_TEAM_PLAYERS = gql`
  query Query {
    teamPlayers {
      _id
      name
      team
      position
      PTS
      REB
      AST
      type
      firstHits {
        make
        assist
        foul
        block
        reb
        subOut
        subIn
        turnover
      }
    }
  }
`;
// Define the CalcInput type
export const CALC_INPUT_TYPE = gql`
  input CalcInput {
    name: String
    prop: String
    amount: Int
  }
`;

export const QUERY_PROP_CALC = gql`
  query PropCalc($inputs: [CalcInput], $team: String) {
    propCalc(inputs: $inputs, team: $team) {
      streak
      value
    }
  }
`;
export const GET_DEF_RANKINGS = gql`
  query Defense {
    defense {
      _id
      position
      prop
      ATL
      BKN
      BOS
      CHA
      CHI
      CLE
      DAL
      DEN
      DET
      GS
      HOU
      IND
      LAC
      LAL
      MEM
      MIA
      MIL
      MIN
      NO
      NYK
      OKC
      ORL
      PHI
      PHX
      POR
      SAC
      SAS
      TOR
      UTAH
      WAS
    }
  }
`;

export const GET_ODDS = gql`
  query Odds {
    odds {
      _id
      home
      away
      overAmt
      underAmt
      overOdds
      underOdds
      prop
      name
    }
  }
`;
