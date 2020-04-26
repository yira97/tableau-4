export type SignInData = {
  username: string
  password: string
  server: string
  site: string
}

export type UserCredential = {
  siteID: string
  userID: string
  token: string
}

export type UserState = {
  signInData?: SignInData
  userCredential?: UserCredential
  loggedIn: boolean
}

export type RootState = {
  userState: UserState
}

export type ProjectInfo = {
  projectName: string
  projectID: string
}