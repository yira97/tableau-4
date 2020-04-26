
import React, { useState } from 'react';
import { RootState } from "./interfaces"

const initRootState: RootState = {
  userState: {
    loggedIn: false,
  }
}

export const RootContext = React.createContext<[RootState, React.Dispatch<React.SetStateAction<RootState>>]>([initRootState, () => { }]);

export const RootProvider: React.FC = (props) => {
  const [rootState, setrootState] = useState(initRootState)

  return (
    <RootContext.Provider value={[rootState, setrootState]} >
      {props.children}
    </RootContext.Provider>
  );
}