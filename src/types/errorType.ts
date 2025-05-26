import { ErrorSource } from './serverAction.types'

export class ErrorMessage extends Error {
  code: ErrorSource
  httpStatus: number
  details: unknown
  constructor(message: string, code: ErrorSource, httpStatus: number, details: unknown) {
    super(message)
    this.name = 'ErrorMessage'
    this.code = code
    this.httpStatus = httpStatus
    this.details = details
  }
}
