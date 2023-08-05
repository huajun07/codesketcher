/// <reference types="cypress" />

// import { inputCode } from "../../support/constants"

describe('Error Checks', () => {
  beforeEach(() => {
    cy.visit('/')
  })


  it('No Code', () => {
    cy.contains('Run').click()
    cy.contains('An Error Has Occured')
  })

  // Unable to test as local lambda crashes - to investigate
  // it('No input', () => {
  //   cy.typeIDE(inputCode, 0)
  //   cy.contains('Run').click()
  //   cy.contains('An Error Has Occured')
  //   cy.get('button[aria-label="Play/Pause"]').should('be.disabled')
  // })
})
