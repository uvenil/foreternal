// const { combineResolvers } = require("graphql-resolvers");
const _ = require('lodash');  // const resolvers = _.merge(resolvers1, resolvers2);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};
const worteIds = async (str, Wort, bIds=true) => {  // liefert die wort._ids eines Satzes als Array;  Unterschied zu getIDs(): verwendet nicht username, erzeugt keine Dokumente
  // Unterschied zu getIDs(): verwendet nicht username, erzeugt keine Dokumente, liefert auch Documents bei bIds=false
  str = str || "";
  str = str.trim().replace(/\s{2,}/, " ");
  if (!str) return null;
  let worteDocs;
  try {
    worteDocs = await Promise.all(str.split(" ")
      .map(async wort => await Wort.findOne({ wort })));
  } catch (e) {
    console.log(`! Worte: ${str} konnten nicht fehlerfrei gelesen werden! (Aufruf: Wort.findOne, Fkt. worteEqual, resolver.js)`);
    // console.log("error", e);
  }
  if (bIds && worteDocs)  return worteDocs.filter(wo=>!!wo).map(wo=>wo._id); // bIds=true -> Ids
  return worteDocs;   // bIds=false -> Docs
}
const worteEqual = Wort => async (worte, idArr) => {  // vergleicht dern worte-String mit einem Array von Wort._ids
  if (!Array.isArray(idArr))  idArr = [idArr];  // ggf. Array erzeugen
  let worteids = await worteIds(worte, Wort, true);
  // keine worte vorhanden;  beidseits -> true, nur einseitig -> false
  if (!worteids) {
    // console.log({idArr});
    // console.log("!", !idArr.filter(id => !id).length>0);
    // console.log("filt", idArr.filter(id => !id));
    if (!idArr || !idArr.filter(id => !!id).length>0)  return true
    else return false
  }
  // Vergleich
  if (worteids.length!==idArr.length) return false;
  if (!_.isEqual(worteids.sort(), idArr.sort()))  return false;
  return true;
};
const satzEqual = async (satzS, satzD, Wort) => { // vergleicht String-satzv(satzS) mit satz-db-Dokument (satzD)
  const { typ, wort, worte, worteIf, username } = satzS;
  if (username!==satzD.username)   return {username: false};
  worteequal = worteEqual(Wort);  // Vergleichsfunktion erzeugen
  let satzequal = {username: true};
  satzequal.typ = await worteequal(typ, satzD.typ);
  satzequal.wort = await worteequal(wort, satzD.wort);
  satzequal.worte = await worteequal(worte, satzD.worte);
  satzequal.worteIf = await worteequal(worteIf, satzD.worteIf);
  return satzequal;
};
const objarrconvert = (obj) => {  // {k1:{k2:[e1, e2]}} => {e1:{k2:[k1]}, e2:{k2:[k1]}}
  if (!obj)   return obj;
  let newObj = {};
  const newK1 = new Set();
  // Arrayelemente als neue Keys sammeln
  Object.keys(obj).forEach(k1 => {
    if (!obj.hasOwnProperty(k1)) return;
    Object.keys(obj[k1]).forEach(k2 => {
      if (!obj[k1].hasOwnProperty(k2)) return;
      if (!Array.isArray(obj[k1][k2])) return;
      // Array
      obj[k1][k2].forEach(el => {
        if (newK1.has(String(el))) return;
        newK1.add(String(el));
      })
    });
  });
  // neues Objekt erstellen
  [...newK1].forEach(nk1 => newObj[nk1] = {});
  Object.keys(obj).forEach(k1 => {
    if (!obj.hasOwnProperty(k1)) return;
    Object.keys(obj[k1]).forEach(k2 => {
      if (!obj[k1].hasOwnProperty(k2)) return;
      if (!Array.isArray(obj[k1][k2])) return;
      obj[k1][k2].forEach(el => {
        if (!Array.isArray(newObj[el][k2]))  newObj[el][k2] = [k1]
        else newObj[el][k2].push(k1);
      });
    });
  });
  return newObj;
};
const arrset = arr => { // auch im Ordner client/.../util/arrutils.js
  let set = new Set();
  return arr.filter(el => {
    if (set.has(String(el)))  return false;
    set.add(String(el));
    return true;
  });
};


const getID = async (wort, username, Wort, User) => { // liefert wort._id (speichert ggf. neues Wort)
  // username zeigt nur an, wer das Wort erstellt hat, keine Rechte, jeder darf das Wort verwenden
  if (typeof wort !== "string" || String(wort).length === 0) return null;
  const suchWort = await Wort.findOne({ wort });
  // if (suchWort) console.log("--- gefunden: ",suchWort.wort);
  // console.log("+++ nicht gefunden: ",wort);
  if (suchWort) return suchWort._id;  // gefundene ID zurückgeben
  // if (typeof username !== "string" || String(username).length === 0) return null;
  let newWort;
  try {
    newWort = await new Wort({  // oder neues Wort erzeugen
      wort,
      username,
      color: `rgb(${Math.floor(Math.random()*200)+25},${Math.floor(Math.random()*200)+25},${Math.floor(Math.random()*200)+25})`
    }).save();
  } catch (e) {
    console.log("! Error: resolvers.js, Fkt getID:  wort =", wort, ", Error = ", e);
    // console.log(`! Wort \"${wort}\" konnte noch nicht gespeichert werden! (Aufruf: new Wort, Fkt. getID, resolvers.js)`);
    // rekursiv aufrufen, bis es in Mongo gespeichert wurde und eine ID geliefert wird
    return await getID(wort, username, Wort, User);
  }
  if (!newWort) {
    console.log("resolvers.js, Fkt. getID: Es wurde kein neues Wort erzeugt!  wort = ", wort);
    return null;
  }
  try {
    await User.findOneAndUpdate(
      { username },
      { 
        $addToSet: { worte: newWort._id },
        $set: { updatedDate: Date.now() },
      }
    );
  } catch (e) {
    console.log(`! User \"${username}\" zum Wort \"${newWort.wort}\" konnte nicht geupdatet werden! (Aufruf: User.findOneAndUpdate, Fkt. getID, resolvers.js):   ${e}`);
    return;
  }
  return newWort._id;
};
const getIDs = async (str, username, Wort, User) => { // liefert die wort._ids eines Satzes als Array
  // Unterschied zu worteIds(): verwendet username, erzeugt ggf. Wort-Dokumente gibt nur _ids
  if (str.trim()==="")  return [];
  let arr = str.trim().split(/\s/);
  if (!Array.isArray(arr) || arr.length === 0) return [];
  arr = await Promise.all(arr.map(async wort => {
    return await getID(wort.trim(), username, Wort, User);
  }));
  return arr;
};
const wortlinks = async (satz, Wort) => { // satz._id in den enthaltenen Worten eintragen
  if (!satz)  return;
  // Satztyp = typ
  const updatetyp = await Wort.findOneAndUpdate(
    { _id: satz.typ },
    { 
      $addToSet: { typuser: satz.username }, 
      $set: { 
        // typ: true ,
        updatedDate: Date.now(),
      } 
    },
    { new: true }
  );
  // Überschrift = wort
  const updatewort = await Wort.findOneAndUpdate(
    { _id: satz.wort },
    { 
      $addToSet: { satz: satz._id }, 
      $set: { updatedDate: Date.now() },
    },
    { new: true }
  );
  // Satz = worte
  const updateworte = await Promise.all(satz.worte.map(async id => {
    return await Wort.findOneAndUpdate(
      { _id: id },
      { 
        $addToSet: { satze: satz._id },
        $set: { updatedDate: Date.now() },
      },
      { new: true }
    );
  }));
  // Bedingungen = worteIf
  const updateworteIf = await Promise.all(satz.worteIf.map(async id => {
    return await Wort.findOneAndUpdate(
      { _id: id },
      { 
        $addToSet: { satzeIf: satz._id },
        $set: { updatedDate: Date.now() },
      },
      { new: true }
    );
  }));
  return;
};
const wortbereinigung = async ({ _id, wort, typuser, stopuser, satz, satze, satzeIf }, Wort) => { // wenn Wort auf keinen Satz mehr verweist und kein Satztyp ist
  if (typuser.length===0 && stopuser.length===0 && satz.length===0 && satze.length===0 && satzeIf.length===0) {
    try {
      wort = await Wort.findOneAndRemove({ _id });
      // console.log("wb wort", wort.wort);
      return wort;  // Wort wird nach löschen zurückgegeben
    } catch (e) {
      console.log("wortbereinigung Error: ", e.message);
      return null;
    }
  }
  return null;  // falls kein Wort gelöscht wurde
};
const wortunlinks = async (satz, Wort, Satz) => { // entfernt satz._id aus den betreffenden Worten und löscht "verwaiste" Worte ggf.
  // console.log("wul satz", satz);
  let updatetyp = null;
  const typwort = await Wort.findOne({_id: satz.typ});  // Satztyp wort
  if (typwort) {
    const typsatze = await Satz.find({typ: typwort._id, username: satz.username});
    // console.log("typsatze.length", typsatze && typsatze.length);
    if (!typsatze || typsatze.length===0) { // keine user-satze mehr des typs -> Typ löschen
      updatetyp = await Wort.findOneAndUpdate(
        { _id: satz.typ },
        { 
          $pull: { typuser: satz.username },
          $set: { updatedDate: Date.now() } 
        },
        { new: true }
      );
    }
  }
  const updatewort = await Wort.findOneAndUpdate(
    { _id: satz.wort },
    { 
      $pull: { satz: satz._id },
      $set: { updatedDate: Date.now() },
    },
    { new: true }
  );
  const updateworte = await Promise.all(satz.worte.map(async id => {
    return await Wort.findOneAndUpdate(
      { _id: id },
      { 
        $pull: { satze: satz._id },
        $set: { updatedDate: Date.now() },
      },
      { new: true }
    );
  }));
  const updateworteIf = await Promise.all(satz.worteIf.map(async id => {
    return await Wort.findOneAndUpdate(
      { _id: id },
      { 
        $pull: { satzeIf: satz._id },
        $set: { updatedDate: Date.now() },
      },
      { new: true }
    );
  }));
  // Wortbereinigung
  let worte = [updatetyp, updatewort, ...updateworte, ...updateworteIf];  // alles worte
  worte = worte.filter(wort => wort !== null); // null-Werte entfernen
  console.log("------- satz ", worte.map(w => !w ? w : w.wort))
  worte = await Promise.all(worte
    .map(async (wort, ix) => {
      return await wortbereinigung(wort, Wort);
    })
  );
  worte = worte.filter(w => !!w)
  return worte; // gelöschte Worte
};

const userlinks = async (satz, User) => { // verknüpft den Satz Besitzer user mit satz, typ und typfarbe (worte werden in Fkt getId verknüpft)
  console.log("Fkt userlinks: satz.wort ", satz.wort, ",  .typ ", satz.typ, ",  ._id ", satz._id);
  // satz und typ zum user hinzufügen
  const {username} = satz;
  let user
  try {
    await User.findOneAndUpdate(
      { username },
      { 
        $addToSet: { 
          satze: satz._id, 
          typen: satz.typ 
        },
        $set: { updatedDate: Date.now() },
      },
      { new: true }
    );
    // typfarbe hinzufügen bis die Arrays typen und typfarben gleich lang sind
    user = await User.findOne({ username });
    while (user.typen.length>user.typfarben.length) {
      user = await User.findOneAndUpdate(
        { username },
        { 
          $addToSet: { 
            typfarben: `rgb(${Math.floor(Math.random()*200)+25},${Math.floor(Math.random()*200)+25},${Math.floor(Math.random()*200)+25})`
          },
          $set: { updatedDate: Date.now() },
        },
        { new: true }
      );
    }
    return user;
  } catch (e) {
    console.log(`! User \"${username}\" zum Satz \"${input.wort}\" : \"${satzausgabe}\" konnten nicht geupdatet werden! (Aufruf: findOneAndUpdate, Fkt. addFullSatz, resolvers.js):   ${e}`);
    return null;
  }
};
const usersatzeunlinks = async (satze, User, Satz) => { // update User mit gelöschten Satzen
  if (!Array.isArray(satze))   satze = [satze];
  satze = satze.filter(s=>!!s);
  if (!satze.length>0 || !satze[0]) {
    console.log("resolvers.js Fkt usersatzeeunlinks: Keine satze gefunden!  satze = ", satze);
    return null;
  }
  // satze durchlaufen
  let updateuser = {};  // Ergebnisobjekt
  let typsatze, typix;
  // console.log({satze});
  try {
    await Promise.all(satze.map(async satz => {
      if (!satz)  return;
      updateuser[satz.wort.wort] = {};
      // ggf. gelöschten Typ aus typen entfernen, wenn kein weiterer Satz dieses Typs für den user besteht
      try{
        await Promise.all(["typen"].map(async key => {  // Promise.all hier zur Zeit unnötig
          try {
            updateuser[satz.wort.wort][key] = await User.find({ [key]: satz.typ }); // User, die den gelöschten Satztyp im typen haben
            updateuser[satz.wort.wort][key] = await Promise.all(updateuser[satz.wort.wort][key].map(async user => {
              if (!user)  return;
              typsatze = await Satz.find({typ: satz.typ, username: user.username}); // gibt es für diesen user noch weitere satze des gelöschten Typs? 
              // console.log("typsatze.length", typsatze && typsatze.length);
              if (typsatze && typsatze.length>0)  return null; // noch satze des typs -> nichts tun
              // keine satze mehr des typs -> Typ löschen
              typix = user.typen.indexOf(satz.typ);
              if (typix>-1) {
                user.typen.splice(typix, 1);
                user.typfarben.splice(typix, 1);  // gleichen Index für typfarben löschen
              }
              return await User.findOneAndUpdate(
                { _id: user._id },
                { $set: { 
                  typen: user.typen,
                  typfarben: user.typfarben,
                  updatedDate: Date.now(),
                } },
                { new: true }
              );
            }));
            updateuser[satz.wort.wort][key] = updateuser[satz.wort.wort][key].filter(u=>!!u).map(u=>u.username);
          } catch(e) {
            console.log(e);
          }
        }));
      } catch(e) {
        console.log(e);
      }
      // gelöschten Satz aus satze und favorites entfernen
      try{
        await Promise.all(["satze", "favorites"].map(async key => {
          try {
            updateuser[satz.wort.wort][key] = await User.find({ [key]: satz._id });
            updateuser[satz.wort.wort][key] = await Promise.all(updateuser[satz.wort.wort][key].map(async user => {
              return await User.findOneAndUpdate(
                { _id: user._id },
                { 
                  $pull: { [key]: satz._id }, 
                  $set: { updatedDate: Date.now() },
                },
                { new: true }
              );
            }));
            updateuser[satz.wort.wort][key] = updateuser[satz.wort.wort][key].map(u=>u.username);
          } catch(e) {
            console.log(e);
          }
        }));
      } catch(e) {
        console.log(e);
      }

    }));
  } catch(e) {
    console.log(e);
  }
  return updateuser;
};
const userworteunlinks = async (worte, User) => { // update User mit gelöschten Worten
  if (!Array.isArray(worte))   worte = [worte];
  worte = worte.filter(w=>!!w);
  if (!worte.length>0 || !worte[0]) {
    console.log("resolvers.js Fkt userworteeunlinks: Keine worte gefunden!  worte = ", worte);
    return null;
  }
  // worte durchlaufen
  let typind;
  let updateuser = {};
  try {
    await Promise.all(worte.map(async wort => {
      if (!wort)  return null;
      updateuser[wort.wort] = {}
      await Promise.all(["worte", "typen", "stopworte"].map(async key => {
        try {
          updateuser[wort.wort][key] = await User.find({ [key]: wort._id });
          updateuser[wort.wort][key] = await Promise.all(updateuser[wort.wort][key].map(async user => {
            if (key==="typen") {  // auch entsprechende Farbe entfernen
              typind = user.typen.findIndex(typ => String(typ)===String(wort._id));
              if (typind>-1) {
                user.typfarben.splice(typind, 1);
                return await User.findOneAndUpdate(
                  { _id: user._id },
                  { 
                    $pull: { [key]: wort._id }, 
                    $set: { 
                      typfarben: user.typfarben, 
                      updatedDate: Date.now() 
                    },
                  },
                  { new: true }
                );
              }
            }
            return await User.findOneAndUpdate(
              { _id: user._id },
              { 
                $pull: { [key]: wort._id }, 
                $set: { updatedDate: Date.now() },
              },
              { new: true }
            );
          }));
          updateuser[wort.wort][key] = updateuser[wort.wort][key].map(u=>u.username);
        } catch(e) {
          console.log(e);
        }
      }));
    }));
  } catch(e) {
    console.log(e);
  }
  return updateuser;
};
const userunlinks = async (satze, worte, User, Satz) => {  // update User mit gelöschten Satzen und Worten
  let worteuser, satzeuser;
  if (satze && !(Array.isArray(satze) && satze.length===0)) { // defined und keine leeres Array
    satzeuser = await usersatzeunlinks(satze, User, Satz);
    satzeuser = objarrconvert(satzeuser);
  }
  if (worte && !(Array.isArray(worte) && worte.length===0)) { // defined und keine leeres Array
    worteuser = await userworteunlinks(worte, User);
    worteuser = objarrconvert(worteuser);
  }
  satzeuser = satzeuser? satzeuser: {}
  worteuser = worteuser? worteuser: {};
  const users = new Set([...Object.keys(worteuser), ...Object.keys(satzeuser)]);
  let updateuser = {};
  [...users].forEach(user => updateuser[user] = {...worteuser[user], ...satzeuser[user]});
  return updateuser;
};

const searchobj = (input) => {
  let searchObj = {}; // _id= null:nicht, id:
  input && Object.keys(input).forEach(key => {
    if (typeof input[key]!=="undefined") searchObj[key] = input[key]
  });
  return searchObj;
};
const satzesuche = async (satzIdArr, {input}, { Satz }) => {
  // input._id wird nur bei null verwendet
  if (!satzIdArr) return null;
  if (!input) input = {};
  let searchObj;
  let satzesuche = await Promise.all(satzIdArr.map(async (id) => {
    searchObj = searchobj(input);
    searchObj = {...searchObj, _id: id};  // id wird durch id aus array überschrieben
    if (input._id===null) delete searchObj._id;
    let satzsuche = await Satz.findOne(searchObj);
    return satzsuche; 
  }));
  satzesuche = satzesuche.filter(satz => !!satz);
  // console.log("satzesuche: ", {satzesuche});
  return satzesuche; 
};
const wortesuche = async (wortIdArr, {input}, { Wort }) => {
  // input._id wird nur bei null verwendet
  if (!wortIdArr) return null;
  if (!input) input = {};
  let searchObj;
  let wortesuche = await Promise.all(wortIdArr.map(async (id) => {
    searchObj = searchobj(input);
    searchObj = {...searchObj, _id: id};  // id wird durch id aus array überschrieben
    if (input._id===null) delete searchObj._id;
    let wortsuche = await Wort.findOne(searchObj);
    return wortsuche; 
  }));
  return wortesuche; 
};

exports.resolvers = {
  Wort: {
    satz: async (wort, {input}, { Satz }) => {
      if (!wort) return null;
      return await satzesuche(wort.satz, {input}, { Satz })
    },
    satze: async (wort, {input}, { Satz }) => {
      if (!wort) return null;
      return await satzesuche(wort.satze, {input}, { Satz })
    },
    satzeIf: async (wort, {input}, { Satz }) => {
      if (!wort) return null;
      return await satzesuche(wort.satzeIf, {input}, { Satz })
    },
  },

  Satz: {
    typ: async (satz, {input}, { Wort }) => {
      // input._id = null als Zeichen dafür, dass _id nicht zur Selektion verwendet werden soll
      if (!input) input = {};
      if (input._id===null)   delete input._id
      else if (input._id===undefined && satz)   input._id = satz.typ;
      const searchObj = searchobj(input);
      return await Wort.findOne(searchObj);
    },
    wort: async (satz, {input}, { Wort }) => {
      // input._id = null als Zeichen dafür, dass _id nicht zur Selektion verwendet werden soll
      if (!input) input = {};
      if (input._id===null)   delete input._id
      else if (input._id===undefined && satz)   input._id = satz.wort;
      const searchObj = searchobj(input);
      return await Wort.findOne(searchObj);
    },
    worte: async (satz, {input}, { Wort }) => {
      // Unterschied zu wort: hier bringt nur input._id = null etwas, sonst wird dies ignoriert
      if (!satz) return null;
      return await wortesuche(satz.worte, {input}, { Wort });
    },
    worteIf: async (satz, {input}, { Wort }) => {
      // Unterschied zu wort: hier bringt nur input._id = null etwas, sonst wird dies ignoriert
      if (!satz) return null;
      return await wortesuche(satz.worteIf, {input}, { Wort });
    }
  },

  // Satztyp: {
  //   LISTE: 'Liste',
  // },

  Query: {
    // Wort -----------------------------------------------------------------
    wort: async (root, { _id, wort }, { Wort }) => {
      if (_id) {
        wort = await Wort.findOne({ _id });
      } else if (wort) {
        wort = await Wort.findOne({ wort });
      } else {
        throw new Error("Weder _id noch wort für die wort-query vorhanden!  (resolvers.js Query.wort)");
      }
      return wort;
    },
    suchWorte: async (root, { input }, { Wort }) => {
      // const { wort, stop, typ, color, username } = input;
      let searchObj = {};
      input && Object.keys(input).forEach(key => {
        if (typeof input[key]!=="undefined") searchObj[key] = input[key]
        // if (!["undefined"].includes(input[key])) searchObj[key] = input[key]
      });
      const suchworte = await Wort.find(searchObj)
      // console.log({searchObj});
      // console.log({suchworte});
      return suchworte;
    },
    getUserWorte: async (root, { username }, { Wort, Satz }) => { // UserWorte abgeleitet von getUserSatze
      const userSatze = await this.resolvers.Query.getUserSatze(root, { username }, { Satz });
      const userWorteObjs = userSatze.map(satz => [...satz.worte, ...satz.worteIf, satz.wort, satz.typ]).flat();
      let userWorteIds = arrset(userWorteObjs.map(wort => wort._id));
      let userWorte = await Promise.all(userWorteIds
        .map(async _id => await Wort.findOne(_id)));
      userWorte = userWorte.sort((a, b) => [a.wort, b.wort].sort()[0]===a.wort? -1: 1);
      console.log("len", userWorte.length);
      return userWorte;

      // const userWorte = await Wort.find({ username }).sort({
      //   createdDate: "desc"
      // });

      // getUserWorte: async (root, { username }, { Wort }) => {
      //   const userWorte = await Wort.find({ username }).sort({
      //     createdDate: "desc"
      //   });
      //   return userWorte;
      // },
    },
    getAllWorte: async (root, args, { Wort }) => {
      const allWorte = await Wort.find().sort({ createdDate: "desc" });
      return allWorte;
    },
    getPopWort: async (root, { _id }, { Wort }) => {
      const wort = await Wort.findOne({ _id }).populate({
        path: "satz",
        model: "Satz"
      }).populate({
        path: "satze",
        model: "Satz"
      }).populate({
        path: "satzeIf",
        model: "Satz"
      });
      return wort;
    },

    // Satz -----------------------------------------------------------------
    satz: async (root, { _id, wort, typ }, { Satz, Wort }) => {
      let satz;
      if (_id) {
        satz = await Satz.findOne({ _id });
      } else if (typeof wort==="string" && typeof typ==="string") {
        wort = await Wort.findOne({ wort });
        typ = await Wort.findOne({ wort: typ });
        satz = await Satz.findOne({ 
          wort: wort._id, 
          typ: typ._id 
        });
      } else {
        throw new Error("Weder _id noch wort+typ für die satz-query vorhanden!  (resolvers.js Query.satz)");
      }
      return satz;
    },
    // satz: async (root, { _id }, { Satz }) => {
    //   const satz = await Satz.findOne({ _id });
    //   return satz;
    // },
    getAllSatze: async (root, args, { Satz }) => {
      const allSatze = await Satz.find().sort({ 
        updatedDate: "desc",
        typ: "asc"
      });
      return allSatze;
    },
    getUserSatze: async (root, { username }, { Satz }) => {
      const findObj = username!=="admin"? {username}: {};   // bei admin ohne username suchen
      const userSatze = await Satz.find(findObj).sort({
        updatedDate: "desc",
        typ: "asc"
      });
      // if (username === "admin") {
      //   userSatze = await this.resolvers.Query.getAllSatze(root, { username }, { Satz });
      // } else {
      //   userSatze = await Satz.find({username}).sort({
      //     updatedDate: "desc",
      //     typ: "asc"
      //   });
      // }
      // console.log({userSatze});
      console.log("username", username, ", Anzahl Satze", userSatze.length);
      // console.log("userSatze", userSatze.map(s=>`${s.username}: ${s.typ}`));
      return userSatze;
    },
    getSaveStatus: async (root, { _id, input }, { Satz, Wort }) => {
      const { typ, wort, worte, username } = input;
      // let { typ } = input;
      // const typstr = typ;
      if (!username)  return  null;
      let idSatz, ops, satz, satzequal, satzS, savestatus, twSatz, typid, wortid, worteids, woSatz, woeSatz; // D = Datenbank-Dokument
      savestatus = "";
      satzS = _.pick(input, ["typ", "wort", "worte", "worteIf", "username"]);
      ops = new Set([]);  // ["create", "update", "delete"]
      if (_id) {
        idSatz = await Satz.findOne({ _id, username });
      } 
      if (typ && wort) {
        typid = await worteIds(typ, Wort, true);
        typid = typid? typid[0]: null;
        wortid = await worteIds(wort, Wort, true);
        wortid = wortid? wortid[0]: null;
        if (typid && wortid) {
          twSatz = await Satz.findOne({ typ: typid, wort:wortid, username }); // Typ, Überschrift und username müssen eindeutig sein
          if (twSatz) {
      // identitisch mit db-Satz
            satzequal = await satzEqual(satzS, twSatz, Wort);
            // console.log({satzequal});
            if (!Object.values(satzequal).includes(false)) {

              ops = new Set(["delete"]);
              if (idSatz) {
                satz = idSatz;
                if (String(twSatz._id)===String(idSatz._id))  savestatus += "id = "// komplett identisch
                else   savestatus += "id | ";
              } else {
                satz = twSatz;
              }
              savestatus += "TÜW+";
              return {
                ops,  //  ["create", "update", "delete"]
                savestatus, // "identisch", "id=tw", "id!=tw", "tw", "neuer Satz"
                satz,
              };
            } 
          }
        }
      // nicht identitisch mit db-Satz
        if (!twSatz)  ops.add("create");  //  Bedingung (&& typ && wort) von oben  // Erstellung möglich, da kein Satz mit gleicher Überschrift und Typ vorhanden
      }
      // Bezugssatz bestimmen (idSatz hat Priorität)
      if (idSatz) {
        satz = idSatz;
        savestatus = !twSatz? "id | ": (String(idSatz._id)===String(twSatz._id))? "id = TÜ": "id | TÜ"
      } else if (twSatz) {
        satz = twSatz;
        savestatus = "TÜ";
      // kein Bezugssatz vorhanden
      } else {
        satz = null;
        savestatus = "neu ";
      }
      // Check von Überschrift, Worte und Typ
      if (wortid && !savestatus.includes("Ü")) {
        woSatz = await Satz.findOne({ wort:wortid, username }); // Typ, Überschrift und username müssen eindeutig sein
        if (woSatz)   savestatus += "Ü";
      }
      worteids = await worteIds(worte, Wort, true);
      if (worteids) {
        woeSatz = await Satz.findOne({ worte:worteids, username }); // Typ, Überschrift und username müssen eindeutig sein
        if (woeSatz)  savestatus += "W";
      }
      if (!wort)    savestatus += ", Üb fehlt";
      if (!typ)  savestatus += ", Typ fehlt";
      // Satz mit gleicher Überschrift und Typ bereits in db vorhanden
      if (satz) { 
        ops.add("delete");
        if (typ && wort && 
          (ops.has("create") || !wortid || typ!==satz.typ.wort || (!!wortid && wortid!==satz.wort))) {
            ops.add("update");
        }
      }
      return {
        ops,  //  ["create", "update", "delete"]
        savestatus, // "identisch", "id=tw", "id!=tw", "tw", "neuer Satz"
        satz,
      };
    },
    getSaveStati: async (root, { input }, { Satz, Wort }) => {   // input = inkl. _id, sonst Strings
      let { saetze } = input; // Array mit satz-inputs
      console.log("--- saetze", saetze.map(sa=>sa.wort));
      let savestatus, _id;
      const savestati = await Promise.all(saetze.map(async input => {
        try {
          _id = input._id;
          delete input._id;
          savestatus = await this.resolvers.Query.getSaveStatus(root, { _id, input }, { Satz, Wort });
          if (!!savestatus) console.log(`getSaveStati: ${input.wort} : ${input.worte}`);
          return savestatus;
        } catch (e) {
          console.log(`! Satz konnte nicht fehlerfrei gespeichert werden! (Aufruf: getSaveStatus, Fkt. getSaveStati, resolver.js)`);
          console.log("error", e);
          return null;
        }
      }))
      console.log({savestati});
      return savestati;
    },
    getPopSatz: async (root, { _id }, { Satz }) => {
      const satz = await Satz.findOne({ _id }).populate({
        path: "typ",
        model: "Wort"
      }).populate({
        path: "wort",
        model: "Wort"
      }).populate({
        path: "worte",
        model: "Wort"
      }).populate({
        path: "worteIf",
        model: "Wort"
      });
      return satz;
    },
    suchSatze: async (root, { suchBegr, username }, { Satz, Wort }) => {
      if (!suchBegr) {
        const satze = await this.resolvers.Query.getUserSatze(root, { username }, { Satz })
        return satze;
      }
      // suchBegr vorhanden
      const suchWorte = await Wort.find(
        {
          $text: { $search: suchBegr }
        },
        {
          score: { $meta: "textScore" }
        }
      ).sort({
        score: { $meta: "textScore" }
      });
      if (suchWorte.length===0) return [];
      const suchIds = suchWorte.map(wort => wort._id);
      let findObj =           {
        $or: [
          { typ: { "$in": suchIds } },
          { wort: { "$in": suchIds } },
          { worte: { "$in": suchIds } },
          { worteIf: { "$in": suchIds } }
        ]
      }
      findObj = username!=="admin"? {...findObj, username}: findObj;   // bei admin ohne username suchen
      const suchErg = await Satz.find(findObj);
      return suchErg;
    },

    // User -----------------------------------------------------------------
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: "favorites",
        model: "Satz"
      }).populate({
        path: "satze",
        model: "Satz"
      }).populate({
        path: "worte",
        model: "Wort"
      }).populate({
        path: "typen",
        model: "Wort"
      }).populate({
        path: "stopworte",
        model: "Wort"
      });
      return user;
    },

    // Zitat -----------------------------------------------------------------
    zitat: async (root, { _id, kennwort, wort }, { Zitat }) => {
      let zitat;
      if (_id) {
        zitat = await Zitat.findOne({ _id });
      } else if (typeof kennwort==="string") {
        zitat = await Zitat.findOne({kennwort});
      } else if (typeof wort==="string") {
        zitat = await Zitat.findOne({ 
          wort: new RegExp(wort), 
        });
      } else {
        throw new Error("Weder _id, noch kennwort, noch wort in Zitat für die zitat-query vorhanden!  (resolvers.js Query.zitat)");
      }
      return zitat;
    },
    getAllZitate: async (root, args, { Zitat }) => {
      const allZitate = await Zitat.find().sort({ 
        updatedDate: "desc",
        kennwort: "asc"
      });
      return allZitate;
    },
    getUserZitate: async (root, { username }, { Zitat }) => {
      const findObj = username!=="admin"? {username}: {};   // bei admin ohne username suchen
      const userZitate = await Zitat.find(findObj).sort({
        updatedDate: "desc",
        kennwort: "asc"
      });
      console.log("username", username, ", Anzahl Zitate", userZitate.length);
      return userZitate;
    },
    
    // Recipe -----------------------------------------------------------------
    getAllRecipes: async (root, args, { Recipe }) => {
      const allRecipes = await Recipe.find().sort({ createdDate: "desc" });
      return allRecipes;
    },
    getRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOne({ _id });
      return recipe;
    },
    searchRecipes: async (root, { searchTerm }, { Recipe }) => {
      if (searchTerm) {
        const searchResults = await Recipe.find(
          {
            $text: { $search: searchTerm }
          },
          {
            score: { $meta: "textScore" }
          }
        ).sort({
          score: { $meta: "textScore" }
        });
        return searchResults;
      } else {
        const recipes = await Recipe.find().sort({
          likes: "desc",
          createdDate: "desc"
        });
        return recipes;
      }
    },
    getUserRecipes: async (root, { username }, { Recipe }) => {
      const userRecipes = await Recipe.find({ username }).sort({
        createdDate: "desc"
      });
      return userRecipes;
    },
  },
  Mutation: {
    // Wort -----------------------------------------------------------------
    addWort: async (root, { wort, stop, typ, color, username }, { Wort }) => {
      const newWort = await new Wort({
        wort,
        stop,
        typ,
        color,
        username
      }).save();
      return newWort;
    },
    deleteWort: async (root, { _id }, { Wort }) => {
      const wort = await Wort.findOneAndRemove({ _id });
      return wort;
    },
    updateWort: async (root, { _id, input }, { Wort }) => {
      const { wort, stop, typ, color, satz, satze, satzeIf, username } = input;
      const updatewort = await Wort.findOneAndUpdate(
        { _id },
        { $set: { wort, stop, typ, color, satz, satze, satzeIf, username } },
        { new: true }
      );
      return updatewort;
    },

    // Satz -----------------------------------------------------------------
    addFullSatze: async (root, { input }, { Satz, Wort, User }) => {  // input = alles Strings
      let { saetze } = input; // Array mit satz-inputs
      console.log({saetze});
      let satz;
      const satze = await Promise.all(saetze.map(async input => {
        try {
          satz = await this.resolvers.Mutation.addFullSatz(root, { input }, { Satz, Wort, User });
          if (!!satz) console.log(`addFullSatze: ${input.typ} : ${input.wort}`);
          return satz;
        } catch (e) {
          console.log(`! Satz konnte nicht fehlerfrei gespeichert werden! (Aufruf: addFullSatz, Fkt. addFullSatze, resolver.js)`);
          // console.log(`! Satz \"${satz.wort}\" : \"${satz.worte}\" konnte nicht fehlerfrei gespeichert werden! (Aufruf: addSatz, Fkt. addFullSatz, server.js)`);
          return null;
        }
      }))
      console.log({satze});
      return satze;
    },
    addFullSatz: async (root, { input }, { Satz, Wort, User }) => {  // input = alles Strings
      console.log("input:", input.typ, "-", input.wort);
      let { typ, wort, worte, worteIf, username } = input;
      worteIf = worteIf? worteIf: "";
      let satzausgabe = input.worte.length > 50 ? `${input.worte.slice(0, 30)}...${input.worte.slice(-15)}` : `${input.worte}`;
      // Worte anlegen oder bei vorhandenem Wort _id abfragen
      try { // Strings werden dabei in _id oder [_id] umgewandelt
        typ = await getID(typ, username, Wort, User);
        wort = await getID(wort, username, Wort, User);
        worte = await getIDs(worte, username, Wort, User);
        worteIf = await getIDs(worteIf, username, Wort, User);
      } catch (e) {
        console.log(`! Wort-IDs zum Satz \"${input.wort}\" : \"${satzausgabe}\" konnten nicht fehlerfrei erzeugt werden! (Aufruf: getID(s), Fkt. addFullSatz, resolvers.js)`);
        return;
      }
      // neuen Satz erzeugen
      let newSatz;
      try {
        newSatz = await new Satz({
          typ,
          wort,
          worte,
          worteIf,
          username,
          updatedDate: Date.now(),
        }).save();
      } catch (e) {
        console.log(`! Satz \"${input.wort}\" nicht!`);
        // console.log(`! Satz \"${input.wort}\" : \"${satzausgabe}\" konnte nicht fehlerfrei gespeichert werden! (Aufruf: newSatz, Fkt. addFullSatz, resolvers.js)`);
        // console.log(`Error: ${e}`);
        return;
      }
      if (!newSatz) return null;
      // Satz _id in den enthaltenen Worten eintragen
      try {
        await wortlinks(newSatz, Wort);
      } catch (e) {
        console.log(`! Wortlinks zum Satz \"${input.wort}\" : \"${satzausgabe}\" konnten nicht fehlerfrei erzeugt werden! (Aufruf: wortlinks, Fkt. addFullSatz, resolvers.js)`);
        return;
      }
      // Satz beim Ersteller-User eintragen
      let linkuser = await userlinks(newSatz, User);
      // console.log({linkuser});
      return newSatz;
    },
    addSatz: async (root, { input }, { Satz }) => {
      const { typ, wort, worte, worteIf, username } = input;
      const newSatz = await new Satz({
        typ,
        wort,
        worte,
        worteIf,
        username
      }).save();
      return newSatz;
    },
    deleteSatze: async (root, { ids }, { Satz, Wort, User }) => {  // Satz löschen, Worte unlinken und ggf. unverlinkte Worte löschen
      if (!Array.isArray(ids)) ids = [ids];
      console.log("dS ids", ids);
      let satz;
      const satze = await Promise.all(ids.map(async _id => {
        try {
          satz = await this.resolvers.Mutation.deleteSatz(root, { _id }, { Satz, Wort, User });
          if (!satz) console.log(`Fkt deleteSatze, Aufruf deleteSatz gab für id ${_id} kein Ergebnis!`);
          return satz;
        } catch (e) {
          console.log(`! Satz konnte nicht fehlerfrei gelöscht werden! (Aufruf: deleteSatz, Fkt. deleteSatze, resolver.js)`);
          console.log("Error: ", e);
          return null;
        }
      }))
      console.log(`${satze.length} satze: ${satze.map(s => String(s.createdDate).slice(0, 25))}`);
      return satze;
    },
    deleteSatz: async (root, { _id }, { Satz, Wort, User }) => {  // Satz löschen, Worte unlinken und ggf. unverlinkte Worte löschen
      // Achtung: populate wort an worte bringt hier nichts, da beide trotzdem null -> ggf. graphql-Error, wenn diese required
      const satz = await Satz.findOneAndRemove({ _id })
        .populate({
          path: "wort",
          select: "wort",
          model: "Wort"
        })
        .populate({
          path: "typ",
          select: "wort",
          model: "Wort"
        });
      if (!satz) {
        throw new Error("resolvers.js Fkt deleteSatz: Satz konnte nicht gelöscht werden!  Satz._id: ", _id);
      }
      const loeschworte = await wortunlinks(satz, Wort, Satz);
      const unlinkuser = await userunlinks(satz, loeschworte, User, Satz);
      console.log(`resolvers.js Fkt deleteSatz:`);
      console.log(`Gelöschter Satz: ${satz.typ.wort}: ${satz.wort.wort}`);
      console.log("Gelöschte Worte:", loeschworte.map(w=>w.wort));
      console.log("Geänderte User:", unlinkuser);
      console.log(`Gelöschter Satz: ${{satz}}`);
      return satz;  // Achtung!: wird in der graphql-response nicht so wie im log zurückgegeben, da ggf. die Worte gelöscht (null) sind
    },
    updateFullSatze: async (root, { input }, { Satz, Wort, User }) => {  // update durch delete und save,  input = inkl. _id, sonst Strings
      let { saetze } = input; // Array mit satz-inputs
      // console.log("--- saetze", saetze.map(sa=>sa.wort));
      let satz, _id;
      const satze = await Promise.all(saetze.map(async input => {
        try {
          _id = input._id;
          delete input._id;
          satz = await this.resolvers.Mutation.updateFullSatz(root, { _id, input }, { Satz, Wort, User });
          if (!!satz) console.log(`updateFullSatze: ${input.typ} : ${input.wort}`);
          return satz;
        } catch (e) {
          console.log(`! Satz konnte nicht fehlerfrei geändert werden! (Aufruf: updateFullSatz, Fkt. updateFullSatze, resolver.js)`);
          // console.log(`! Satz \"${satz.wort}\" : \"${satz.worte}\" konnte nicht fehlerfrei gespeichert werden! (Aufruf: addSatz, Fkt. updateFullSatz, server.js)`);
          return null;
        }
      }))
      // console.log({satze});
      return satze;
    },
    updateFullSatz: async (root, { _id, input }, { Satz, Wort, User }) => {  // update durch delete und save,  input = alles Strings
      let delsatz, savesatz, updsatz;
      try {
        delsatz = await this.resolvers.Mutation.deleteSatz(root, { _id }, { Satz, Wort });
        if (!delsatz) return;
      } catch (e) {
        console.log(`! Satz (_id:${_id}) konnte nicht fehlerfrei gelöscht werden! (Aufruf: deleteSatz, Fkt. updateFullSatz, resolver.js)`);
        return;
      }
      try {
        savesatz = await this.resolvers.Mutation.addFullSatz(root, { input }, { Satz, Wort, User });
        if (!savesatz) return;
      } catch (e) {
        console.log(`! Satz (wort:${input.wort}) konnte nicht fehlerfrei gespeichert werden! (Aufruf: addFullSatz, Fkt. updateFullSatz, resolver.js)`);
        return;
      }
      input = {...input, _id: savesatz._id, createdDate: delsatz.createdDate};
      try {
        // updsatz = await this.resolvers.Mutation.updateSatz(root, { input }, { Satz, Wort, User });
        updsatz = await Satz.findOneAndUpdate(
          { _id: savesatz._id },
          { $set: { 
            createdDate: delsatz.createdDate, 
            updatedDate: Date.now() 
          } },
          { new: true }
        );
        // console.log({updsatz});
        if (!updsatz) return;
      } catch (e) {
        console.log(`! Satz (_id:${savesatz._id}) konnte nicht fehlerfrei geändert werden! (Aufruf: updateSatz, Fkt. updateFullSatz, resolver.js)`);
        console.log("error", e);
        return;
      }
      return updsatz;
    },
    updateSatz: async (root, { _id, input }, { Satz }) => {
      const { typ, wort, worte, worteIf, username, createdDate } = input;
      const updatesatz = await Satz.findOneAndUpdate(
        { _id },
        { $set: { typ, wort, worte, worteIf, username, createdDate, updatedDate: Date.now() } },
        { new: true }
      );
      console.log({updatesatz});
      return updatesatz;
    },
    // deleteSatzZuneu: async (root, { _id }, { Satz, Wort }) => {  // Satz löschen, Worte unlinken und ggf. unverlinkte Worte löschen
    //   try {
    //     const satz = await Satz.findOneAndRemove({ _id }).populate({
    //       path: "wort",
    //       model: "Wort"
    //     });
    //   } catch (e) {
    //     console.log(`! Satz mit id "${_is}" konnte nicht fehlerfrei gelöscht werden! (Aufruf: findOneAndRemove, Fkt. deleteSatz, resolvers.js)`);
    //     return;
    //   }
    //   console.log("dS1 satz", satz);
    //   try {
    //     const loeschworte = await wortunlinks(satz, Wort);
    //   } catch (e) {
    //     console.log(`! Satz "${satz.wort.wort}" konnte nicht fehlerfrei geunlinkt werden! (Aufruf: wortunlinks, Fkt. deleteSatz, resolvers.js)`);
    //     console.log("Error: ", e);
    //     return;
    //   }
    //   console.log("dS2 satz", satz);
    //   console.log("Gelöschter Satz:", satz.wort.wort);
    //   console.log("Gelöschte Worte:", loeschworte);
    //   return satz;  // wird in der graphql-response nicht so wie im log zurückgegeben, da ggf. die Worte gelöscht sind
    // },
    // Nachfolgende 3 resolver noch nicht benutzt
    addUserSatze: async (root, { ids, username }, { User }) => {
      if (!Array.isArray(ids)) ids = [ids];
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { satze: { $each: ids } } }
      );
      return user;
    },
    deleteUserSatze: async (root, { ids, username }, { User }) => {
      if (!Array.isArray(ids)) ids = [ids];
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { satze: { $in: ids } } }
      );
      return user;
    },
    deleteAllUserSatze: async (root, { username }, { User }) => {
      const user = await User.findOneAndUpdate(
        { username },
        { $set: { satze: [] } }
      );
      return user;
    },

    // User -----------------------------------------------------------------
    addUserWorte: async(root, {username, worte, key, bAdd}, {User, Wort}) => {  // fügt worte ("worte", "stopworte" oder "typen") zum User hinzu
      console.log( {username, worte, key, bAdd});
      if (bAdd!==false) bAdd = true;  // standardmäßig worte hinzufügen, kann aber auch löschen bei bAdd=false
      if (!Array.isArray(worte)) {
        worte = [worte]
      }
      if (!["worte", "stopworte", "typen"].includes(key)) {
        key = "typen";  // Standard-key
      }
      // User vorhanden?
      try { // Strings werden dabei in _id oder [_id] umgewandelt
        const user = await User.findOne({username});
        if (!user) {
          throw new Error("User nicht gefunden");
        }
      } catch (e) {
        console.log(`! User mit username \"${username}\" wurde nicht gefunden! (Aufruf: User.findOne, Fkt. addUserWorte, resolvers.js)`);
        return;
      }
      // Worte anlegen oder bei vorhandenem Wort _id abfragen
      let worteIds;
      try { // Strings werden dabei in _id oder [_id] umgewandelt
        worteIds = await getIDs(worte.join(" "), username, Wort, User);
      } catch (e) {
        console.log(`! Wort-IDs für die worte \"${worte}\" konnten nicht fehlerfrei erzeugt werden! (Aufruf: getID(s), Fkt. addUserWorte, resolvers.js)`);
        // console.log(e.message);
        return;
      }
      // User aktualisieren
      let updateuser;
      try { // Strings werden dabei in _id oder [_id] umgewandelt
        const opArgs = bAdd? { 
          $addToSet: { [key]: {$each: worteIds} },
        }:{ 
          $pull: { [key]: {$in: worteIds} },
        };
        updateuser = await User.findOneAndUpdate(
          {username},
          { 
            ...opArgs,
            $set: { updatedDate: Date.now() } 
          },
          { new: true }
        ).populate({
          path: key,
          model: "Wort"
        });
      } catch (e) {
        console.log(`! User mit username \"${username}\" wurde nicht aktualisiert! (Aufruf: User.findOneAndUpdate, Fkt. addUserWorte, resolvers.js)`);
        return;
      }
      if (!updateuser) {
        console.log(`! User mit username \"${username}\" wurde nicht gefunden! (Aufruf: User.findOneAndUpdate, Fkt. addUserWorte, resolvers.js)`);
        return;
      }
      const userworte = updateuser[key].map(wo=>wo.wort);
      const changeworte = bAdd?
        worte.filter(wort => userworte.includes(wort)):
        worte.filter(wort => !userworte.includes(wort));
      if (key==="worte")  return {worte: changeworte};  // 
      // Worte aktualisieren, ggf. löschen
      const wortkey = {
        worte: "username",  // kein Array!
        stopworte: "stopuser",
        typen: "typuser",
      }
      try {
        const opArgs = key==="worte"?
        (bAdd? {   // kein Array
          $set: { [wortkey[key]]: username },
        }:{ 
          $set: { [wortkey[key]]: null },
        }):
        (bAdd? {   // Array
          $addToSet: { [wortkey[key]]: username },
        }:{ 
          $pull: { [wortkey[key]]: username },
        });
        const updateworte = await Promise.all(changeworte.map(async wort => {
          return await Wort.findOneAndUpdate(
            { wort },
            { 
              ...opArgs,
              $set: { updatedDate: Date.now() },
            },
            { new: true }
          );
        }));
        if (!bAdd) {
          await Promise.all(updateworte
            .map(async (wort, ix) => {
              return await wortbereinigung(wort, Wort);
            })
          );
        }
      } catch(e) {
        console.log("Fehler: (Aufruf: User.findOne / wortbereinigung, Fkt. addUserWorte, resolvers.js)", e.message)
      }
      console.log("return ", {worte: changeworte});
      return {worte: changeworte};
    },
    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      return { token: createToken(user, process.env.SECRET, "2hr") };
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exists");
      }
      const newUser = await new User({
        username,
        email,
        password,
        delete: [],
        update: [],
        read: [],
      }).save();
      return { token: createToken(newUser, process.env.SECRET, "3hr") };
    },

    // Zitat -----------------------------------------------------------------
    addZitat: async (root, { input }, { Zitat, User }) => {  // input = alles Strings
      console.log("input:", input.zitat, "-", input.kennwort);
      let { 
        zitat,
        kennwort,
        kategorie,
        rang,
        likes,
        autor,
        username
      } = input;
      // neuen Zitat erzeugen
      let newZitat;
      try {
        newZitat = await new Zitat({
          zitat,
          kennwort,
          kategorie,
          rang,
          likes,
          autor,
          username,
          updatedDate: Date.now(),
          createdDate: Date.now(),
        }).save();
      } catch (e) {
        console.log(`! Zitat \"${input.kennwort}\" nicht!`);
        // console.log(`Error: ${e}`);
        return;
      }
      if (!newZitat) return null;
      // Zitat beim Ersteller-User eintragen
      try {
        await User.findOneAndUpdate(
          { username },
          { 
            $addToSet: { 
              zitate: newZitat._id, 
          },
            $set: { updatedDate: Date.now() },
          },
          { new: true }
        );
      } catch (e) {
        console.log(`! User \"${username}\" zum Satz \"${input.kennwort}\" : \"${input.zitat}\" konnten nicht geupdatet werden! (Aufruf: findOneAndUpdate, Fkt. addZitat, resolvers.js):   ${e}`);
        return null;
      }
      return newZitat;
    },
    deleteZitate: async (root, { ids }, { Zitat, User }) => {  // Zitate löschen
      if (!Array.isArray(ids)) ids = [ids];
      console.log("dZ ids", ids);
      let zitat;
      const zitate = await Promise.all(ids.map(async _id => {
        try {
          zitat = await this.resolvers.Mutation.deleteZitat(root, { _id }, { Zitat, User });
          if (!zitat) console.log(`Fkt deleteZitate, Aufruf deleteZitat gab für id ${_id} kein Ergebnis!`);
          return zitat;
        } catch (e) {
          console.log(`! Zitat konnte nicht fehlerfrei gelöscht werden! (Aufruf: deleteZitat, Fkt. deleteZitate, resolver.js)`);
          console.log("Error: ", e);
          return null;
        }
      }))
      console.log(`${zitate.length} zitate: ${zitate.map(s => String(s.createdDate).slice(0, 25))}`);
      return zitate;
    },
    deleteZitat: async (root, { _id }, { Zitat, User }) => {
      const zitat = await Zitat.findOneAndRemove({ _id });
      if (!zitat)   return null;
      // Zitat beim Ersteller-User austragen
      try {
        await User.findOneAndUpdate(
          { username: zitat.username },
          { 
            $pull: { 
              zitate: zitat._id, 
          },
            $set: { updatedDate: Date.now() },
          },
          { new: true }
        );
      } catch (e) {
        console.log(`! User \"${zitat.username}\" zum Zitat \"${zitat.kennwort}\" : \"${zitat.zitat}\" konnten nicht geupdatet werden! (Aufruf: findOneAndUpdate, Fkt. deleteZitat, resolvers.js):   ${e}`);
        return null;
      }
      return zitat;
    },
    updateZitat: async (root, { _id, input }, { Zitat }) => {
      const updatezitat = await Zitat.findOneAndUpdate(
        { _id },
        { $set: {
          ...input,
          updatedDate: Date.now()
        } },
        { new: true }
      );
      return updatezitat;
    },

    // Recipe -----------------------------------------------------------------
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
    deleteUserRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOneAndRemove({ _id });
      return recipe;
    },
    likeRecipe: async (root, { _id, username }, { Recipe, User }) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        { $inc: { likes: 1 } }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: _id } }
      );
      return recipe;
    },
    unlikeRecipe: async (root, { _id, username }, { Recipe, User }) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        { $inc: { likes: -1 } }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: _id } }
      );
      return recipe;
    },

  }
};
