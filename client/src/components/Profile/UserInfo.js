import React from "react";
import { Link } from "react-router-dom";
import {formatDate} from "../../util/formatSatze"
import { Fold } from "./../CellFold";

const UserInfo = ({ user }) => {
  return (
    <div>
      <Fold summary="Benutzer Info">
        <h3>Benutzer Info</h3>
        <p>Benutzername: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Registrierdatum: {formatDate(user.joinDate)}</p>
        <p>Letzte Aktualisierung: {formatDate(user.updatedDate)}</p>
      </Fold>
      <Fold summary="Typen">
        <h3>Typen</h3>
        <ul>
          {user.typen.map((typ, ix) => (
            <li key={typ._id} style={{color: user.typfarben[ix]}}>
              {typ.wort}
            </li>
          ))}
          {!user.typen.length && (
            <p>
              <strong>Bisher noch keine Satztypen vorhanden</strong>
            </p>
          )}
        </ul>
      </Fold>
      <Fold summary="Favoriten">
        <h3>{user.username}'s Favoriten</h3>
        <ul>
          {user.favorites.map(favorite => (
            <li key={favorite._id}>
              <Link to={`/recipes/${favorite._id}`}>
                <p>{favorite.name}</p>
              </Link>
            </li>
          ))}
          {!user.favorites.length && (
            <p>
              <strong>Bisher noch keine Favoriten vorhanden</strong>
            </p>
          )}
        </ul>
      </Fold>
    </div>
  );
}

export default UserInfo;
