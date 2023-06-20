import { create } from 'zustand'

import { decodeJWT } from 'utils/tokenValidation'

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
  loggedIn: false,
}
const getValues = async (token: string) => {
  try {
    const { name, picture, sub } = await decodeJWT(token) as idToken
    return { name, picture, sub, loggedIn: true }
  } catch (err) {
    return null
  }
}

interface UserState extends idToken {
  loggedIn: boolean
  setCredentials: (creds: string) => Promise<void>
  unSetCredentials: () => void
}

export const useUserDataStore = create<UserState>((set) => ({
  ...defaultValues,
  setCredentials: async (creds: string) => {
    const newState = await getValues(creds)
    if(newState){
      localStorage.setItem($LOCAL_GOOGLE_JWT, creds)
      set({...newState})
    }
  },
  unSetCredentials: () => {
    localStorage.removeItem($LOCAL_GOOGLE_JWT)
    set({ ...defaultValues })
  },
}))

getValues( localStorage.getItem($LOCAL_GOOGLE_JWT) || '').then((state)=>useUserDataStore.setState({...state}))