/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Retrieve JWT token of test google account via refresh token from Oauth playground
     */
    getToken(): Promise<string>
    /**
     * Retrieve JWT token of test google account and add token to localstorage
     */
    login(): Chainable<any>
    /**
     * Type into the IDE on the webpage
     * @param str Text to type
     * @param ide 0 - CodeIDE, 1 - InputIDE
     */
    typeIDE(str: string, ide: number): Chainable<any>
    /**
     * Delete characters from the IDE
     * @param numChars Number of characters to delete
     * @param ide 0 - CodeIDE, 1 - InputIDE
     */
    deleteIDE(numChars: number, ide: number): Chainable<any>
    /**
     * Delete all stored code of the test account in the databse
     */
    clearDB(): Chainable<any>
    /**
     * Retrieves the step number input element
     * @returns Reference to the step number input
     */
    stepInput(): Chainable<any>
    /**
     * Checks the values in the data table against the given data
     * @param data Data to check again
     */
    checkTable(data: string[][]): Chainable<any>
  }
}
