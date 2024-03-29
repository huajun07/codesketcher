/// <reference types="cypress" />

import { fibo, inputCode } from "../../support/constants"

describe('Sanity Check', () => {
  beforeEach(() => {
    cy.clearDB()
    cy.login()
  })

  it('Test Run', () => {
    // Load fibo
    cy.typeIDE(fibo, 0)
    
    // Click Save Button
    cy.get('button[aria-label="save code"]').click()
    // Enter file name
    cy.get('.chakra-modal__body input').type('test.py')
    cy.contains('Confirm').click()

    // Refresh the site and check that the code is saved
    cy.visit('/')
    cy.contains('Load your codes').click()
    cy.contains('test.py').click()
    cy.contains('Run').click()

    // Wait for execution step 3 and pause
    cy.stepInput().invoke('val').should('eq', '1')
    cy.get('button[aria-label="Play/Pause"]').click()

    // Check that the execution has indeed stopped
    cy.wait(1000)
    cy.stepInput().invoke('val').should('eq', '1')

    cy.checkTable([['fibo_prev', '1', ]])

    // Jump to the 28th state of the execution
    cy.stepInput().type('{backspace}28')
    cy.checkTable([['fibo_prev', '34', ], ['fibo_cur', '55'], ['i', '8'], ['temp', '89']])
  })

  it('Test with Input', () => {
    cy.typeIDE(inputCode, 0)
    cy.typeIDE('2\n3', 1)

    // Click Save Button
    cy.get('button[aria-label="save code"]').click()
    // Enter file name
    cy.get('.chakra-modal__body input').type('test.py')
    cy.contains('Confirm').click()

    // Refresh the site and check that the code is saved
    cy.visit('/')
    cy.contains('Load your codes').click()
    cy.contains('test.py').click()
    cy.contains('Run').click()

    // Pause the execution at the first state
    cy.stepInput().invoke('val').should('eq', '1')
    cy.get('button[aria-label="Play/Pause"]').click()

    // Check that the execution has indeed stopped
    cy.wait(1000)
    cy.stepInput().invoke('val').should('eq', '1')

    cy.checkTable([['a', '1', ]])

    // Jump to the 5th state of the execution
    cy.stepInput().type('{backspace}5')
    cy.checkTable([['a', '1', ], ['b', '2'], ['c', '3'], ['d', '6']])

    // Check that the output tab has the correct output
    cy.get('.cm-content').eq(2).contains('Value of d is 6')

  })
})
