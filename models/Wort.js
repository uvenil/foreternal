const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WortSchema = new mongoose.Schema({
  // vorher Wort
  wort: {   // einmaliges wort
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  stopuser: {   // true, wenn das wort ein Stoppwort ist
    type: [String],
  },
  typuser: {    // true, wenn das wort einen Satztyp bezeichnet
    type: [String],
  },
  color: {  // Farbe, mit dem der Satztyp dargestellt wird
    type: String,
    // default: `rgb(${Math.floor(Math.random()*200)+25},${Math.floor(Math.random()*200)+25},${Math.floor(Math.random()*200)+25})`
  },
  satze: { // Satze, in denen das aktuelle wort vorkommt = Überblick  (ObjectIds)
    type: [Schema.Types.ObjectId],
    ref: "Satz"
  },
  satzeIf: { // Satze, bei denen der aktuelle wort Bedingung für deren Gükltigkeit/Existenz ist (ObjectId)
    type: [Schema.Types.ObjectId],
    ref: "Satz"
  },
  // vorher Satz
  satz: { // ein Wort kann mehrere Satze beschriften = Details (z.B. Liste + Tag), bei 2 oder mehr Satze gleichen Typs (z.B. 2 Listen) muss die Satz-ObjectId (ggf. auch der Index) angegeben werden
    type: [Schema.Types.ObjectId],
    ref: "Satz"
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  username: { // username, vom user, dem das wort gehört
    type: String,
    minlength: 1,
    trim: true
  }
});
WortSchema.index(
  { "$**": "text" },
  { default_language: "german" }
);

module.exports = mongoose.model("Wort", WortSchema);
