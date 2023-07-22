/// <reference types="cypress" />

import { fibo, inputCode } from "../../support/constants"

describe('Sanity Check', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Test Run', () => {
    cy.typeIDE(fibo, 0)

    cy.contains('Run').click()

    // Wait for execution step 3 and pause
    cy.stepInput().invoke('val').should('eq', '1')
    cy.get('button[aria-label="Play/Pause"]').click()

    cy.wait(1000)
    cy.stepInput().invoke('val').should('eq', '1')

    cy.checkTable([['fibo_prev', '1', ]])


    cy.stepInput().type('{backspace}28')

    cy.checkTable([['fibo_prev', '34', ], ['fibo_cur', '55'], ['i', '8'], ['temp', '89']])
  })

  it('Test with Input', () => {
    cy.typeIDE(inputCode, 0)
    cy.typeIDE('2\n3', 1)

    cy.contains('Run').click()
    cy.stepInput().invoke('val').should('eq', '1')
    cy.get('button[aria-label="Play/Pause"]').click()

    cy.wait(1000)
    cy.stepInput().invoke('val').should('eq', '1')

    cy.checkTable([['a', '1', ]])


    cy.stepInput().type('{backspace}5')

    cy.checkTable([['a', '1', ], ['b', '2'], ['c', '3'], ['d', '6']])

  })
})
