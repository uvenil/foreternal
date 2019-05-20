import { gql } from "apollo-boost";
import { recipeFragments } from "./fragments";
import { wortFragments } from "./fragments";


/* Wort Queries -----------------------------------------------------------------*/
export const SUCH_WORTE = gql`
  query($input: WortSuche) {
    suchWorte(input: $input) {
      ...FullWort
    }
  }
  ${wortFragments.wort}
`;

export const GET_WORT_NESTED = gql`
  query($_id: ID!) {
    wort(_id: $_id) {
      ...WortNested
    }
  }
  ${wortFragments.wortnested}
`;

export const GET_USER_WORTE = gql`
  query($username: String!) {
    getUserWorte(username: $username) {
      ...FullWort
    }
  }
  ${wortFragments.wort}
`;

export const GET_ALL_WORTE = gql`
  query {
    getAllWorte {
      ...FullWort
    }
  }
  ${wortFragments.wort}
`;

export const GET_WORT = gql`
  query($_id: ID!) {
    getWort(_id: $_id) {
      ...FullWort
    }
  }
  ${wortFragments.wort}
`;

export const GET_POP_WORT = gql`
  query($_id: ID!) {
    getPopWort(_id: $_id) {
      ...PopWort
    }
  }
  ${wortFragments.wort}
`;

/* Wort Mutations --------------------------*/
export const ADD_WORT = gql`
  mutation(
    $wort: String!
    $stop: Boolean
    $typ: Boolean
    $color: String
    $username: String
  ) {
    addWort(wort: $wort, stop: $stop, typ: $typ, color: $color, username: $username) {
      ...FullWort
    }
  }
  ${wortFragments.wort}
`;

export const DELETE_WORT = gql`
  mutation($_id: ID!) {
    deleteWort(_id: $_id) {
      _id
      wort
    }
  }
`;

export const UPDATE_WORT = gql`
  mutation($_id: ID!, $input: WortInput) {
    updateWort(_id: $_id, input: $input) {
      ...FullWort
    }
  }
  ${wortFragments.wort}
`;


/* Satztyp Queries -----------------------------------------------------------------*/
export const GET_SATZTYPEN = gql`
  query {
    __type(name: "Satztyp")  {
      enumValues {
        name
      }
    }
  }
`;


/* Satz Queries -----------------------------------------------------------------*/
export const GET_SATZ_NESTED = gql`
  query($_id: ID!) {
    satz(_id: $_id) {
      ...SatzNested
    }
  }
  ${wortFragments.satznested}
`;

export const GET_ALL_SATZE = gql`
  query {
    getAllSatze {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;

export const GET_USER_SATZE = gql`
  query($username: String!) {
    getUserSatze(username: $username) {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;

export const GET_SAVE_STATUS = gql`
  query($_id: ID!, $input: SatzInput) {
    getSaveStatus(_id:$_id, input: $input) {
      ops
      savestatus
      satz {
        ...FullSatz
      }
    }
  }
  ${wortFragments.satzfull}
`;

export const GET_SAVE_STATI = gql`
  query($input: SatzeIdFullInput) {
    getSaveStati(input: $input) {
      ops
      savestatus
      satz {
        ...FullSatz
      }
    }
  }
  ${wortFragments.satzfull}
`;

export const GET_POP_SATZ = gql`
  query($_id: ID!) {
    getPopSatz(_id: $_id) {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;

export const SUCH_SATZE = gql`
  query($suchBegr: String, $username: String) {
    suchSatze(suchBegr: $suchBegr, username: $username) {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;

/* Satz Mutations --------------------------*/
export const ADD_FULL_SATZE = gql`
  mutation($input: SatzeFullInput) {
    addFullSatze(input: $input) {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;

export const ADD_FULL_SATZ = gql`
  mutation($input: SatzFullInput) {
    addFullSatz(input: $input) {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;

export const ADD_SATZ = gql`
  mutation($input: SatzInput) {
    addSatz(input: $input) {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;

export const DELETE_SATZE = gql`
  mutation($ids: [ID!]!) {
    deleteSatze(ids: $ids) {
      _id
      typ {_id wort}
      wort {_id wort}
      worte {_id wort}
      worteIf {_id wort}
      updatedDate
      username
    }
  }
`;
// ...FullSatz funktioniert nur, wenn keine Werte, die required(!) sind als null zurückgegeben werden
      
export const DELETE_SATZ = gql`
  mutation($_id: ID!) {
    deleteSatz(_id: $_id) {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;

export const UPDATE_FULL_SATZE = gql`
  mutation($input: SatzeIdFullInput) {
    updateFullSatze(input: $input) {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;

export const UPDATE_FULL_SATZ = gql`
  mutation($_id: ID!, $input: SatzInput) {
    updateFullSatz(_id:$_id, input: $input) {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;

export const UPDATE_SATZ = gql`
  mutation($_id: ID!, $input: SatzInput) {
    updateSatz(_id: $_id, input: $input) {
      ...FullSatz
    }
  }
  ${wortFragments.satzfull}
`;


/* User Queries -----------------------------------------------------------------*/

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      ...FullUser
    }
  }
  ${wortFragments.userfull}
`;

export const GET_USER_RECIPES = gql`
  query($username: String!) {
    getUserRecipes(username: $username) {
      _id
      name
      likes
    }
  }
`;

/* User Mutations --------------------------*/

export const ADD_USER_WORTE = gql`
  mutation($username: String!, $worte: [String], $key: String, $bAdd: Boolean) {
    addUserWorte(username: $username, worte: $worte, key: $key, bAdd: $bAdd) {
      worte
    }
  }
`;

export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;


/* Recipes Queries -----------------------------------------------------------------*/
export const GET_ALL_RECIPES = gql`
  query {
    getAllRecipes {
      _id
      imageUrl
      name
      category
    }
  }
`;

export const GET_RECIPE = gql`
  query($_id: ID!) {
    getRecipe(_id: $_id) {
      ...CompleteRecipe
    }
  }
  ${recipeFragments.recipe}
`;

export const SEARCH_RECIPES = gql`
  query($searchTerm: String) {
    searchRecipes(searchTerm: $searchTerm) {
      _id
      name
      likes
    }
  }
`;

/* Recipes Mutations --------------------------*/

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

export const LIKE_RECIPE = gql`
  mutation($_id: ID!, $username: String!) {
    likeRecipe(_id: $_id, username: $username) {
      ...LikeRecipe
    }
  }
  ${recipeFragments.like}
`;

export const UNLIKE_RECIPE = gql`
  mutation($_id: ID!, $username: String!) {
    unlikeRecipe(_id: $_id, username: $username) {
      ...LikeRecipe
    }
  }
  ${recipeFragments.like}
`;

export const DELETE_USER_RECIPE = gql`
  mutation($_id: ID!) {
    deleteUserRecipe(_id: $_id) {
      _id
    }
  }
`;
