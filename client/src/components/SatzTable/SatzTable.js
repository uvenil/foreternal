import React from "react";
import ReactTable, { ReactTableDefaults } from "react-table";
import FoldableTableHOC from './../../modulemanuell/foldableTable'
import matchSorter from 'match-sorter'
import "react-table/react-table.css";
import createCheckbox from './../common/createCheckbox';
import DeleteButton from "./../common/DeleteButton";
import untersatzTypen from "../../util/untersatzTypen";
import {formatSatze, unformatDate} from "../../util/formatSatze";
import {isObject, subKeySet} from "../../util/objutils";
import createWort from "./createWort";
import WortFilter from "./WortFilter";
import initFilter from "./initFilter";
import { Grid, Cell, Fold } from "./../CellFold";

const FoldableTable = FoldableTableHOC(ReactTable);
Object.assign(ReactTableDefaults, {
  loadingText: "lädt...",
  nextText: "vor",
  noDataText: "keine Daten",
  ofText: "von",
  previousText: "zurück",
  pageText: "Seite",
  rowsText: "Zeilen",
  getResizerProps: (state, rowInfo, column, instance) => {
    return ({
      style: {right: 0, width: "10%"}
    })
  }
});

ReactTableDefaults.column = {
  ...ReactTableDefaults.column,
  minWidth: 3,
}

const basisSatzStyle = {
  backgroundColor: "#f8f8f8",
  fontSize:"1.1rem",
  fontWeight: "bold",
}

const ZeichenButton = ({zeichen, clickHandler, style}) => (
  <div>
    <strong><i>
      <a 
        onClick={clickHandler}
        style={style}
      >
        {zeichen}
      </a>
    </i></strong>
  </div>
);

const sortDate = (a, b, desc) => {
  a = unformatDate(a);
  b = unformatDate(b);
  return ReactTable.defaultProps.defaultSortMethod(a, b, desc);
};

const filterFkt = filter => {
  // filter = {fdust: {d:d=>true, u:u=>true, s:s=>s===false, t:t=>true}}
  let filterfkt = {};
  const fb = filter.boolean;
  const fv = filter.values;
  filterfkt.s = fb["Stopworte"] && fb["Nicht-Stopworte"]? s=>true:
    !fb["Stopworte"] && !fb["Nicht-Stopworte"]? s=>false:
    !fb["Stopworte"] && fb["Nicht-Stopworte"]? s=>s===false:
    fb["Stopworte"] && !fb["Nicht-Stopworte"]? s=>s===true: null;
  filterfkt.t = fb["Typworte"] && fb["Nicht-Typworte"]? t=>true:
    !fb["Typworte"] && !fb["Nicht-Typworte"]? t=>false:
    !fb["Typworte"] && fb["Nicht-Typworte"]? t=>t===false:
    fb["Typworte"] && !fb["Nicht-Typworte"]? t=>t===true: null;
  filterfkt.u = fb["Ü Satzvorkommen größer gleich"] && fb["Ü Satzvorkommen kleiner"]? u=>true:
    !fb["Ü Satzvorkommen größer gleich"] && !fb["Ü Satzvorkommen kleiner"]? u=>false:
    !fb["Ü Satzvorkommen größer gleich"] && fb["Ü Satzvorkommen kleiner"]? u=>u<fv["uebanz"]:
    fb["Ü Satzvorkommen größer gleich"] && !fb["Ü Satzvorkommen kleiner"]? u=>u>=fv["uebanz"]: null;
  filterfkt.d = fb["D Überschriftenanzahl größer gleich"] && fb["D Überschriftenanzahl kleiner"]? d=>true:
    !fb["D Überschriftenanzahl größer gleich"] && !fb["D Überschriftenanzahl kleiner"]? d=>false:
    !fb["D Überschriftenanzahl größer gleich"] && fb["D Überschriftenanzahl kleiner"]? d=>d<fv["detanz"]:
    fb["D Überschriftenanzahl größer gleich"] && !fb["D Überschriftenanzahl kleiner"]? d=>d>=fv["detanz"]: null;
  // bei bStat=false funktionieren sollten nachfolgende Filter immer true ergeben, was noch nicht so ist
  filterfkt["ueb-nsworteZahl"] = fb["Überblick-Wortzahl größer gleich"] && fb["Überblick-Wortzahl kleiner"]? ug=>true:
    !fb["Überblick-Wortzahl größer gleich"] && !fb["Überblick-Wortzahl kleiner"]? ug=>false:
    !fb["Überblick-Wortzahl größer gleich"] && fb["Überblick-Wortzahl kleiner"]? ug=>ug<fv["uebwz"]:
    fb["Überblick-Wortzahl größer gleich"] && !fb["Überblick-Wortzahl kleiner"]? ug=>ug>=fv["uebwz"]: null;
  filterfkt["det-nsworteZahl"] = fb["Detail-Wortzahl größer gleich"] && fb["Detail-Wortzahl kleiner"]? dg=>true:
    !fb["Detail-Wortzahl größer gleich"] && !fb["Detail-Wortzahl kleiner"]? dg=>false:
    !fb["Detail-Wortzahl größer gleich"] && fb["Detail-Wortzahl kleiner"]? dg=>dg<fv["detwz"]:
    fb["Detail-Wortzahl größer gleich"] && !fb["Detail-Wortzahl kleiner"]? dg=>dg>=fv["detwz"]: null;
  return filterfkt;
};

const initialState = {
  filter: initFilter,
  filterfkt: filterFkt(initFilter),
  folded: {   // für Header-Columns
    col_0: false,
    col_1: false,
    col_2: true,
  },
  foldcol: "Alle Spalten",  // aktuell ein-/auszublendende Spalte
  foldcols: new Set([]),  // für normale Columns, Eintrag des Header-Namens im Set, wenn gefaltet
  height: 0,
  pivot: [],
  selected: new Set([]),
  stateloaded: false,
  width: 0,
  wortinfo: true,  // Zusatzinformationen zum Wort anzeigen (DUST = Detail, Überschrift, Stopwort, Typwort)
  zeilenumbruch: true,
}

// props: satze, (satzeView), handleClick, ersteZeile, handleChange(Existenz = Zeichen für typAuswahl)
class SatzTable extends React.Component {
  constructor(props) {
    super();
    // console.log({props});
    let folded = {...initialState.folded, ...props.folded};
    let foldcols;
    if (Array.isArray(props.foldcols)) {
      foldcols = new Set([...initialState.foldcols, ...props.foldcols]);
    } else {
      foldcols = initialState.foldcols;
    }
    this.state = {
      ...initialState,
      data: formatSatze(props.satze),
      folded,
      foldcols,
      pivot: props.pivot || initialState.pivot,
      wortinfo: props.wortinfo || initialState.wortinfo,
    };
  }

  componentDidMount() {
    let { satze } = this.props;
    // console.log("satze:", satze);
    if (!(satze && satze.length>0))  return;
    // selected, Checkbox-Groups erstellen,     einfachere Checkbox-Groups als in SatzEditCont.js
    this.checkboxGroups = {
      "allesatze": new Set([...Array(satze.length).keys()].map(n => String(n)))
    }
    let selected = new Set([ // ausgewählte Checkboxen hier
      // "allesatze", 
    ]);
    selected = this.toggleCheckboxGroups(this.checkboxGroups, selected);
    // Optionen (selected) im state setzen
    // let {height, width} = this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.setState({
      selected,
    }, () => { // satze im state setzen
      this.updateWindowDimensions();
      this.setState({ stateloaded: true });  // loaded = Zeichen, dass man sich auf den state verlassen kann
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  // handleDelete befindet sich in DeleteButton.js = (ix) => {
  handleEdit = (satzeEdit) => {
    if (satzeEdit) {
      console.log({satzeEdit});
      this.props.userdata.set({satzeEdit});
    }
  }

  handleFilterChange = filter => {
    this.setState(() => ({filter, filterfkt: filterFkt(filter) }));
  }

  toggleCheckbox = (id) => {
    let {selected} = this.state;
    // console.log({id, selected});
    if (!id)  return selected;  // ohne Parameter "id" wird das Set mit den ausgewählten Checkboxen zurückegegeben
    id = String(id);
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    // checkboxGroups
    const groupIdSet = new Set(Object.keys(this.checkboxGroups));
    if (groupIdSet.has(id)) { // id ist checkboxGroup-id
      selected = this.toggleCheckboxGroup({[id]: this.checkboxGroups[id]}, selected)
    } else {                  // id ist evtl. Element einer checkboxGroup
      selected = this.toggleCheckboxGroupElements(id, this.checkboxGroups, selected)
    }
    this.setState(
      {selected}, 
      // this.changeCheck(id) // Auswirkungen der Checkboxen auf den state
    );
  }

  toggleCheckboxGroup = (group, selected) => {  // group = {"id":Set};  alle (groupId) -> einzelne (idSet);  groups = {"id1":Set1, "id2":Set2, ...}
    // alle (groupId) -> einzelne (idSet)
    let groupId = Object.keys(group)[0];
    if (!group[groupId].size>0)   return selected;  // keine Elemente in der Gruppe
    if (selected.has(groupId)) {  // groupId gecheckt
      selected = new Set(
        [...selected, ...group[groupId]]
      );
    } else {                    // groupId ungecheckt
      group[groupId].forEach(id => selected.delete(id));
    }
    return selected;
  }

  toggleCheckboxGroups = (groups={}, selected=this.state.selected) => {  // alle (groupId) -> einzelne (idSet);  groups = {"id1":Set1, "id2":Set2, ...}
    // alle (groupId) -> einzelne (idSet)
    for (let groupId in groups) {
      if (!groups.hasOwnProperty(groupId)) continue;
      selected = this.toggleCheckboxGroup({[groupId]: groups[groupId]}, selected);
      // console.log("groupId",groupId);
      // console.log("3",{selected});
    }
    return selected;
  }

  toggleCheckboxGroupElements = (id, groups={}, selected=this.state.selected) => { // einzelne (idSet) -> alle (groupId)
    for (let groupId in groups) {
      if (!groups.hasOwnProperty(groupId)) continue;
      if (groups[groupId].has(id)) { // groups[groupId] = idSet der group
        const checked = [...groups[groupId]].filter(id => selected.has(id)); // gecheckte aus der Gruppe
        if (checked.length===groups[groupId].size) {  // gesamte Gruppe gecheckt
          selected.add(groupId);
        }
        else if (checked.length===0) {  // Gruppe komplett ungecheckt
          selected.delete(groupId);
        } else {                        // einzelne der Gruppe gecheckt
          selected.delete(groupId);
        }
      }
    }
    return selected;
  }

  render() {
    if (!this.state.stateloaded)  return null;
    // Variablen aus state und props
    const { 
      data, 
      filter, 
      filterfkt, 
      folded, 
      foldcol, 
      foldcols, 
      pivot,
      selected, 
      wortinfo, 
      zeilenumbruch 
    } = this.state;
    const {
      defaultSorted,
      ersteZeile = true, 
      // foldcols = new Set([])  // Header-Namen, wenn gefaltet
      // folded = {col_0: false, col_1: false, col_2: true} // für Header-Columns, sh. cDM
      handleChange = ()=>{console.log("handleChange")}, 
      handleClick = ()=>{console.log("handleClick")}, 
      satze, // = this.props.userdata.satze, 
      strongs = [],
      userdata,
      zid = null,
    } = this.props;
    const {satztypen} = userdata.user;
    const {wortstat} = userdata;
    const fontS = Math.min(1, String(0.08*Math.pow(this.state.width, 0.4))) + "rem";
    // console.log({fontS});
    // console.log({selected});
    const editMinWidth = 2;
    const editStyle = {flexGrow: 0.4, padding: 0, textAlign: "center"};
    const textStyle = zeilenumbruch? ({textAlign: "left", whiteSpace: "normal"}):
      ({textAlign: "left", overflow:"scroll"});
    const cellProps = (state, rowInfo) => ({ style: editStyle });
    const createCheck = createCheckbox(this.toggleCheckbox);
    const userArg = !wortinfo? wortinfo: userdata.user;
    const createwort = createWort(handleClick, zid, userArg, wortstat, filterfkt, strongs);
    // ----------------------- Edit -----------------------------------------------------------------
    const editCols = [
      {
        Header: createCheck("allesatze"),
        accessor: "check",
        Cell: ({index}) => (
          createCheck(String(index))
        ),
        filterMethod: (filter, row) => {
          const rowchecked = this.state.selected.has(String(row[filter.id]));
          const boolfilt = filter.value.replace(/\s{2}/g, "")!=="" && filter.value!=="0" && filter.value!=="-" && filter.value!=="false" && filter.value!=="off" && filter.value!=="aus";
          const filt = (rowchecked===boolfilt); // Boolean-Vergleich
          return filt;
        },
        sortable: false,
        style: editStyle,
        minWidth: 3,
      },
      {
        Header: ({column, data}) => (
          <ZeichenButton 
            clickHandler={() => this.handleEdit([...selected].filter(id => id>=0 && data[Number(id)]).map(id => 
              data[Number(id)]._original))}
            zeichen={"!"}
          />),
        accessor: "edit",
        Cell: ({index, row, value}) => ( //  console.log(index, value, row) ||
          <ZeichenButton 
            clickHandler={() => this.handleEdit([row._original])}
            style={{color:"black"}}
            zeichen={"!"}
          />
        ),
        sortable: false,
        filterable: false,
        style: editStyle,
        minWidth: editMinWidth,
      },
      {
        Header: ({column, data}) => ( // console.log({data}) ||
          <DeleteButton
            button={false}
            ids={[...selected].filter(id => id>=0 && data[Number(id)]).map(id => 
              data[Number(id)]._original._id)}
            userdata={userdata}
          />
        ),
        accessor: "delete",
        Cell: ({index, row, value}) => ( // console.log(value, row) ||
          <DeleteButton
            button={false}
            ids={[row._original._id]}
            userdata={userdata}
          />
        ),
        sortable: false,
        filterable: false,
        style: editStyle,
        minWidth: editMinWidth,
        // getProps: (state, rowInfo, column, instance) => {
        //   return ({
        //     style: {}
        //   })
        // }
      },
      {
        id: "Nr.",
        Header: "Nr.",
        accessor: (d) => (!ersteZeile? d.check+1: d.check),
        Cell: ({value, ...attrs}) => ( // console.log({attrs}) || 
          <div
            style={{color:"darkgrey"}}
          >
            {value}
          </div>
        ),
        style: editStyle,
        minWidth: editMinWidth,
      },
    ];
    // ----------------------- Komplettsatz ---------------------------------------------------------
    const satzCols = [
      {
        Header: "Überschrift",
        accessor: "wort",
        Cell: ({value, row, index}) => ( // console.log(value, row.typ) ||
          <div>{createwort(value, row.typ, null)}</div>
        ),
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["wort"] }),
        filterAll: true,
        style: textStyle,
        minWidth: 10,
      },
      {
        Header: "Satz",
        accessor: "worte",
        Cell: ({value, row, index}) => (<div
        >
          {value.split(" ").map((wort, ix) => (createwort(wort, row.typ, ix)))}
        </div>),
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["worte"] }),
        filterAll: true,
        style: textStyle,
        minWidth: 50,
      },
      {
        Header: "Satztyp",
        accessor: "typ",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["typ"] }),
        filterAll: true,
        Cell: ({value, row, index}) => ( // console.log({value, row, index}) ||
          (ersteZeile===false || !(satze[index].wort&&satze[index].wort.satz&&satze[index].wort.satz.length>1)) ? (
            <div>{createwort(value, row.typ, null)}</div>
          ) : (
            <select
              name="satztyp"
              onChange={handleChange}
              style={!ersteZeile? {color: satztypen[value]}: {color: satztypen[value], ...basisSatzStyle}}
              value={value}
            >
              {[value, ...untersatzTypen.wortsatzTypen(satze[index])].map((typ, ix) => (
                <option key={ix} value={typ} style={{ color: satztypen[typ.wort] }}>{typ}</option>
              ))}
            </select>
          )
        ),
        style: textStyle,
        minWidth: 10,
      },
    ];
    // ----------------------- Zusatzinfos ----------------------------------------------------------
    const infoCols = [
      {
        Header: "Wortebedingung",
        accessor: "worteIf",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["worteIf"] }),
        filterAll: true,
        style: {...editStyle, ...textStyle},
        minWidth: editMinWidth,
        // getProps: (state, rowInfo, column) => ({style: {overflow:"scroll"} }),
      },
      {
        Header: "Benutzer",
        accessor: "username",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["username"] }),
        filterAll: true,
        minWidth: 10,
      },
      {
        Header: "Geändert am",
        accessor: "updatedDate",
        Cell: ({value, row, index}) => ( // console.log(value, row.typ) ||
          <div>{value}</div>
        ),
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["updatedDate"] }),
        filterAll: true,
        sortMethod: sortDate,
        minWidth: 10,
      },
      {
        Header: "Erstellt am",
        accessor: "createdDate",
        Cell: ({value, row, index}) => ( // console.log(value, row.typ) ||
          <div>{value}</div>
        ),
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["createdDate"] }),
        filterAll: true,
        // sortMethod: sortDate,
        sortMethod:  (a, b, desc) => {
          let au = unformatDate(a);
          let bu = unformatDate(b);
          return ReactTable.defaultProps.defaultSortMethod(au, bu, desc);
        },
        minWidth: 10,
      },
    ];
    // ggf. Gruppen hinzufügen
    if (isObject(satze[0].groups)) {
      // console.log("g", satze[0].groups);
      subKeySet(satze, "groups").forEach(group => {
        satzCols.unshift(
          {
            Header: group,
            id: String(group),
            accessor: d => d.groups[group],
            // accessor: groups[group],
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["wort"] }),
            filterAll: true,
            style: textStyle,
            minWidth: 5,
          },
        );
      });
    }
    const allCols = [...editCols, ...satzCols, ...infoCols].map(col => (typeof col.accessor!=="function")? col.accessor: col.id).filter(id => typeof id==="string");
    // console.log(window.innerWidth, " w : h ", window.innerHeight);
    return (
      <div>
        <FoldableTable
          defaultPageSize={Math.min(satze.length, 20)}
          className="-striped -highlight"
          data={data}
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          defaultSorted={defaultSorted || [
            {id:"typ", desc:false},
            {id:"wort", desc:false},
            {id:"updatedDate", desc:true}
          ]}
          filterable={true}
          folded={this.state.folded}
          onFoldChange={newFolded => this.setState(p => { return { folded: newFolded } })}
          pivotBy={pivot}
          resolveData={
            data => data.map((row, ix) => ({
            ...row, 
            check: ix,
          }))}
          style={{fontSize: fontS, margin: "auto", padding: 0}}
          // getTableProps, getProps ={(state, rowInfo) => ({
          getTdProps={cellProps}
          getTheadThProps={cellProps}
          getTheadFilterThProps={cellProps}
          getTheadFilterTdProps={(state, rowInfo) => ({ style: {padding: 0} })}
          getTheadGroupThProps={(state, rowInfo) => ({ style: {padding: 0} })}
          getTrProps={(state, rowInfo) => {
            if (!rowInfo) return {};
            let style = {
              color: !satztypen[rowInfo.row.typ]? "grey": satztypen[rowInfo.row.typ],
            };
            if (rowInfo.index===0 && ersteZeile) {
              style={
                ...style,
                backgroundColor:"#f8f8f8",
                fontWeight:600,
              }
            }
            return {style};
          }}
          columns={[
            {
              Header: "Bearbeiten",
              // width: "5rem",
              foldable: true,
              columns: editCols.filter(col => !foldcols.has(String(col.accessor)) && !foldcols.has(String(col.id))),
            },
            {
              Header: "Komplettsatz",
              foldable: true,
              columns: satzCols.filter(col => !foldcols.has(String(col.accessor)) && !foldcols.has(String(col.id))),
            },
            {
              Header: "Zusatzinfos",
              foldable: true,
              columns: infoCols.filter(col => !foldcols.has(String(col.accessor)) && !foldcols.has(String(col.id))),
            },
          ]}
        />
        {/* Untere Steuerzeile */}
        <Fold 
          summary="Anzeigesteuerung"
          closed={false}
          style={{ alignItems:"top", display:"flex", fontSize: fontS, justifyContent: "space-between" }}
        >
          <Grid 
            columns={"1fr 1fr"}
            rows={4}
            gap="1px"
            style={{border: "2px solid grey", margin: "2px"}}
            areas={[
              "wi sc",
              "f1 f2",
              "f3 f4",
              "pil pi",
              "pib pi",
              "e e",
            ]}
          >
            <Cell area="wi">
              <div>
                <input  className="checkbox"
                  checked={wortinfo} 
                  id={"wortinfo"}
                  onChange={() => this.setState(({wortinfo}) => ({wortinfo: !wortinfo}))}
                  type="checkbox"
                  value={wortinfo}
                />
                <label htmlFor={"wortinfo"}> Wortinfo</label>
              </div>
            </Cell>
            <Cell area="sc">
              <button
                onClick={p=>this.setState(({zeilenumbruch})=>({zeilenumbruch: !zeilenumbruch}))}
              >
                {zeilenumbruch? "Scrollen": "Zeilenumbruch"}
              </button>
            </Cell>
            {/* Buttons */}
            <Cell area="f1">
              <select
                name="foldcol"
                onChange={(e) => this.setState({foldcol: e.target.value})}
                style={{fontSize:"inherit", textAlignLast:"right"}}
                value={foldcol}
              >
                {["Alle Spalten", ...allCols].map((col, ix) => (
                  <option key={ix} value={col} >{col}</option>
                ))}
              </select>
            </Cell>
            <Cell area="f2">
              <button
                onClick={p=>this.setState( ({foldcols}) => {
                  if (foldcol==="Alle Spalten") {
                    return {
                      foldcols: new Set([]), 
                      folded: {col_0: false, col_1: false, col_2: false}
                    }
                  }
                  if (foldcols.has(foldcol)) {
                    foldcols.delete(foldcol);
                  } else {
                    foldcols.add(foldcol);
                  }
                  return {foldcols};
                })}
              >
                {(foldcols.has(foldcol) || foldcol==="Alle Spalten")? "einblenden" : "ausblenden"}
              </button>
            </Cell>
            <Cell area="f3">
              <button
                onClick={p=>this.setState(({folded}) => {
                  let newFolded = {};
                  if (!Object.values(folded).includes(true)) {  // komplett aufgefaltet
                    for (let col in folded) {
                      newFolded[col] = true;
                    }
                    return {folded: newFolded}
                  }
                  for (let col in folded) {
                    newFolded[col] = false;
                  }
                  return {folded: newFolded}
                })}
              >
                {Object.values(folded).includes(true)? "Tabelle auffalten": "Tabelle falten"}
              </button>
            </Cell>
            <Cell area="f4">
              <button
                onClick={p=>this.setState(({folded}) => {
                  let newFolded = {};
                  for (let col in folded) {
                    newFolded[col] = !folded[col];
                  }
                  return {folded: newFolded}
                })}
              >
                Faltung umkehren
              </button>
            </Cell>
            {/* Pivot */}
            <Cell area="pil">
              <label htmlFor="pivot"><strong>Pivot:</strong></label>
            </Cell>
            <Cell area="pib">
              <button
                onClick={p=>this.setState(()=>({pivot: []}))}
              >
                Pivot löschen
              </button>
            </Cell>
            <Cell area="pi">
              <select 
                name="pivot" 
                size="3" 
                onChange={(e) => {
                  e.persist();
                  this.setState(({pivot}) => {
                    const pivset = new Set(pivot);
                    const val = e.target.value;
                    if (val==="") return [];  // Auswahl löschen
                    if (pivset.has(val))  pivset.delete(val)
                    else  pivset.add(val);
                    // console.log({pivset})
                    return {pivot: [...pivset]};
                  })
                }}
                multiple={true}
                value={pivot}
              >
                {
                  [...satzCols, ...infoCols].map((c, ix) => {
                    let id = typeof c.accessor==="string"? c.accessor: c.id;
                    return <option key={ix} value={id} >{id}</option>
                  })
                }
              </select>
            </Cell>
            <Cell area="e">
              <em>Tipp: Umschalttaste halten für Multi-sort!</em>
            </Cell>
          </Grid>
          <WortFilter 
            handleFilterChange={this.handleFilterChange}
            wortFilter={filter}
          />
        </Fold>
      </div>
    );
  }
}

export default SatzTable;
