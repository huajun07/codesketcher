/// <reference types="cypress" />

describe('Graph', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Test Run', () => {
    cy.viewport(1640, 900)
    // Temp fix till issue with react-data-grid ResizeObserver loop limit exceeded is fixed
    Cypress.on('uncaught:exception', (_err, _runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    
    // Load Dijkstra and run code
    cy.get('button[aria-label="faq"]').click()
    cy.contains('Code Examples').click()
    cy.contains(`Dijkstra's Algorithm (Single Source Shortest Path)`).click()
    cy.contains('Load Code').click()
    cy.contains('Run').click()

    // Stop and jump the execution to the 116th state of the execution
    cy.stepInput().invoke('val').should('eq', '1')
    cy.get('button[aria-label="Play/Pause"]').click()
    cy.stepInput().type('{backspace}116')

    // Temp fix till issue with react-data-grid ResizeObserver loop limit exceeded is fixed
    // cy.get('iframe#webpack-dev-server-client-overlay').then((element)=>{
    //     if (element.length > 0) 
    //    element.attr('style', 'display: none')
    // })

    // Add graph
    cy.get('button[aria-label="add graph"]').click()

    cy.get('input[aria-label="edge variable"]').type('adj')
    cy.get('.chakra-modal__header').click()
    // Autocomplete blocking click even after unfocusing text input
    cy.get('[aria-label="weighted"]').click({force: true}) 
    cy.contains('Save').click()
    cy.wait(1500)

    cy.viewport(1640, 900).then(()=>{
        cy.get('#root').matchImageSnapshot('graph', {
            "failureThreshold": 0.0001,
            "failureThresholdType": "percent"
          })
      })

    })
})
