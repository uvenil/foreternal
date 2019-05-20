import React from "react";


const SatzVorschau  = ({saetze, ueberschrift}) => (
	((!saetze || saetze.length===0) && ueberschrift==="") ? null : (
  // <div className="App table-wrapper">
		<table>
			<thead>
				<tr>
					<th>
						Überschrift
					</th>
					<th>
						{ !ueberschrift ? null : ueberschrift }
					</th>
				</tr>
			</thead>
			<tbody>
				{
					(!saetze || saetze.length===0) ? null : (
						saetze.map((satz, ix) => (
							<tr key={ix}>
								<td>Satz {ix + 1}</td>
								<td>{satz}</td>
							</tr>
					)))
				}
			</tbody>
		</table>
	)
);

export default SatzVorschau; // compnames.findIndex(cn)
