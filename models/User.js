const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  favorites: {
    type: [Schema.Types.ObjectId],
    ref: "Zitat"
  },
  zitate: {
    type: [Schema.Types.ObjectId],
    ref: "Zitat"
  },
  satze: {
    type: [Schema.Types.ObjectId],
    ref: "Satz"
  },
  worte: {
    type: [Schema.Types.ObjectId],
    ref: "Wort"
  },
  stopworte: {
    type: [Schema.Types.ObjectId],
    ref: "Wort"
  },
  typen: {
    type: [Schema.Types.ObjectId],
    ref: "Wort"
  },
  typfarben: {
    type: [String]
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  // Rechte
  delete: {  // Delete
    type: [Schema.Types.ObjectId],
    ref: "User"
  },
  update: {  // Update
    type: [Schema.Types.ObjectId],
    ref: "User"
  },
  read: {  // Read
    type: [Schema.Types.ObjectId],
    ref: "User"
  },
  // rechte: {
  //   type: [Schema.Types.ObjectId],
  //   ref: "Rechte"
  // },
  // group: { // Gruppen, in die der User ist, Zeichen für User
  //   type: [Schema.Types.ObjectId],
  //   ref: "User"
  // },
  // users: { // User, die in der Gruppe sind, Zeichen für group
  //   type: [Schema.Types.ObjectId],
  //   ref: "User"
  // },
});

UserSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
