// ToDo:
// wort-resolver erstellen auf graphiql testen
// Authentifizierung vor gql playground
// utxt graphql-backend
// hyperwort-Eingabe
// jwt error -> auskommentiert

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: "variables.env" });
}
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Recipe = require("./models/Recipe");
const User = require("./models/User");
const Wort = require("./models/Wort");
const Satz = require("./models/Satz");
const Zitat = require("./models/Zitat");
const Rechte = require("./models/Rechte");

// once
const once = ((str) => {
  let executed = false;
  return function (str) {
    if (!executed) {
      executed = true;
      console.log("\n- Server -", str);
      return true;
    }
    return false;
  };
})();
// const { cwd, pid, ppid, title, argv, execArgv, execPath } = process;
// once({ cwd, pid, ppid, title, argv, execArgv, execPath });
let bOnce = once(`
  MONGODB_URI: ${process.env.MONGODB_URI}
  NODE_ENV: ${process.env.NODE_ENV}
  PORT: ${process.env.PORT}
  SECRET: ${process.env.SECRET}
`);


// create ApolloServer
const { ApolloServer, graphiqlExpress, gql } = require('apollo-server-express');
const { typeDefs } = require("./typedefs");
const { resolvers } = require("./resolvers");

const server = new ApolloServer({
  typeDefs, 
  resolvers, 
  context: ({ req }) => ({  // { currentUser }
    Wort,
    Satz,
    Zitat,
    Recipe,
    User,
    Rechte,
    currentUser: req.currentUser,
  }),
  introspection: true,  // graphql playground in production
  playground: true // graphql playground in production
});

// Connects to database
const autoIndex = ( process.env.NODE_ENV === "production") ? false : true;
// !!! Wo wird der Index in production erstellt?
mongoose
  .set('useFindAndModify', false) // https://stackoverflow.com/questions/52572852/deprecationwarning-collection-findandmodify-is-deprecated-use-findoneandupdate
  .set('useCreateIndex', true)  // https://stackoverflow.com/questions/51916630/mongodb-mongoose-collection-find-options-deprecation-warning
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, autoIndex: autoIndex })
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

// Initializes application
const app = express();

// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true
// };
app.use(cors("*"));

// Set up JWT authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!!token && token !== "null" && String(token).trim() !== "") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (err) {
      console.log("token", token);
      console.error(err);
    }
  }
  next();
});

// app.use(
//   "/graphql",
//   bodyParser.json(),
// );

// production -> client/build
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
// development, test -> client/public
} else {
  app.use(express.static("client/public"));
}

server.applyMiddleware({ app });

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
