const { ApolloServer, gql } = require('apollo-server-express');

exports.typeDefs = gql`

type Wort {
  _id: ID
  wort: String!
  stopuser: [String]
  typuser: [String]
  color: String
  satz(input:SatzSuche): [Satz]
  satze(input:SatzSuche): [Satz]
  satzeIf(input:SatzSuche): [Satz]
  username: String
  createdDate: String
  updatedDate: String
}

type Satz {
  _id: ID
  typ(input:WortSuche): Wort
  wort(input:WortSuche): Wort
  worte(input:WortSuche): [Wort]
  worteIf(input:WortSuche): [Wort]
  username: String
  createdDate: String
  updatedDate: String
}

type Zitat {
  _id: ID
  zitat: String!
  kennwort: String!
  kategorie: String
  rang: Int
  likes: Int
  autor: String
  username: String
  createdDate: String
  updatedDate: String
}

type SaveStatus {
  ops: [Ops]!
  savestatus: String!
  satz: Satz
}

enum Ops {
  create
  delete
  update
}

type User {
  _id: ID
  username: String! @unique
  password: String!
  email: String!
  favorites: [Satz]
  satze: [Satz]
  worte: [Wort]
  stopworte: [Wort]
  typen: [Wort]
  typfarben: [String]
  joinDate: String
  updatedDate: String
}

type Worte {
  worte: [String]
}

type Token {
  token: String!
}

type Recipe {
  _id: ID
  name: String!
  imageUrl: String!
  category: String!
  description: String!
  instructions: String!
  likes: Int
  createdDate: String
  username: String
}

input WortInput {
  wort: String!
  stop: Boolean
  typ: Boolean
  color: String
  satz: [ID]
  satze: [ID]
  satzeIf: [ID]
  username: String
}

input WortSuche {
  _id: ID
  wort: String
  stop: Boolean
  typ: Boolean
  color: String
  username: String
  createdDate: String
  updatedDate: String
}

input SatzSuche {
  _id: ID
  username: String
  createdDate: String
  updatedDate: String
}

input SatzInput {
  typ: ID!
  wort: ID!
  worte: [ID]
  worteIf: [ID]
  username: String
}

input SatzIdFullInput {
  _id: ID
  typ: String
  wort: String
  worte: String
  worteIf: String
  username: String
  createdDate: String
  updatedDate: String
}

input SatzeIdFullInput {
  saetze: [SatzIdFullInput!]!
}

input SatzFullInput {
  typ: String!
  wort: String!
  worte: String
  worteIf: String
  username: String!
}

input SatzeFullInput {
  saetze: [SatzFullInput!]!
}

type Query {
  wort(_id: ID, wort: String): Wort
  suchWorte(input:WortSuche): [Wort]
  getWortNested(_id: ID!): Wort
  getUserWorte(username: String!): [Wort]
  getAllWorte: [Wort]
  getWort(_id: ID!): Wort
  getPopWort(_id: ID!): Wort

  satz(_id: ID, wort: String, typ: String): Satz
  getSatzNested(_id: ID!): Satz
  getAllSatze: [Satz]
  getUserSatze(username: String!): [Satz]
  getSaveStatus(_id: ID, input: SatzFullInput): SaveStatus
  getSaveStati(input: SatzeIdFullInput): [SaveStatus]
  getPopSatz(_id: ID!): Satz
  suchSatze(suchBegr: String, username: String): [Satz]

  getAllRecipes: [Recipe]
  getRecipe(_id: ID!): Recipe
  searchRecipes(searchTerm: String): [Recipe]

  getUserRecipes(username: String!): [Recipe]
  getCurrentUser: User
}

type Mutation {
  addWort(wort: String!, stop: Boolean, typ: Boolean, color: String, username: String): Wort
  deleteWort(_id: ID!): Wort
  updateWort(_id: ID!, input: WortInput): Wort

  addFullSatze(input: SatzeFullInput): [Satz]
  addFullSatz(input: SatzFullInput): Satz
  addSatz(input: SatzInput): Satz
  deleteSatze(ids: [ID!]!): [Satz]
  deleteSatz(_id: ID!): Satz
  updateFullSatze(input: SatzeIdFullInput): [Satz]
  updateFullSatz(_id: ID!, input: SatzFullInput): Satz
  updateSatz(_id: ID!, input: SatzInput): Satz

  addUserSatze(_id: ID!, username: String!): User
  deleteUserSatze(_id: ID!, username: String!): User
  deleteAllUserSatze(username: String!): User

  addUserWorte(username: String!, worte: [String], key: String, bAdd: Boolean): Worte
  deleteUserWorte(username: String!, worte: [String], key: String): [Wort]
  updateUserWorte(username: String!, worte: [String], key: String): [Wort]

  addRecipe(name: String!, imageUrl: String!, description: String!, category: String!, instructions: String!, username: String): Recipe
  deleteUserRecipe(_id: ID): Recipe
  likeRecipe(_id: ID!, username: String!): Recipe
  unlikeRecipe(_id: ID!, username: String!): Recipe

  signinUser(username: String!, password: String!): Token
  signupUser(username: String!, email: String!, password: String!): Token
}

`;
