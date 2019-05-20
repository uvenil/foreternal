// wird derzeit nicht verwendet und direkt bei user eingetragen!

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// jeder Satz / jedes Wort sollte für einen User / eine Usergroup in genau einem Rechteattribut vorkommen
// Obere Rechte beinhalten die unteren (Bsp.: U beinhaltet R)
const RechteSchema = new Schema({ // 
  user: {  // Delete
    type: [Schema.Types.ObjectId],
    ref: "User"
  },
  D: {  // Delete
    type: [Schema.Types.ObjectId],
    ref: "Satz"
  },
  U: {  // Update
    type: [Schema.Types.ObjectId],
    ref: "Satz"
  },
  C: {  // Create
    type: [Schema.Types.ObjectId],
    ref: "Satz"
  },
  R: {  // Read
    type: [Schema.Types.ObjectId],
    ref: "Satz"
  },
  O: {  // keine Rechte
    type: [Schema.Types.ObjectId],
    ref: "Satz"
  },
  // Dw: {  // Delete
  //   type: [Schema.Types.ObjectId],
  //   ref: "Wort"
  // },
  // Uw: {  // Update
  //   type: [Schema.Types.ObjectId],
  //   ref: "Wort"
  // },
  // Cw: {  // Create
  //   type: [Schema.Types.ObjectId],
  //   ref: "Wort"
  // },
  // Rw: {  // Read
  //   type: [Schema.Types.ObjectId],
  //   ref: "Wort"
  // },
  // Ow: {  // keine Rechte
  //   type: [Schema.Types.ObjectId],
  //   ref: "Wort"
  // },
});

module.exports = mongoose.model("Rechte", RechteSchema);
