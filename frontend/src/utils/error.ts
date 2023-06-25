export function getErrorMessage(error: unknown) {
    console.log(error)
    if (error instanceof Error) return error.message
    return String(error)
  }