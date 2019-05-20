import React from "react";
// import { makeData } from "./Utils";
// import _ from "lodash";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const columns = [
  {
    Header: "Satz",
    columns: [
      {
        Header: "Überschrift",
        // accessor: "wort"
        id: "wort",
        accessor: d => d.wort.wort
      },
      {
        Header: "Satz",
        // accessor: "worte"
        id: "worte",
        accessor: d => d.worte.map(wort => wort.wort+" ")
      }
    ]
  },
  {
    Header: "Info",
    columns: [
      {
        Header: "Typ",
        accessor: "typ",
        // aggregate: vals => _.round(_.mean(vals)),
        // Aggregated: row => {
        //   return (
        //     <span>
        //       {row.value} (avg)
        //     </span>
        //   );
        // },
        // filterMethod: (filter, row) =>
        //   filter.value === `${row[filter.id]} (avg)`
      },
      {
        Header: "erstellt",
        accessor: "createdDate",
        // aggregate: vals => _.sum(vals),
        // filterable: false
      }
    ]
  }
];

class WortTabelle extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: props.satzListe
    };
  }
  render() {
    
    const { data } = this.state;
    console.log("data", data);
    return (
      <div>
        <SatzTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          pivotBy={["wort"]}
          filterable
          SubComponent={row => {
            return (
              <div style={{ padding: "20px" }}>
                <em>
                  You can put any component you want here, even another React
                  Table!
                </em>
                <br />
                <br />
                <SatzTable
                  data={data}
                  columns={columns}
                  defaultPageSize={3}
                  showPagination={false}
                  SubComponent={row => {
                    return (
                      <div style={{ padding: "20px" }}>Sub Component!</div>
                    );
                  }}
                />
              </div>
            );
          }}
        />
        <br />
      </div>
    );
  }
}

export default WortTabelle;
