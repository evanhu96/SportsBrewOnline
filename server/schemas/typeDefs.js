const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type RankingsValues {
    _id: ID
    name: String
    value: Float
  }
  type Rankings {
    _id: ID
    name: String
    team: String
    MIN: Float
    FGA: Float
    FGM: Float
    FTA: Float
    FTM: Float
    OREB: Float
    DREB: Float
    REB: Float
    AST: Float
    STL: Float
    BLK: Float
    TO: Float
    PF: Float
    plusMinus: Float
    PTS: Float
    type: String
  }

  type RankingsArray {
    _id: ID
    name: String
    team: String
    position: String
    MIN: [Float]
    FGA: [Float]
    FGM: [Float]
    FTA: [Float]
    FTM: [Float]
    OREB: [Float]
    DREB: [Float]
    REB: [Float]
    AST: [Float]
    STL: [Float]
    BLK: [Float]
    TO: [Float]
    PF: [Float]
    plusMinus: [Float]
    PTS: [Float]
    type: String
    firstHits: FirstHits
    rankings: Rankings
  }
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
  type Calculation {
    streak: Int
    value: Float
  }
  type Odd {
    _id: ID
    home: String
    away: String
    overAmt: Float
    underAmt: Float
    overOdds: String
    underOdds: String
    prop: String
    name: String
  }
  type defRankings {
    _id: ID
    position: String
    prop: String
    ATL: Int
    BKN: Int
    BOS: Int
    CHA: Int
    CHI: Int
    CLE: Int
    DAL: Int
    DEN: Int
    DET: Int
    GS: Int
    HOU: Int
    IND: Int
    LAC: Int
    LAL: Int
    MEM: Int
    MIA: Int
    MIL: Int
    MIN: Int
    NO: Int
    NYK: Int
    OKC: Int
    ORL: Int
    PHI: Int
    PHX: Int
    POR: Int
    SAC: Int
    SAS: Int
    TOR: Int
    UTAH: Int
    WAS: Int
  }
  input CalcInput {
    name: String
    prop: String
    amount: Int
  }
  type Query {
    propCalc(inputs: [CalcInput], team: String): Calculation!
    teamPlayers: [RankingsArray]!
    odds: [Odd]!
    defense: [defRankings]!
  }
`;

module.exports = typeDefs;
