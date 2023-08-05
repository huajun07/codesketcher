import axios from 'axios'
import IdTokenVerifier from 'idtoken-verifier'

/**
 * Validate JWT token according to google open id configuration.  
 * @param token JWT Token 
 * @returns Decoded token as JSON object
 * @throws Invalid JWT token
 */
export const decodeJWT = async (token: string) => {
  // Ref: https://developers.google.com/identity/openid-connect/openid-connect#validatinganidtoken
  const openIDConfig = (
    await axios.get(
      'https://accounts.google.com/.well-known/openid-configuration',
    )
  ).data
  const jwksURI = openIDConfig?.jwks_uri

  const verifier = new IdTokenVerifier({
    issuer: 'https://accounts.google.com',
    audience: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    jwksURI,
  })
  const decoded = await new Promise((resolve, reject) => {
    verifier.verify(token, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })
  if (!decoded) throw Error('Invalid JWT')
  return decoded
}
