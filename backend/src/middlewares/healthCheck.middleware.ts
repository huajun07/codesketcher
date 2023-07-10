import { Request, Response, NextFunction } from 'express'
// Function to respond to health checks
const healthCheckmiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | NextFunction | void => {
  // Health check routes
  if (request.url === '/ping' || request.url === '/health' || request.url === '/') {
    return response.status(200).json({ message: 'pong' })
  } else {
    // Not a health check route, carry on to other handlers
    return next()
  }
}

export default healthCheckmiddleware
