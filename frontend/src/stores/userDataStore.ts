import { create } from 'zustand'

import {
  createCode,
  deleteCode,
  genId,
  getCodes,
  updateCode,
  updateName,
} from 'utils/files'
import { decodeJWT } from 'utils/tokenValidation'

export const $LOCAL_GOOGLE_JWT = 'codesketcher_jwt'

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
  files: [{ input: '', code: '', shareId: null }] as File[],
  codenames: ['Load your codes'],
  curFile: { input: '', code: '' },
  codename: '',
  code: '',
  input: '',
  shareId: null,
  curIdx: 0,
  loading: false,
}

const getValues = async (token: string) => {
  try {
    const { name, picture, sub } = (await decodeJWT(token)) as idToken
    return { name, picture, sub, loggedIn: true, curIdx: 0 }
  } catch (err) {
    return null
  }
}

interface File {
  code: string
  input: string
  shareId: string | null
}

interface UserState extends idToken {
  loggedIn: boolean // Boolean to check if exist user account logged in
  loading: boolean // Toggle to allow latency in retrieving user data
  setCredentials: (creds: string) => Promise<void>
  unSetCredentials: () => void
  files: File[] // All stored files of the user
  curFile: { code: string; input: string } // Original code/input of currently selected file
  codenames: string[] // Names of all stored files of the user
  code: string // Current code in CodeIDE
  input: string // Current input in InputIDE
  shareId: string | null // Current shareId
  curIdx: number // Current index of selected file
  codename: string // Current name of selected file
  setIdx: (idx: number) => void
  rename: (name: string) => Promise<void>
  update: () => Promise<void>
  reload: () => void
  create: (name: string, useCur?: boolean) => Promise<void>
  drop: () => Promise<void>
  load: () => Promise<void>
  genId: () => Promise<void>
  setCode: (code: string) => void
  setInput: (input: string) => void
}

/**
 * Factory function for user data store
 * with option to seed inital values (For automated tests)
 * @param initalValues Initial Values (optional)
 * @returns
 */
export const createUserStore = (initalValues: Partial<UserState>) => {
  return create<UserState>((set, get) => ({
    ...defaultValues,
    /**
     * Set credential given JWT token and load relevant values
     * @param creds New JWT token
     * @throws Invalid JWT token
     */
    setCredentials: async (creds: string) => {
      const newState = await getValues(creds)
      if (newState) {
        // Store the token in local storage to allow persistent login
        localStorage.setItem($LOCAL_GOOGLE_JWT, creds)
        set({ ...newState, loading: true })
        try {
          await get().load()
        } catch (err) {
          console.log(err)
        }
        set({ loading: false })
      } else throw Error('Invalid Token')
    },
    /**
     * Logout and reset values
     */
    unSetCredentials: () => {
      localStorage.removeItem($LOCAL_GOOGLE_JWT)
      set(defaultValues)
    },
    /**
     * Change selected file and load its code/input
     * @param idx New selected file index
     */
    setIdx: (idx: number) => {
      if (idx < 0 || idx >= get().files.length) throw Error('Invalid Action')
      const { code, input, shareId } = get().files[idx]
      set({
        curIdx: idx,
        code,
        input,
        shareId,
        curFile: { code, input },
        codename: get().codenames[idx],
      })
    },
    rename: async (name: string) => {
      await updateName(get().codename, name)
      const codenames = get().codenames
      codenames[get().curIdx] = name
      set({ codename: name, codenames })
    },
    /**
     * Reload original code/input of selected code into CodeIDE and InputIDE respectively
     */
    reload: () => {
      const { code, input } = get().curFile
      set({ code, input })
      return
    },
    create: async (name: string, useCur = false) => {
      let code = '',
        input = ''
      if (useCur) {
        code = get().code
        input = get().input
      }
      await createCode(name, code, input)
      const { files, codenames } = get()
      codenames.push(name)
      files.push({ code, input, shareId: null })
      set({ codenames, files })
      get().setIdx(files.length - 1)
      return
    },
    drop: async () => {
      const codename = get().codenames[get().curIdx]
      await deleteCode(codename)
      const { curIdx } = get()
      const { codenames, files } = get()
      codenames.splice(curIdx, 1)
      files.splice(curIdx, 1)
      set({ codenames, files })
      get().setIdx(0)
      return
    },
    update: async () => {
      const { code, input, codename } = get()
      await updateCode(codename, code, input)
      const { files, curIdx } = get()
      files[curIdx] = { ...files[curIdx], code, input }
      set({ files, curFile: { code, input } })
      return
    },
    /**
     * Retrive all stored codes of the user and load them into relevant variables in data store
     */
    load: async () => {
      const data = await getCodes()
      const codenames = get()
        .codenames.slice(0, 1)
        .concat(data.map((val) => val.codename))
      const files = get()
        .files.slice(0, 1)
        .concat(
          data.map((val) => ({
            code: val.code,
            input: val.input || '',
            shareId: val.shareId,
          })),
        )
      set({ files, codenames })
      get().setIdx(-1)
      return
    },
    genId: async () => {
      const newId = await genId(get().codename)
      const files = get().files
      files[get().curIdx].shareId = newId
      set({ shareId: newId, files })
    },
    /**
     * Modifier function for CodeIDE
     * @param code New code
     */
    setCode: (code: string) => {
      set({ code })
    },
    /**
     * Modifier function for InputIDE
     * @param code New input
     */
    setInput: (input: string) => {
      set({ input })
    },
    ...initalValues,
  }))
}

export const useUserDataStore = createUserStore({})

// This runs on start up of webpage to auto login the user if the token has not expired
getValues(localStorage.getItem($LOCAL_GOOGLE_JWT) || '').then(async (state) => {
  // Using the user id retrieved from the JWT token, retrieve stored codes and update the variables
  useUserDataStore.setState({ ...state })
  if (state) {
    useUserDataStore.setState({ loading: true })
    try {
      const data = await getCodes()
      const codenames = defaultValues.codenames.concat(
        data.map((val) => val.codename),
      )
      const files = defaultValues.files.concat(
        data.map((val) => ({
          code: val.code,
          input: val.input || '',
          shareId: val.shareId,
        })),
      )
      useUserDataStore.setState({ codenames, files })
    } catch (err) {
      console.log(err)
    }
    useUserDataStore.setState({ loading: false })
  }
})
