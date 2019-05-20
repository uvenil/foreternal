import React from "react";

import { Query } from "react-apollo";
import { GET_SATZTYPEN } from "../queries";

const satzTypenFarben = (satztypen) => {
  if (!satztypen || satztypen.length === 0) return { "Satz": '#000000' };  // Standard: schwarz
  const farbCodes = [
    '#000000',  // schwarz
    '#ff0000',  // rot
    '#00ff00',  // grün
    '#0000ff',  // blau   '#ffff00',  // gelb
    '#00ffff',  // türkis
    '#ff00ff',  // lila
    '#7f0000',  // dunkelrot
    '#ff7f00',  // orange
    '#7f007f',  // dunkellila
    '#00007f',  // ?  '#007f00',  // ?
    '#007f7f',  // ?
    '#7f7f00',  // ?
    '#7f7f7f'  // grau?
  ];
  const satztypenfarben = {};
  satztypen.forEach( (typ, ix) => {
    satztypenfarben[typ.wort] = farbCodes[ix % farbCodes.length];
    return;
  });
  // console.log("satztypenfarben", satztypenfarben);
  return satztypenfarben;
};

const Satztypenfarben = ( props ) => (
  <Query query={GET_SATZTYPEN}>
    {({ data, loading, refetch }) => {
      if (loading) return null;
      // console.log(data);
      const satztypen = data.__type.enumValues.map(val => val.name);
      const satztypenfarben = satzTypenFarben(satztypen);
      // return <Component {...props} refetch={refetch} satztypenfarben={satztypenfarben} />;
      // return this.props.render({ refetch, satztypenfarben, ...props});  // render-prop
      return props.children({ refetch, satztypenfarben, ...props });  // children-prop
    }}
  </Query>
);

export default Satztypenfarben;
