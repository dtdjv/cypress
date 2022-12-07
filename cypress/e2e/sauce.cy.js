/// <reference types="cypress" />

describe('Standard user test cases.', () => {   

    let fix
    beforeEach(function ()  {         
     
        cy.fixture('sauce').then(function (sauce)  {
            fix = sauce        
        })
        cy.visit('https://www.saucedemo.com/')
    })

    function sortList (sortBy) {

        cy.get('[data-test="product_sort_container"]').select(sortBy)
        cy.get('[data-test="product_sort_container"]').should('contain.text', sortBy)
    }

    function addProduct (product) {
        cy.contains(product).parent().parent().parent().within(() => {
            cy.contains('Add to cart').click()
        })
    }
    
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
        cy.get('nav.bm-item-list').should('be.visible').children().then((children) => {
            let i = 0            
            // cy.log(children.length) for debug purposes
            while (i < children.length) {                
                cy.get(children[i]).should('contain.text', menuItems[i])
                i++                
              } 
        })
     })

     it('User can access product cart.', function () { 

        const itemToCheck = 'Your Cart'

        cy.login(fix.normalUser.login, fix.normalUser.password)
        cy.get('.shopping_cart_link').click()
        cy.get('.title').should('contain.text', itemToCheck)   
    })

     it('User can sort product list', function () { 

        const sortByItems = ['Name (A to Z)', 'Name (Z to A)', 'Price (low to high)', 'Price (high to low)']
        
        cy.login(fix.normalUser.login, fix.normalUser.password)
        let i = 0
        while (i < sortByItems.length) {
            sortList(sortByItems[i])
            i++
        }
     })

     it('User can add one product to cart.', function () {    
        
        let random = Math.floor(Math.random() * 5)
        let product = Object.values(fix.productList)

        cy.login(fix.normalUser.login, fix.normalUser.password)
        cy.get('.shopping_cart_link').within(() =>{
            cy.get('span').should('not.exist')
        })        
        addProduct(product[random])
        cy.get('.shopping_cart_link').within(() =>{
            cy.get('span').should('exist').invoke('text').then((count) => {                
                return Number(count)
            }).should('be.greaterThan', 0)
        }) 
        cy.get('.shopping_cart_link').click()    
        cy.get('.cart_item').should('contain.text', product[random])
    })     

    it('User can add more than one product to cart.', function () {          
        
        let product = Object.values(fix.productList)

        cy.login(fix.normalUser.login, fix.normalUser.password)
        cy.get('.shopping_cart_link').within(() =>{
            cy.get('span').should('not.exist')
        })        
        addProduct(product[1])
        addProduct(product[3])
        addProduct(product[5])             
        cy.get('.shopping_cart_link').within(() =>{
            cy.get('span').should('exist').invoke('text').then((count) => {                
                return Number(count)
            }).should('be.equal', 3)
        }) 
        cy.get('.shopping_cart_link').click()    
        cy.get('.cart_item').its('length').should('be.equal', 3)
    })    

    it('User can remove products from cart.', function () { 
        
        let product = Object.values(fix.productList)        

        cy.login(fix.normalUser.login, fix.normalUser.password)
        cy.get('.shopping_cart_link').within(() =>{
            cy.get('span').should('not.exist')
        })        
        addProduct(product[0])
        addProduct(product[2])
        addProduct(product[4])             
        cy.get('.shopping_cart_link').within(() =>{
            cy.get('span').should('exist').invoke('text').then((count) => {                
                return Number(count)
            }).should('be.equal', 3)
        }) 
        cy.get('.shopping_cart_link').click()    
        cy.get('.cart_item').its('length').should('be.equal', 3)
        cy.get('button[data-test="continue-shopping"]').click()        
        cy.contains('Remove').click()
        cy.get('.shopping_cart_link').within(() =>{
            cy.get('span').should('exist').invoke('text').then((count) => {                
                return Number(count)
            }).should('be.equal', 2)
        }) 
        cy.get('.shopping_cart_link').click()    
        cy.get('.cart_item').its('length').should('be.equal', 2)        
    })    

    it('User can go through the full sales process.', function () {    
        
        let random = Math.floor(Math.random() * 5)
        let product = Object.values(fix.productList)
        const checkout = ['Checkout: Your Information', 'Checkout: Overview', 'Checkout: Complete!']
        const customerInfo = ['Im', 'Tester', '48-156']

        cy.login(fix.normalUser.login, fix.normalUser.password)
        cy.get('.shopping_cart_link').within(() =>{
            cy.get('span').should('not.exist')
        })        
        addProduct(product[random])
        cy.get('.shopping_cart_link').within(() =>{
            cy.get('span').should('exist').invoke('text').then((count) => {                
                return Number(count)
            }).should('be.greaterThan', 0)
        }) 
        cy.get('.shopping_cart_link').click()    
        cy.get('.cart_item').should('contain.text', product[random])
        cy.get('[data-test="checkout"]').click()
        cy.get('.title').should('contain.text', checkout[0])
        cy.get('[data-test="firstName"]').type(customerInfo[0])
        cy.get('[data-test="lastName"]').type(customerInfo[1])
        cy.get('[data-test="postalCode"]').type(customerInfo[2])
        cy.get('[data-test="continue"]').click()
        cy.get('.title').should('contain.text', checkout[1])
        cy.get('.inventory_item_name').should('contain.text', product[random])
        cy.get('[data-test="finish"]').click()
        cy.get('.title').should('contain.text', checkout[2])
        cy.get('[data-test="back-to-products"]').should('exist')
    })   

})