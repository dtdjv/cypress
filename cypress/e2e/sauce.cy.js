/// <reference types="cypress" />


let fix
beforeEach(function ()  {         
     
    cy.fixture('sauce').then(function (sauce)  {
        fix = sauce        
    })    
    cy.visit('https://www.saucedemo.com/')
})

describe('Standard user test cases.', () => {   
    
    it('User can access login page', function () {

    cy.get('[data-test="username"]').should('be.visible')
    cy.get('[data-test="password"]').should('be.visible')
    cy.get('[data-test="login-button"]').should('be.visible')

    })

    it('User can login.', function () {

        cy.get('[data-test="username"]').type(fix.normalUser.login)
        cy.get('[data-test="password"]').type(fix.normalUser.password)
        cy.get('[data-test="login-button"]')
    
     })
})