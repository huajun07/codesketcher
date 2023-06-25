import { create } from 'zustand'

import {
  createCode,
  deleteCode,
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
  files: [{ input: '', code: '' }],
  codenames: ['Load your codes'],
  curFile: { input: '', code: '' },
  codename: '',
  code: '',
  input: '',
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
}

interface UserState extends idToken {
  loggedIn: boolean
  loading: boolean
  setCredentials: (creds: string) => Promise<void>
  unSetCredentials: () => void
  files: File[]
  curFile: File
  codenames: string[]
  code: string
  input: string
  curIdx: number
  codename: string
  setIdx: (idx: number) => void
  rename: (name: string) => Promise<void>
  update: () => Promise<void>
  reload: () => void
  create: (name: string) => Promise<void>
  drop: () => Promise<void>
  load: () => Promise<void>
  setCode: (code: string) => void
  setInput: (input: string) => void
}

export const useUserDataStore = create<UserState>((set, get) => ({
  ...defaultValues,
  setCredentials: async (creds: string) => {
    const newState = await getValues(creds)
    if (newState) {
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
  unSetCredentials: () => {
    localStorage.removeItem($LOCAL_GOOGLE_JWT)
    set(defaultValues)
  },
  setIdx: (idx: number) => {
    if (idx < 0 || idx >= get().files.length) throw Error('Invalid Action')
    let update: { files: File[] } | null = null
    if (get().curIdx === 0) {
      // Update default code
      update = { files: get().files }
      update.files[0] = {
        code: get().code,
        input: get().input,
      }
    }
    const { code, input } = get().files[idx]
    set({
      curIdx: idx,
      code,
      input,
      curFile: { code, input },
      codename: get().codenames[idx],
      ...update,
    })
  },
  rename: async (name: string) => {
    await updateName(get().codename, name)
    const codenames = get().codenames
    codenames[get().curIdx] = name
    set({ codename: name, codenames })
  },
  reload: () => {
    const { code, input } = get().curFile
    set({ code, input })
    return
  },
  create: async (name: string) => {
    const { code, input } = get()
    await createCode(name, code, input)
    const { files, codenames } = get()
    codenames.push(name)
    files.push({ code, input })
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
    files[curIdx] = { code, input }
    set({ files, curFile: { code, input } })
    return
  },
  load: async () => {
    const data = await getCodes()
    const codenames = get()
      .codenames.slice(0, 1)
      .concat(data.map((val) => val.codename))
    const files = get()
      .files.slice(0, 1)
      .concat(data.map((val) => ({ code: val.code, input: val.input || '' })))
    set({ files, codenames })
    get().setIdx(-1)
    return
  },
  setCode: (code: string) => {
    set({ code })
  },
  setInput: (input: string) => {
    set({ input })
  }
}))

getValues(localStorage.getItem($LOCAL_GOOGLE_JWT) || '').then(async (state) => {
  useUserDataStore.setState({ ...state })
  if (state) {
    useUserDataStore.setState({ loading: true })
    try {
      const data = await getCodes()
      const codenames = defaultValues.codenames.concat(
        data.map((val) => val.codename),
      )
      const files = defaultValues.files.concat(
        data.map((val) => ({ code: val.code, input: val.input || '' })),
      )
      useUserDataStore.setState({ codenames, files })
    } catch (err) {
      console.log(err)
    }
    useUserDataStore.setState({ loading: false })
  }
})
