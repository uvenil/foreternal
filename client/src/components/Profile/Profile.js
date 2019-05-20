import React from "react";
import UserInfo from "./UserInfo";
import UserWorte from "./UserWorte";
import UserStopWorte from "./UserStopWorte";

const Profile = ({ userdata: {user} }) => (
  <div className="App">
    <UserStopWorte user={user}/>
    <UserInfo user={user} />
    <UserWorte user={user}/>
  </div>
);

export default Profile;
