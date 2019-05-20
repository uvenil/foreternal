import React from "react";

// Import React Table
import ReactTable from "react-table";
import createCheckbox from "./createCheckbox";
import "react-table/react-table.css";;

class SatzTableEdit extends React.Component {
  constructor(props) {
    super();
    this.state = {
      // data: props.saetze
      data: [
        {
          "ix": 1,
          "typ": "Hierarchie",
          "wort": "zeit",
          "worte": "die zeit für kleine politik ist vorbei schon das nächste jahrhundert bringt den kampf um die erd-herrschaft den zwang zur großen politik",
          "worteIf": "",
          "username": "C+I+L+N"
        },
        {
          "ix": 2,
          "typ": "Erbfolge",
          "wort": "ihm",
          "worte": "du hast ihm eine gelegenheit gegeben größe des charakters zu zeigen und er hat sie nicht benutzt das wird er dir nie verzeihen",
          "worteIf": "",
          "username": "a"
        },
        {
          "ix": 3,
          "typ": "Taggruppe",
          "wort": "wunderlichen",
          "worte": "durch die sichere aussicht auf den tod könnte jedem leben ein köstlicher wohlriechender tropfen von leichtsinn beigemischt sein und nun habt ihr wunderlichen apotheker-seelen aus ihm einen übelriechenden gift-tropfen gemacht durch den das ganze leben widerlich wird",
          "worteIf": "",
          "username": "C+I+L+N"
        }
      ]
    };
    this.renderEditable = this.renderEditable.bind(this);
  }
  componentDidMount() {
    // console.log("this.props.saetze", this.props.saetze);
  }
  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }
  render() {
    const { data } = this.state;
    const columns = [
      {
        id: "1",
        Header: "Check",
        accessor: (index) => createCheckbox(index),
        Cell: createCheckbox()
      },
      {
        Header: "Überschrift",
        accessor: "wort",
        Cell: this.renderEditable
      },
      {
        Header: "Satz",
        accessor: "worte",
        Cell: this.renderEditable
      },
      {
        Header: "Satztyp",
        accessor: "typ",
        Cell: this.renderEditable
      },
      {
        Header: "Gültig",
        accessor: "worteIf",
        Cell: this.renderEditable
      },
      {
        Header: "erstellt",
        accessor: "createdDate",
        Cell: this.renderEditable
      },
      {
        Header: "Autor",
        accessor: "username",
        Cell: this.renderEditable
      },
    ];
    return (
      <div>
        <SatzTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

// {
//   Header: "typ",
//   id: "full",
//   accessor: d =>
//     <div
//       dangerouslySetInnerHTML={{
//         __html: d.firstName + " " + d.lastName
//       }}
//     />
// }


export default SatzTableEdit;