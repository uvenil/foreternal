import React, { useState } from "react";
// import useForm from "./../Hooks/useForm";
import { Fold } from "./../CellFold";
import ReactTable from "react-table";
import {stoppwortliste} from "../../util/stoppwortliste"
import {einleer} from "../../util/wortber"
import SaveUserWortButton from "./SaveUserWortButton";
import Textarea from 'react-textarea-autosize';

const UserStopWorte = ({ user }) => {
  const [stopwort, setstopwort] = useState("");
  // const editMinWidth = 2;
  // const editStyle = {flexGrow: 0.4, padding: 0, textAlign: "center"};
  const defaultSorted = null;
  const userstopworte = user.stopworte.map(wo => wo.wort);
  const userworte = user.worte.map(wo => wo.wort);
  const alleStopWorte = new Set([...userstopworte, ...stoppwortliste, ...userworte]);
  const stopwortdata = [...alleStopWorte]
    .map(wort => ({
      Wort: wort,
      "Benutzer": userstopworte.includes(wort)? "+": "-",
      "Standard": stoppwortliste.includes(wort)? "+": "-",
    }));
  let columns = Object.keys(stopwortdata[0]).map(key => ({
    Header: key,
    accessor: key
  }));
  columns[1] = {
    ...columns[1],
    Cell: ({index, row, value}) => ( //  console.log({index, value, row}) ||
      <SaveUserWortButton 
        bAdd={value==="-"}
        user={user}
        worte={[row.Wort]}
      />
    ),
  };
  columns[2] = {
    ...columns[2],
    Header: ({index, row, value}) => ( //  console.log({index, value, row}) ||
    <div>
      <SaveUserWortButton 
        button={true}
        bAdd={false}
        user={user}
        worte={stoppwortliste}
      />
      {"Standard"}
      <SaveUserWortButton 
        button={true}
        bAdd={true}
        user={user}
        worte={stoppwortliste}
      />
    </div>
    ),
  };

  return (
      <Fold summary="Stopworte">
        <h3>Stopworte</h3>
        <div>
          <Textarea
            autoFocus={true}
            cols="60"
            name="textInput"
            onChange={e => setstopwort(e.target.value)}
            placeholder="neue Stopworte hier eingeben (mit Leerzeichen getrennt)"
            rows={1}
            value={stopwort}
            wrap="soft"
          >
          </Textarea>
          <SaveUserWortButton 
            button={true}
            bAdd={true}
            user={user}
            worte={einleer(stopwort).split(" ")}
          />
        </div>
        <ReactTable
          defaultPageSize={10}
          className="-striped -highlight"
          data={stopwortdata}
          defaultSorted={defaultSorted || [
            {id:"Wort", desc:false},
          ]}
          columns={columns}
          filterable
          style={{margin: "auto", padding: 0}}
        />
      </Fold>
  );
}

export default UserStopWorte;
