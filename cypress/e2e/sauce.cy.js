/// <reference types="cypress" />

describe('Check if service is avaible.', () => { 
    
    let fix
    beforeEach(() => {         
     
        cy.fixture('sauce').then(function (sauce)  {

            fix = sauce                     
        })        
    })

    it('User can access login page', () => {

        cy.visit('https://www.saucedemo.com/')      
        cy.get('[data-test="username"]').should('be.visible')
        cy.get('[data-test="password"]').should('be.visible')
        cy.get('[data-test="login-button"]').should('be.visible')        
    })

    it('User cant login while providing non existing user name. ', () => {

        const textToCheck = 'Epic sadface: Username and password do not match any user in this service'

        cy.visit('https://www.saucedemo.com/')       
        cy.get('[data-test="username"]').type(fix.noUserinDB.login)
        cy.get('[data-test="password"]').type(fix.normalUser.password)
        cy.get('[data-test="login-button"]').click() 
        cy.get('[data-test="error"]').should('contain.text', textToCheck)    
    })

    it('User cant login while providing non existing user password. ', () => {

        const textToCheck = 'Epic sadface: Username and password do not match any user in this service'

        cy.visit('https://www.saucedemo.com/')       
        cy.get('[data-test="username"]').type(fix.normalUser.login)
        cy.get('[data-test="password"]').type(fix.noUserinDB.password)
        cy.get('[data-test="login-button"]').click()      
        cy.get('[data-test="error"]').should('contain.text', textToCheck)              
    })
})

describe('Standard user test cases.', () => {   

    let fix
    beforeEach(function ()  {         
     
        cy.fixture('sauce').then(function (sauce)  {
            fix = sauce            
            
            cy.login(fix.normalUser.login, fix.normalUser.password)            
        })        
    })

    function sortList (sortBy) {

        cy.get('[data-test="product_sort_container"]').select(sortBy)
        cy.get('[data-test="product_sort_container"]').should('contain.text', sortBy)
    }

    function sortList2 (sortedBy, sortType) {

        const sortByItems = ['Name (A to Z)', 'Name (Z to A)', 'Price (low to high)', 'Price (high to low)']
        const sort = Object.values(sortedBy)         
        let x = 0       
        
        cy.get('[data-test="product_sort_container"]').select(sortByItems[sortType])
        cy.get('[data-test="product_sort_container"]').should('contain.text', sortByItems[sortType])
            
        
        while ( sort.length > x ) {            
            cy.get('div.inventory_item_name').eq(x).invoke('text').then((order) => {            
                expect(order).to.equal(sort[x])                
                x++    
            })                                  
        }   
    }

    function addProduct (product) {
        cy.contains(product).parent().parent().parent().within(() => {
            cy.contains('Add to cart').click()
        })
    }  

    it('User can login.', function () {

        const itemToCheck = 'Products'        
        
        cy.get('.title').should('contain.text', itemToCheck)    
     })

     it('User can access hamburger menu.', function () {

        const menuItems = ['All Items', 'About', 'Logout', 'Reset App State']

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
        
        cy.get('.shopping_cart_link').click()
        cy.get('.title').should('contain.text', itemToCheck)   
    })

     it.only('User can sort product list by Name (A to Z)', function () { 

        const sortByItems = ['Name (A to Z)', 'Name (Z to A)', 'Price (low to high)', 'Price (high to low)'] 
        let sortAZ = Object.values(fix.sortAZ) 
        cy.visit('https://www.saucedemo.com/')       
        // sortList2(fix.sortAZ, 0)
        // cy.get('[data-test="product_sort_container"]').select(sortByItems[0])
        // cy.get('[data-test="product_sort_container"]').should('contain.text', sortByItems[0])
            
        // let i = 0
        // let x = 0
        // while ( sortAZ.length > i ) {
            
        //     cy.get('div.inventory_item_name').eq(i).invoke('text').then((order) => {                          
                
        //         expect(order).to.equal(sortAZ[x])
        //         // expect(order).to.equal(list[x])
        //         x++    
        //     })
        //     i++                        
        // }   
     })

     it('User can add one product to cart.', function () {    
        
        let random = Math.floor(Math.random() * 5)
        let product = Object.values(fix.productList)
        
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
    
describe('Locked user test cases.', () => {   

    let fix
    beforeEach(function ()  {         
        
        cy.fixture('sauce').then(function (sauce)  {
            fix = sauce           
            
            cy.login(fix.lockedUser.login, fix.lockedUser.password)            
        })        
    })

    it('User cant login due to locked account.', function () {

        cy.get('[data-test="error"]').should('contain.text', 'Epic sadface: Sorry, this user has been locked out.')
    })
})


