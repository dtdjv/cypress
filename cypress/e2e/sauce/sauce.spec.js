import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given('Open web', () => {
    cy.visit('https://www.saucedemo.com/')         
})

When('tst', () => {
    cy.get('[data-test="username"]').should('be.visible')        
})

Then('aaa', () => {
    cy.get('[data-test="password"]').should('be.visible')
})