// aus: https://github.com/styled-components/styled-components

import React from 'react';
import { Link } from "react-router-dom";

import styled from 'styled-components';

const Wortlink = styled.a`
  text-decoration: none;
  font-size: 1rem;
  text-align: left;
  color: blue;
`;

const Wrapper = styled.div`
  &:hover ${Wortlink} {
    background: blue;
    color: grey;
  }
`;

// const Button = styled.button`
//   ${Wrapper}:hover & {
//     color: green;
//   }
// `;

const SatzKurzEintrag = ({ _id, typ, wort, worte, satztypen }) => (
  <tr style={{ color: `${satztypen[typ.wort]}` }}>
    <td>
      <Wrapper>
      <Wortlink to={`/satze/${_id}`}>
      {(!!wort && !!wort.wort) ? wort.wort : ""}
      </Wortlink>
      </Wrapper>
    </td>
    <td>{worte.map(wort => wort.wort).join(" ")}</td>
  </tr>
);

export default SatzKurzEintrag;
