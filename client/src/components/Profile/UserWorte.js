import React from "react";
import { Fold } from "./../CellFold";
import ReactTable from "react-table";
import SaveUserWortButton from "./SaveUserWortButton";

const UserWorte = ({ user }) => {
  const wortdata = user.worte
    .sort((a, b)=>[a.wort.toLowerCase(), b.wort.toLowerCase()].sort()[0]===a.wort.toLowerCase()? -1: 1)
    .map(wort => ({
      Wort: wort.wort,
      Überschrift: wort.satz.length,
      Satztyp: user.typen.map(wo => wo.wort).includes(wort.wort)? "+": "-",
      Stopwort: user.stopworte.map(wo => wo.wort).includes(wort.wort)? "+": "-",
    }));
  let columns = Object.keys(wortdata[0]).map(key => ({
    Header: key,
    accessor: key
  }))
  columns[3] = {
    ...columns[3],
    Cell: ({index, row, value}) => ( //  console.log({index, value, row}) ||
      <SaveUserWortButton 
        bAdd={value==="-"}
        user={user}
        worte={[row.Wort]}
      />
    ),
    // minWidth: editMinWidth,
  };
  return (
      <Fold summary="Worte">
        <h3>Worte</h3>
        <ReactTable
          defaultPageSize={10}
          className="-striped -highlight"
          data={wortdata}
          columns={columns}
          filterable
          style={{margin: "auto", padding: 0}}
        />
      </Fold>
  );
}

export default UserWorte;
