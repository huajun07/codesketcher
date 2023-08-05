/// <reference types="cypress" />

describe('Share', () => {
  beforeEach(() => {
    cy.clearDB()
    cy.login()
  })

  it('Test Run', () => {
    cy.typeIDE('Testing Code', 0)
    cy.typeIDE('Testing Input', 1)
    // Click Save Button
    cy.get('button[aria-label="save code"]').click()
    // Enter file name
    cy.get('.chakra-modal__body input').type('test.py')
    cy.contains('Confirm').click()
    cy.get('button[aria-label="File Settings"]').click()
    cy.contains('Share').click()

    cy.contains('Create Link').click()
    cy.contains('Share Link Generated')

    let shareLink = ''
    // Retrieve share link
    cy.get('[aria-label="share link"]')
      .invoke('val')
      .then((value) => {
        if (typeof value === 'string') {
          console.log(value)
          shareLink = value.slice(Cypress.env('frontend').length)
        }
        // Logout and visit site with share link
        cy.visit('/')
        cy.get('.chakra-avatar').parents('button').click()
        cy.contains('Logout').click()
        cy.wait(500)
        cy.visit(shareLink)
      })

    // Check that code is successfully loaded while logged out
    cy.get('.cm-content').eq(0).contains('Testing Code')
    cy.get('.cm-content').eq(1).contains('Testing Input')

    // Regenerate code
    cy.login()
    cy.visit('/')
    cy.contains('Load your codes').click()
    cy.contains('test.py').click()

    cy.get('button[aria-label="File Settings"]').click()
    cy.contains('Share').click()

    cy.contains('Create New Link').click()
    cy.contains('Share Link Generated')

    shareLink = ''
    cy.get('[aria-label="share link"]')
      .invoke('val')
      .then((value) => {
        if (typeof value === 'string')
          shareLink = value.slice(Cypress.env('frontend').length)
        // Logout and visit site with share link
        cy.visit('/')
        cy.get('.chakra-avatar').parents('button').click()
        cy.contains('Logout').click()
        cy.wait(500)
        cy.visit(shareLink)
      })

    // Check that code is successfully loaded while logged out
    cy.get('.cm-content').eq(0).contains('Testing Code')
    cy.get('.cm-content').eq(1).contains('Testing Input')
  })
})
