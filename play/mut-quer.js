
// typedef:
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

// type Mutation
addRecipe(name: String!, imageUrl: String!, description: String!, category: String!, instructions: String!, username: String): Recipe

// resolver
addRecipe: async (
  root,
  { name, imageUrl, description, category, instructions, username },
  { Recipe }
) => {
  const newRecipe = await new Recipe({
    name,
    imageUrl,
    description,
    category,
    instructions,
    username
  }).save();
  return newRecipe;
},

// client query mutaion
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
  ${recipeFragments.recipe}
`;

