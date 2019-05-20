import { gql } from "apollo-boost";


export const wortFragments = {
  wort: gql`
    fragment FullWort on Wort {
      _id
      wort
      stopuser
      typuser
      color
      satz {_id}
      satze {_id}
      satzeIf {_id}
      updatedDate
      createdDate
      username
    }
  `,
  wortfull: gql`
    fragment PopWort on Wort {
      _id
      wort
      stop
      typ
      satz {_id satz}
      satze {_id satz}
      satzeIf {_id satz}
      updatedDate
      createdDate
      username
    }
  `,
  wortnested: gql`
    fragment WortNested on Wort {
      _id
      wort
      satz {
        _id
        typ {_id wort}
        wort {_id wort}
        worte {_id wort}
      }
      satze {
        _id
        typ {_id wort}
        wort {_id wort}
        worte {_id wort}
      }
    }
  `,
  satzfull: gql`
    fragment FullSatz on Satz {
      _id
      typ {_id wort}
      wort {_id wort}
      worte {_id wort}
      worteIf {_id wort}
      createdDate
      updatedDate
      username
    }
  `,
  satznested: gql`
    fragment SatzNested on Satz {
      _id
      typ {
        _id
        wort
        satz {
          _id
          typ{_id wort}
          wort{_id wort}
          worte{_id wort}
        }
        satze {
          _id
          typ{_id wort}
          wort{_id wort}
          worte{_id wort}
        }
      }
      wort {
        _id
        wort
        satz {
          _id
          typ{_id wort}
          wort{_id wort}
          worte{_id wort}
        }
        satze {
          _id
          typ{_id wort}
          wort{_id wort}
          worte{_id wort}
        }
      }
      worte {
        _id
        wort
        satz {
          _id
          typ{_id wort}
          wort{_id wort}
          worte{_id wort}
        }
        satze {
          _id
          typ{_id wort}
          wort{_id wort}
          worte{_id wort}
        }
      }
    }
  `,
  userfull: gql`
    fragment FullUser on User {
      _id
      username
      password
      email
      favorites {_id}
      satze {_id}
      worte {_id wort satz {_id}}
      stopworte {_id wort}
      typen {_id wort}
      typfarben
      joinDate
      updatedDate
    }
  `,
};

export const recipeFragments = {
  recipe: gql`
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
  `,
  like: gql`
    fragment LikeRecipe on Recipe {
      _id
      likes
    }
  `
};
