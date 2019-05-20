export const ADD_WORT = gql`
mutation(
  $wort: String!
  $typ: String
  $username: String # Try to write your query here
) {
  addWort(wort: $wort, typ: $typ, username: $username) {
    _id
    wort
    typ
    createdDate
    username
  }
}
`;

export const v2 = {
  "wort": "wort",
  "typ": "typ1",
  "username": "Micha"
};


export const ADD_RECIPE = gql`
mutation(
  $name: String!
  $imageUrl: String!
  $description: String!
  $category: String!
  $instructions: String!
  $username: String
) {
  addRecipe(
    name: $name
    imageUrl: $imageUrl
    description: $description
    category: $category
    instructions: $instructions
    username: $username
  ) {
    ...CompleteRecipe
  }
}

fragment CompleteRecipe on Recipe {
  _id
  name
  imageUrl
  category
  description
  instructions
  createdDate
  likes
  username
}
`;
export const v1 = {
  "name": "test2",
  "imageUrl": "url",
  "description": "beschr",
  "category": "cat",
  "instructions": "inst",
  "username": "neuuser"
};




