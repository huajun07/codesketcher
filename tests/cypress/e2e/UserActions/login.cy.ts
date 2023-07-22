/// <reference types="cypress" />

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Signed In', () => {
    cy.contains('Sign in with Google')
    cy.contains('Login to save / load').should('be.disabled')
    cy.contains('Load your codes').should('not.exist')
    cy.login()
    cy.contains('Sign in with Google').should('not.exist')
    cy.contains('Login to save/load').should('not.exist')
    cy.contains('Load your codes')
  })

  it('Logout', () => {
    cy.login()
    cy.get('.chakra-avatar').parents('button').click()
    cy.contains('Logout').click()
    cy.contains('Sign in with Google')
    cy.contains('Load your codes').should('not.exist')
    cy.contains('Login to save / load').should('be.disabled')
  })

})
