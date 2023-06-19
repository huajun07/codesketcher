import jwt_decode from 'jwt-decode'
import { create } from 'zustand'

const $LOCAL_GOOGLE_JWT = 'codesketcher_jwt'

interface idToken {
  name: string
  picture: string
  sub: string
}

const defaultValues = {
  name: 'Guest',
  picture: '',
  sub: '',
  loggedIn: false
}
const getInitialValues = () => {
  const creds = localStorage.getItem($LOCAL_GOOGLE_JWT) || ''
  try {
    // TODO: Add jwt token validation: following https://developers.google.com/identity/openid-connect/openid-connect#validatinganidtoken
    const { name, picture, sub } = jwt_decode(creds) as idToken
    return { name, picture, sub , credentials: creds, loggedIn: true }
  } catch (err) {
    return {...defaultValues, credentials: '' }
  }
}

interface UserState extends idToken {
  credentials: string
  loggedIn : boolean
  setCredentials: (creds: string) => void
  unSetCredentials: () => void
}

export const useUserDataStore = create<UserState>((set) => ({
  ...getInitialValues(),
  setCredentials: (creds: string) => {
    // TODO: Add jwt token validation: following https://developers.google.com/identity/openid-connect/openid-connect#validatinganidtoken
    localStorage.setItem($LOCAL_GOOGLE_JWT, creds)
    const { name, picture, sub } = jwt_decode(creds) as idToken
    set({ credentials: creds, name, picture, sub, loggedIn: true })
  },
  unSetCredentials: () => {
    localStorage.removeItem($LOCAL_GOOGLE_JWT)
    set({...defaultValues})
  },
}))