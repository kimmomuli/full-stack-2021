describe('Blog app', function () {
  it('Login form is shown', function () {
    cy.visit('http://localhost:3000')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      cy.create({
        'username': 'TESTI',
        'name': 'NAME',
        'password': 'salasana'
      })
      cy.visit('http://localhost:3000')
    })

    it('succeeds with correct credentials', function () {
      cy.get('#username')
      cy.get('#password')
      cy.get('#login-button').click()
      cy.contains('TESTI logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username')
      cy.get('#password')
      cy.get('#login-button').click()
      cy.get('#login-button')
      cy.get('html').should('not.contain', 'TESTI logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      cy.create({
        'username': 'TESTI',
        'name': 'NAME',
        'password': 'salasana'
      })
      cy.login({
        'username': 'TESTI',
        'password': 'salasana'
      })
    })

    it('A blog can be created', function () {
      cy.get('#create-new-blog').click()

      cy.get('#title').type('Test title')
      cy.get('#author').type('Test author')
      cy.get('#url').type('https://google.com')

      cy.get('#create-blog').click()

      cy.contains('a new blog Test title Test author')
    })

    it('A blog can be liked', function () {
      cy.get('#create-new-blog').click()

      cy.get('#title').type('Test title')
      cy.get('#author').type('Test author')
      cy.get('#url').type('https://google.com')

      cy.get('#create-blog').click()

      cy.contains('a new blog Test title Test author')
      cy.get('#view-button').click()
      cy.get('#like-button').click()
      cy.contains('likes 1')
    })

    it('owner can remove blog', function () {
      cy.get('#create-new-blog').click()

      cy.get('#title').type('Test title')
      cy.get('#author').type('Test author')
      cy.get('#url').type('https://google.com')

      cy.get('#create-blog').click()

      cy.contains('a new blog Test title Test author')
      cy.get('#view-button').click()
      cy.get('#remove-button').click()

      cy.get('html').should('not.contain', 'Test title')
    })

    it('most liked blog is first', function () {
      cy.createBlog({
        'title': 'test1',
        'author': 'author1',
        'url': 'https://testi.com'
      })
      cy.createBlog({
        'title': 'test2',
        'author': 'author2',
        'url': 'https://testi.com'
      })
      cy.createBlog({
        'title': 'test3',
        'author': 'author3',
        'url': 'https://testi.com'
      })

      /*
        1. test1
        2. test3
        3. test2
      */

      cy.contains('test3')
        .find('button')
        .click()
        .parent()
        .contains('like')
        .click()
        .wait(500)
        .click()
        .wait(500)
        .click()
        .wait(500)

      cy.contains('test1')
        .find('button')
        .click()
        .parent()
        .contains('like')
        .click()
        .wait(500)
        .click()
        .wait(500)
        .click()
        .wait(500)
        .click()
        .wait(500)
        .click()
        .wait(500)
        .click()
        .wait(500)
        .parent()
        .first()
        .contains('test1')
        .parent()
        .last()
        .contains('author2')
    })
  })
})

