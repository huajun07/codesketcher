/// <reference types="cypress" />

describe('Files', () => {
  beforeEach(() => {
    cy.clearDB()
    cy.login()
  })

  it('Modifying files', () => {
    cy.typeIDE('Testing Code', 0)
    cy.typeIDE('Testing Input', 1)
    // Click Save Button
    cy.contains('Unsaved Changes')
    cy.get('button[aria-label="save code"]').click()
    // Enter file name
    cy.get('.chakra-modal__body input').type('test.py')
    cy.contains('Confirm').click()
    cy.contains('Unsaved Changes').should('not.exist')
    cy.contains('test.py')
    cy.typeIDE('Testing Code 2', 0) // Test that unsaved changes are not saved

    // Check that code is saved
    cy.visit('/')
    cy.get('.cm-content').eq(0).contains('Testing Code').should('not.exist')
    cy.get('.cm-content').eq(1).contains('Testing Input').should('not.exist')
    cy.contains('Load your codes').click()
    cy.contains('test.py').click()
    cy.wait(500)
    cy.get('.cm-content').eq(0).contains('Testing Code')
    cy.get('.cm-content').eq(1).contains('Testing Input')
    cy.get('.cm-content').eq(0).contains('Testing Code 2').should('not.exist')

    // Create New Code and save
    cy.contains('test.py').click()
    cy.contains('New File').click()
    cy.get('.chakra-modal__body input').type('test2.py')
    cy.contains('Confirm').click()
    cy.typeIDE('Testing Code 2', 0)
    cy.typeIDE('Testing Input 2', 1)
    cy.get('button[aria-label="save code"]').click()

    // Check that code is saved
    cy.visit('/')
    cy.contains('Load your codes').click()
    cy.contains('test2.py').click()
    cy.wait(500)
    cy.get('.cm-content').eq(0).contains('Testing Code 2')
    cy.get('.cm-content').eq(1).contains('Testing Input 2')


    // Rename file
    cy.get('button[aria-label="File Settings"]').click()
    cy.contains('Rename').click()
    cy.get('.chakra-modal__body input').type('test.py')
    cy.contains('Confirm').should('be.disabled')
    cy.get('.chakra-modal__body input').type('{backspace}/')
    cy.contains('Confirm').should('be.disabled')
    cy.get('.chakra-modal__body input').type('{backspace}{backspace}{backspace}3.py')
    cy.contains('Confirm').click()
    cy.contains('test3.py')

    // Check that code is saved
    cy.visit('/')
    cy.contains('Load your codes').click()
    cy.contains('test3.py').click()
    cy.wait(500)
    cy.get('.cm-content').eq(0).contains('Testing Code 2')
    cy.get('.cm-content').eq(1).contains('Testing Input 2')

    // Test Reload
    cy.typeIDE('\nTesting Code 3', 0)
    cy.typeIDE('\nTesting Input 3', 1)
    cy.get('button[aria-label="File Settings"]').click()
    cy.contains('Reload').click()
    cy.wait(500)
    cy.get('.cm-content').eq(0).contains('Testing Code 2')
    cy.get('.cm-content').eq(1).contains('Testing Input 2')

    // Test Delete
    cy.get('button[aria-label="File Settings"]').click()
    cy.contains('Delete').click()
    cy.contains('Confirm').click()
    cy.contains('Load your code').click()
    cy.get('.chakra-menu__menu-list:visible').children('button').should('have.length', 2)
    cy.contains('test3.py').should('not.exist')

  })
})
