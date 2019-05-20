const objArrSet = (objArr, key) => {  // liefert ein Array von Objekten, welche bzgl. obj[key] einzigartig sin
  if (!objArr || !objArr.length>0)  return objArr;
  const set = new Set();
  let objArrSet = [];
  objArr.forEach(obj => {
    // if (!obj || !obj[key] || set.has(obj[key]))  return;
    if (!obj || set.has(obj[key]))  return;
    objArrSet.push(obj);
    set.add(obj[key]);
  })
  return objArrSet;
}

const delSuchCache = ({cache, suchStrArr, username}) => { // suchStrArr = suchStrings, deren Cache nicht gelöscht werden soll
  // Rest-SUCH_SATZE
  let delsuchStr = Object.keys(cache.data.data.ROOT_QUERY)
    .filter(key => key.startsWith("suchSatze"))
    .map(key => key.slice(10, -1));
  // console.log({delsuchStr});
  delsuchStr = delsuchStr
    .map(str => JSON.parse(str))
    .map(obj => obj.suchBegr)
    .filter(suchStr => !suchStrArr.includes(suchStr));
    // console.log({delsuchStr});
  let querykey, variables;
  delsuchStr.forEach(suchStr => {
    variables = { suchBegr:suchStr, username };
    querykey = "suchSatze("+JSON.stringify(variables)+")";
    delete cache.data.data.ROOT_QUERY[querykey];
  })
  // console.log({cache});
};

const delSuchWorteCache = (cache) => { // suchStrArr = suchStrings, deren Cache nicht gelöscht werden soll
  const querykeys = Object.keys(cache.data.data.ROOT_QUERY)
    .filter(key => key.startsWith("suchWorte"));
  querykeys.forEach(querykey => {
    delete cache.data.data.ROOT_QUERY[querykey];
  });
};

const buttonupdate = ({
  cache, 
  updateSatze, 
  deleteIds, 
  suchBegr, 
  username, 
  GET_USER_SATZE, 
  SUCH_SATZE,
  // GET_CURRENT_USER,
}) => {
  // updateSatze, deleteIds ggf leeres Array
  const {ROOT_QUERY} = cache.data.data;
      console.log({ROOT_QUERY});

  let querykey, variables;
  // GET_CURRENT_USER
  // querykey = "getCurrentUser";
  // delete cache.data.data.ROOT_QUERY[querykey];
  
  // if (ROOT_QUERY[querykey]) {
  //   let { getCurrentUser } = cache.readQuery({
  //     query: GET_CURRENT_USER,
  //   });
  //   console.log({getCurrentUser});
  //   // getCurrentUser = getCurrentUser.filter(
  //   //   satze => !deleteIds.includes(satze._id)
  //   // );
  //   // getCurrentUser = [...getCurrentUser, ...updateSatze];
  //   // console.log({getCurrentUser});
  //   cache.writeQuery({
  //     query: GET_CURRENT_USER,
  //     data: {
  //       getCurrentUser
  //     }
  //   });
  // };
  // GET_USER_SATZE
  variables = { username };
  querykey = "getUserSatze("+JSON.stringify(variables)+")";
  if (ROOT_QUERY[querykey]) {
    let { getUserSatze } = cache.readQuery({
      query: GET_USER_SATZE,
      variables
    });
    getUserSatze = getUserSatze.filter(
      satze => !deleteIds.includes(satze._id)
    );
    getUserSatze = [...getUserSatze, ...updateSatze];
    // console.log({getUserSatze});
    cache.writeQuery({
      query: GET_USER_SATZE,
      variables,
      data: {
        getUserSatze
      }
    });
  };
  // SUCH_SATZE
  ["", suchBegr].forEach(suchStr => {
    variables = { suchBegr:suchStr, username };
    querykey = "suchSatze("+JSON.stringify(variables)+")";
    if (ROOT_QUERY[querykey]) {
      let { suchSatze } = cache.readQuery({
        query: SUCH_SATZE,
        variables
      });
      suchSatze = suchSatze.filter(
        satze => !deleteIds.includes(satze._id)
      );
      suchSatze = [...suchSatze, ...updateSatze];
      // console.log({suchSatze});
      cache.writeQuery({
        query: SUCH_SATZE,
        variables,
        data: {
          suchSatze
        }
      });
    }
  });
  delSuchCache({cache, suchStrArr:["", suchBegr], username});
  // delSuchWorteCache(cache);
};

module.exports = {buttonupdate, delSuchCache};