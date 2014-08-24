var Deck = (function () {
    var MINOR = 56, MAJOR = 8, SUITS, NAMES, WEIGHTS = 14;

    SUITS = ["coins", "cups", "swords", "batons"];
    NAMES = ["Le Mat", /*"Le Bateleur", "La Papesse", "L'Impératrice", "L'Empereur", "Le Pape",
        "L'Amoureux", "Le Chariot", "La Justice",*/ "L'Hermite", "La Roue de Fortune",
    "La Force", /*"Le Pendu",*/ "L'Arcane sans nom", /*"Tempérance", "Le Diable",
    "La Maison Dieu",*/ "L'Étoile", /*"La Lune", "Le Soleil",*/ "Le Jugement", "Le Monde"];

    return function Deck () {
        // builds the deck, 21 major arcana and 56 minor
        var deck = {}, minor = [], major = [], cards = [],
            inDeck, nameFromIndex;

        nameFromIndex = function nameFromIndex (index, options) {
            var name = "NONE";

            if (options != null && options.major == true) {
                name = NAMES[index];

            } else {
                name = "MINOR" + index;
            }

            return name;
        };

        _.times(MINOR, function buildMinor (index) {
            cards.push({
                name: nameFromIndex(index, { major: false }),
                number: index % WEIGHTS,
                suit: index % SUITS.length,
                zone: DECK,
                order: "minor"
            });

            minor.push(index);
        });

        _.times(MAJOR, function buildMajor (index) {
            cards.push({
                name: nameFromIndex(index, { major: true }),
                zone: DECK,
                order: "major",
                number: index
            });

            major.push(MINOR + index);
        });

        inDeck = function inDeck (card) {
            return card.zone === DECK;
        };

        return {
            cards: cards,
            major: major,
            minor: minor,

            // get the nth major arcana from the deck
            getMajor: function getMajor (index) {
                return this.cards[this.major[index]]
            },

            // get the nth minor arcana from the deck
            getMinor: function getMajor (index) {
                return this.cards[this.minor[index]]
            },

            // randomly draws one card from DECK
            drawOne: function drawOne () {
                var deck = _.first(_.partition(this.cards, inDeck)),
                    index = Math.floor((Math.random() * 100)) % deck.length;

                return deck[index];
            }
        }
    }
}())
