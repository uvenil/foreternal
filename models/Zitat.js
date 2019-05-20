const mongoose = require("mongoose");

const ZitatSchema = new mongoose.Schema({
  zitat: {
    type: String,
    minlength: 1,
    required: true,
    trim: true,
    unique: true
  },
  kennwort: {
    type: String,
    minlength: 1,
    required: true,
    trim: true,
    unique: true
  },
  kategorie: {
    type: String,
    minlength: 1,
    trim: true
  },
  rang: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  autor: {  // die Person, der das Zitat zugeschrieben wird
    type: String,
    minlength: 1,
    trim: true
  },
  username: { // die Person, die das Zitat eingestellt hat
    type: String,
    minlength: 1,
    trim: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
});
ZitatSchema.index(
  { "$**": "text" },
  { default_language: "german" }
);
ZitatSchema.index(
  { zitat: 1 },
  { unique: true }
);

ZitatSchema.on('index', function (err) {
  if (err) console.error("ZitatSchema Indexfehler: ", err);
})

module.exports = mongoose.model("Zitat", ZitatSchema);
