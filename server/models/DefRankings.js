const { Schema, model } = require("mongoose");

const defRankingSchema = new Schema({
  position: {
    type: String,
    required: true,
  },
  ATL: { type: Number, required: true },
  BKN: { type: Number, required: true },
  BOS: { type: Number, required: true },
  CHA: { type: Number, required: true },
  CHI: { type: Number, required: true },
  CLE: { type: Number, required: true },
  DAL: { type: Number, required: true },
  DEN: { type: Number, required: true },
  DET: { type: Number, required: true },
  GS: { type: Number, required: true },
  HOU: { type: Number, required: true },
  IND: { type: Number, required: true },
  LAC: { type: Number, required: true },
  LAL: { type: Number, required: true },
  MEM: { type: Number, required: true },
  MIA: { type: Number, required: true },
  MIL: { type: Number, required: true },
  MIN: { type: Number, required: true },
  NO: { type: Number, required: true },
  NYK: { type: Number, required: true },
  OKC: { type: Number, required: true },
  ORL: { type: Number, required: true },
  PHI: { type: Number, required: true },
  PHX: { type: Number, required: true },
  POR: { type: Number, required: true },
  SAC: { type: Number, required: true },
  SAS: { type: Number, required: true },
  TOR: { type: Number, required: true },
  UTAH: { type: Number, required: true },
  WAS: { type: Number, required: true },
});

const DefRanking = model("DefRanking", defRankingSchema);

module.exports = DefRanking;
