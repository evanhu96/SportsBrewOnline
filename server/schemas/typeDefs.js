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
    _id:ID
    position: String
  }
  input CalcInput {
    name: String
    prop: String
    amount: Int
  }
  type Query {
    propCalc(inputs: [CalcInput], team: String): Calculation!
    teamPlayers(team: String): [RankingsArray]!
    odds: [Odd]!
    defense: [defRankings]!
  }
`;

module.exports = typeDefs;
