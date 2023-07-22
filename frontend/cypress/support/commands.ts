/// <reference types="cypress" />

Cypress.Commands.add('getToken', () => {    
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    },
  }).then(({ body }) => {
    const { id_token } = body
    return id_token
  })
})

Cypress.Commands.add('login', () => {
  cy.getToken().then((id_token) => {
    window.localStorage.setItem('codesketcher_jwt', id_token)
  })
  cy.visit('/')
})

Cypress.Commands.add('clearDB', () => {
  cy.getToken().then((id_token) => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8000/user/codes',
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    }).then(({ body }) => {
      const files = body.map((val: {codename: string}) => val.codename)
      for (const file of files) {
        cy.request({
          method: 'DELETE',
          url: `http://localhost:8000/user/codes/${file}`,
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
          failOnStatusCode: false,
        })
      }
    })
  })
})

Cypress.Commands.add('typeIDE', (str: string, ide: number) => {
  const newStr = str.replace('\n', '{enter}')
  cy.get('.cm-content').eq(ide).children().last().click().type(newStr)
})

Cypress.Commands.add('deleteIDE', (numChars: number, ide: number) => {
  const str = '{backspace}'.repeat(numChars)
  cy.get('.cm-content').eq(ide).children().last().click().type(str)
})

Cypress.Commands.add('stepInput', () => {
  return cy.get('input[aria-label="Step"]')
})


Cypress.Commands.add('checkTable', (data: string[][]) => {
  for(let i =0 ;i<data.length;i++){
    for(let j=0;j<data[i].length;j++){
      cy.get(`[aria-label="main table"] [aria-rowindex="${i+2}"]`) // 1-indexed and header row excluded so +2
      .children(`[aria-colindex="${j+2}"]`) // 1-indexed and pin col excluded so +2
      .invoke('prop', 'outerText')
      .should('eq', data[i][j])
    }
  }
})
