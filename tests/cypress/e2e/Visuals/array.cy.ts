/// <reference types="cypress" />

describe('Array', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('1D array', () => {
    cy.viewport(1640, 900)

    // Load and run code
    cy.typeIDE('a = [_ for _ in range(10)]\nb=0', 0)
    cy.contains('Run').click()
    
    // Stop and jump the execution to the 13th state
    cy.stepInput().invoke('val').should('eq', '1')
    cy.get('button[aria-label="Play/Pause"]').click()
    cy.stepInput().type('{backspace}13')

    // Add array
    cy.get('button[aria-label="add array"]').click()

    cy.get('input[placeholder="Search..."]').type('a')
    cy.get('body').click() // unfocus Autocomplete 

    cy.matchImageSnapshot('1d_array', {
        "failureThreshold": 0.01,
        "failureThresholdType": "percent"
      })
  })

  it('2D array', () => {
    cy.viewport(1640, 900)

    // Load and run code
    cy.typeIDE('a = [[1, 2, 3], [1], [1, 2]]', 0)
    cy.contains('Run').click()
    cy.stepInput().invoke('val').should('eq', '1')  

    // Add array
    cy.get('button[aria-label="add array"]').click()

    cy.get('input[placeholder="Search..."]').type('a')
    cy.get('body').click() // unfocus Autocomplete
    cy.get('[aria-label="2d-array"]').click({force: true}) 

    cy.matchImageSnapshot('2d_array', {
        "failureThreshold": 0.01,
        "failureThresholdType": "percent"
      })
  })
})
