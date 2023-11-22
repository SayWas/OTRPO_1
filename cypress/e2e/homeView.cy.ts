describe('Home View Tests with API Mocking', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/pokemon', { fixture: 'pokemons.json' })
        cy.visit('/');
    });

    it('loads the home page', () => {
        cy.contains('div', 'Поиск');
    });

    it('searches for a Pokemon and displays results', () => {
        cy.get('.search-input').type('Pikachu');
        cy.get('.button-search').click();
        cy.contains('.pokemon-view', 'Pikachu');
    });
});