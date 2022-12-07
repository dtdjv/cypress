/// <reference types="cypress" />

describe('Standard user test cases.', () => {   

    let fix
    beforeEach(function ()  {         
     
        cy.fixture('sauce').then(function (sauce)  {
            fix = sauce        
        })
        cy.visit('https://www.saucedemo.com/')
    })
    
    it('User can access login page', function () {

    cy.get('[data-test="username"]').should('be.visible')
    cy.get('[data-test="password"]').should('be.visible')
    cy.get('[data-test="login-button"]').should('be.visible')
    })

    it('User can login.', function () {

        const itemToCheck = 'Products'

        cy.login(fix.normalUser.login, fix.normalUser.password)
        cy.get('.title').should('contain.text', itemToCheck)    
     })
     
     it('User can access hamburger menu.', function () {

        const menuItems = ['All Items', 'About', 'Logout', 'Reset App State']

        cy.login(fix.normalUser.login, fix.normalUser.password)
        cy.get('#react-burger-menu-btn').should('be.visible').click()
        cy.wait(1000)
        cy.get('nav.bm-item-list').should('be.visible').should('contain.text', menuItems)
     })

})