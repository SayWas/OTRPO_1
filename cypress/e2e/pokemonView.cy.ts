import type { PokemonData } from '../index';


describe('Pokemon Details View Tests', () => {
    let pokemonFixture: PokemonData

    before(() => {
        cy.fixture('charizard.json').then((data) => {
            pokemonFixture = data;
        });
    });

    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:8000/add_to_db/').as('saveResults');
        cy.intercept('GET', 'http://localhost:8000/pokemons/*', { fixture: 'pokemons.json' }).as('getPokemons');
        cy.intercept('GET', 'http://localhost:8000/pokemon/*', (req) => {
            const pokemonName = req.url.split('/').pop();
            const responseData = { ...pokemonFixture, name: pokemonName };
            req.reply(responseData);
        }).as('getPokemonDetails');
    });

    it('displays the pokemon information correctly', () => {
        cy.visit('/pokemon/charizard');
        cy.wait('@getPokemonDetails');

        cy.get('.pokemon-info-name').should('contain', pokemonFixture.name);
        cy.get('.pokemon-info-image img').should('have.attr', 'src', pokemonFixture.sprites.front_default);

        cy.get('.pokemon-stat').each(($el, index) => {
            cy.wrap($el).find('.pokemon-stat-name').should('contain', pokemonFixture.stats[index].stat.name);
            cy.wrap($el).find('.pokemon-stat-value').should('contain', pokemonFixture.stats[index].base_stat);
        });
    });

    it('allows selecting a pokemon and redirects to the home page', () => {
        cy.visit('/pokemon/charizard');
        cy.wait('@getPokemonDetails');

        cy.get('.choose-button').click();

        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('allows entering FTP credentials and sending data', () => {
        cy.visit('/pokemon/charizard');

        cy.intercept('POST', '/save_pokemon', (req) => {
            expect(req.body).to.deep.equal(pokemonFixture);
            expect(req.headers.authorization).to.exist;
            req.reply({
                statusCode: 201,
                body: 'Pokemon saved successfully'
            });
        }).as('savePokemon');

        const ftpLogin = 'testLogin';
        const ftpPassword = 'testPassword';
        cy.get('.ftp-form input[type="text"]').type(ftpLogin);
        cy.get('.ftp-form input[type="password"]').type(ftpPassword);

        cy.get('.ftp-form button').click();

        cy.wait('@savePokemon').its('response.statusCode').should('eq', 201);
    });

    it('selects the first pokemon for a fight and then chooses a second pokemon to initiate the fight', () => {
        cy.intercept('GET', '**/pokemon/bulbasaur*', (req) => {
            const pokemonName = req.url.split('/').pop();
            const responseData = { ...pokemonFixture, name: pokemonName };
            req.reply(responseData);
        }).as('getBulbasaurDetails');

        cy.visit('/');
        cy.wait('@getPokemons');
        cy.wait('@getBulbasaurDetails');

        cy.get('.pokemon-list-item').first().click();
        cy.wait('@getBulbasaurDetails');
        cy.get('.choose-button').click();

        cy.wait('@getPokemons');
        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.wait('@getBulbasaurDetails');

        cy.get('.pokemon-list-item').first().click();
        cy.wait('@getBulbasaurDetails');
        cy.url().should('include', '/pokemon/');

        cy.get('.fight-button').click();
        cy.url().should('include', '/fight');
    });

    it('selects the first pokemon for a fight and then chooses a second pokemon to initiate the auto fight', () => {
        cy.intercept('GET', '**/pokemon/bulbasaur*', (req) => {
            const pokemonName = req.url.split('/').pop();
            const responseData = { ...pokemonFixture, name: pokemonName };
            req.reply(responseData);
        }).as('getBulbasaurDetails');

        cy.visit('/');
        cy.wait('@getPokemons');
        cy.wait('@getBulbasaurDetails');
    
        cy.get('.pokemon-list-item').first().click()
        cy.wait('@getBulbasaurDetails');
        cy.get('.choose-button').click();
    
        cy.wait('@getPokemons');
        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.wait('@getBulbasaurDetails');

        cy.get('.pokemon-list-item').first().click()
        cy.wait('@getBulbasaurDetails');
        cy.url().should('include', '/pokemon/');
    
        cy.get('.auto-fight-button').click();
        cy.url().should('include', '/fight?auto=true');
    });


    it('handles errors gracefully', () => {
        cy.intercept('GET', 'http://localhost:8000/pokemon/*', { statusCode: 404 }).as('getPokemonsFail');
        cy.visit('/pokemon/charizard121212');
        cy.wait('@getPokemonsFail');
    });
});
