import React from "react";

// const isObject = (testObj) => {
//   return (testObj === Object(testObj));
// };

const style = {
  fontSize: 12,
  // display: "inline-block"
};

const objlist = (obj) => {
  return (
    <ul>
      {Object.keys(obj).map(key => <li key={key} style={style}>{key}: {oalist(obj[key])}</li>)}
    </ul>
  );
};

const arrlist = (arr) => {
  if (arr.length===0) return "[]";
  return (
    <ol>
      {arr.map(el => <li style={style}>{oalist(el)}</li>)}
    </ol>
  );
};

const oalist = (oa) => {
  if (oa === null && oa === undefined) return `${oa}`;
  if (Array.isArray(oa)) return arrlist(oa);
  else if (oa===Object(oa)) return objlist(oa);
  else return oa;
};

const Obj = ( obj ) => {
  if (!obj) return <div>loading ...</div>
  return (
    <div>
      {
        oalist(obj)
      }
    </div>
  );
};
  
  export default Obj;
  