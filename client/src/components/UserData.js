import React, {Suspense} from "react";
import UserDat from "./UserDat";
import wortStat from "./SatzTable/wortStat";

const UserData = ({userdata, ...props}) => (  // hooks (wortStat) nur über functional components
  // <Suspense fallback={<span>Suspense loading...</span>}>
    <UserDat {...props}
      userdata={{
        ...userdata, 
        wortstat: (userdata.satze && userdata.satze.length>0)? wortStat(userdata.user) || {}: {}
      }}
      // wortstat={wortStat(props.userdata.user) || {}}
    />
  // </Suspense>
);

export default UserData;
