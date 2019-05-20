const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SatzSchema = new mongoose.Schema({
  // ein Wort kann mehrere Satze beschriften (z.B. Liste + Tag), bei 2 oder mehr Satze gleichen Typs (z.B. 2 Listen) muss die Satz-ObjectId (ggf. auch der Index) angegeben werden
  typ: {  // Satztyp(en) = Typ der geordneten Liste = Beispiele: echter Satz, Liste, Tag, Erbfolge, Linkkette, Objekt, lose Gruppe, Absatz, Details, Dateipfad, url, Nachrichtenprotokoll, sh. auch html5-Tags
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Wort"
  },
  // ein Satz kann genau einem Wort zugeordnet werden
  wort: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Wort"
  },
  worte: { // worte in der richtigen Reihenfolge ergeben den satz
    type: [Schema.Types.ObjectId],
    // required: true,
    // minlength: 1,
    ref: "Wort"
  },
  worteIf: { // Bedingung für die Gültigkeit des Satzs
    type: [Schema.Types.ObjectId],
    ref: "Wort"
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  username: { //  // username, vom user, dem dr satz gehört;  zum Konsolidieren satz.username muss mit user.satze korrespondieren
    type: String,
    minlength: 1,
    trim: true
  },
});
SatzSchema.index(
  { "$**": "text" },
  { default_language: "german" }
);
SatzSchema.index(
  { typ: 1, wort: 1, username: 1 },
  { unique: true }
);

SatzSchema.on('index', function (err) {
  if (err) console.error("SatzSchema Indexfehler: ", err);
})

module.exports = mongoose.model("Satz", SatzSchema);
