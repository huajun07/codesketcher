import axios, { AxiosResponse } from 'axios'
import { $LOCAL_GOOGLE_JWT } from 'stores'

/**
 * Retrieves JWT token from local storage
 * @returns headers configured with JWT token
 */
const getAuthHeader = () => {
  const creds = localStorage.getItem($LOCAL_GOOGLE_JWT)
  return {
    headers: { Authorization: `Bearer ${creds}` },
    validateStatus: () => true, // Allow axios to not throw 
  }
}

/**
 * Validates response status and throw error with relevant error message or generic error message
 * @throws Error in response
 */
const validateStatus = (res: AxiosResponse) => {
  if (res.status >= 400) throw new Error(res.data?.message || 'Network Error')
}

const url = process.env.REACT_APP_EXECUTOR_ENDPOINT + '/user/codes'

const updateName = async (codename: string, newName: string) => {
  const res = await axios.put(
    `${url}/${codename}/rename`,
    { codename: newName },
    getAuthHeader(),
  )
  validateStatus(res)
}

const createCode = async (
  codename: string,
  code: string,
  input: string | undefined,
) => {
  const res = await axios.post(
    `${url}/${codename}`,
    { code, input },
    getAuthHeader(),
  )
  validateStatus(res)
}

const deleteCode = async (codename: string) => {
  const res = await axios.delete(`${url}/${codename}`, getAuthHeader())
  validateStatus(res)
}

const updateCode = async (
  codename: string,
  code: string,
  input: string | undefined,
) => {
  const res = await axios.put(
    `${url}/${codename}`,
    { code, input },
    getAuthHeader(),
  )
  validateStatus(res)
}

interface Code {
  codename: string
  code: string
  input: string | null
  shareId: string | null
}

const getCodes = async () => {
  const res = await axios.get(url, getAuthHeader())
  validateStatus(res)
  return res.data as Code[]
}

const genId = async (codename: string) => {
  const res = await axios.post(`${url}/${codename}/share`, {}, getAuthHeader())
  validateStatus(res)
  return res.data.shareId as string
}

interface CodeValues {
  code: string
  input: string | null
}

const getCodeValues = async (id: string) => {
  const res = await axios.get(
    process.env.REACT_APP_EXECUTOR_ENDPOINT + '/codes',
    { params: { id } },
  )
  validateStatus(res)
  return res.data as CodeValues
}

export {
  createCode,
  deleteCode,
  genId,
  getCodes,
  getCodeValues,
  updateCode,
  updateName,
}
