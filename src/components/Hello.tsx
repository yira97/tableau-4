import React, { useContext } from "react";

import { RootContext } from '../context'

export const Hello = () => {
  const [rootState, setrootState] = useContext(RootContext)

  return (
    <>
      main page {rootState.userState.loggedIn ? "yes" : "false"}
    </>
  )
}

export default Hello