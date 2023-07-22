/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    getToken(): Promise<string>
    login(): Chainable<any>
    typeIDE(str: string, ide: number): Chainable<any>
    deleteIDE(numChars: number, ide: number): Chainable<any>
    clearDB(): Chainable<any>
  }
}
