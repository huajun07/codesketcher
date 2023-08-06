/// <reference types="cypress" />

import { fibo, inputCode } from "../../support/constants"

describe('Sanity Check', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Test Run', () => {
    // Load fibonacci code and run
    cy.typeIDE(fibo, 0)
    cy.contains('Run').click()

    // Wait for execution step 1 and pause
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
    // Load code and input, then run
    cy.typeIDE(inputCode, 0)
    cy.typeIDE('2\n3', 1)
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
