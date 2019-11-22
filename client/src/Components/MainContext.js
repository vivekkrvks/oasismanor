import React, { useState, createContext } from "react";

export const MainContext = createContext();

export const MainProvider = props => {
  const [userInfo] = useState({
    name: "Raghav",
    designation: "Admin",
    id: "dsdsds",
    email: "raghav.kr.roshan@gmail.com",
    img: ""
  });
  return <MainContext.Provider value={userInfo}>{props.children}</MainContext.Provider>;
};
