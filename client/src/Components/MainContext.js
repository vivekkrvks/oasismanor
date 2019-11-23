import React, { useState, createContext } from "react";

export const MainContext = createContext();

export const MainProvider = props => {
  const [userInfo, setUserInfo] = useState({});
  return <MainContext.Provider value={{ userInfo, setUserInfo }}>{props.children}</MainContext.Provider>;
};
