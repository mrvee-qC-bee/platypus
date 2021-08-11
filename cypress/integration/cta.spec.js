/// <reference types="cypress" />

describe('CTA', () => {
  it('next and previous section links work', () => {
    cy
      .visit('/course/ch-prerequisites')
      .get('[data-test=footer-nav-next-section]')
      .click()
      .url()
      .should(
        'include',
        '/course/ch-prerequisites/introduction-to-python-and-jupyter-notebooks'
      )

      .get('[data-test=footer-nav-previous-section]')
      .click()
      .url()
      .should(
        'include',
        '/course/ch-prerequisites/environment-setup-guide-to-work-with-qiskit-textbook'
      )
  })

  it('back to home link linked correctly', () => {
    cy
      .visit('/course/ch-prerequisites')
      .get('[data-test=back-to-home-link]')
      .should('have.attr', 'href', 'https://qiskit.org/textbook-beta')
  })

  it('toggle sidebar button works', () => {
    cy
      .visit('/course/ch-prerequisites')
      .get('[data-test=sidebar] [data-test=sidebar-entry]')
      .should('be.visible')

      .get('[data-test=sidebar-button-toggle]')
      .click()
      .get('[data-test=sidebar] [data-test=sidebar-entry]')
      .should('be.hidden')

      .get('[data-test=sidebar-button-toggle]')
      .click()
      .get('[data-test=sidebar] [data-test=sidebar-entry]')
      .should('be.visible')

    // Mobile

      .viewport('iphone-x')
      .visit('/course/ch-prerequisites')
      .get('[data-test=sidebar] [data-test=sidebar-entry]')
      .should('be.hidden')

      .get('[data-test=sidebar-button-toggle-mobile]')
      .click()
      .get('[data-test=sidebar] [data-test=sidebar-entry]')
      .should('be.visible')

      .get('[data-test=sidebar-button-toggle]')
      .click()
      .get('[data-test=sidebar] [data-test=sidebar-entry]')
      .should('be.hidden')
  })

  it('toggle mobile menu button works', () => {
    cy
      .viewport('iphone-x')
      .visit('/course/ch-prerequisites')
      .get('[data-test=mobile-menu]')
      .should('be.hidden')

      .get('[data-test=mobile-menu-toggle]')
      .click()
      .get('[data-test=mobile-menu]')
      .should('be.visible')

      .get('[data-test=mobile-menu-toggle]')
      .click()
      .get('[data-test=mobile-menu]')
      .should('be.hidden')
  })

  it('old textbook version link has expected properties', () => {
    cy
      .visit('/course/ch-prerequisites')
      .get('[data-test=qiskit-banner-old-textbook-version] a')
      .should('have.attr', 'target', '_blank')
      .should('have.attr', 'href', 'https://qiskit.org/textbook')
  })
})
