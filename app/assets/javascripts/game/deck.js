var Deck = (function () {
    var MINOR = 56, MAJOR = 22, SUITS, NAMES, WEIGHTS = 14;

    SUITS = ["coins", "cups", "swords", "batons"];

    return function Deck () {
        // builds the deck, 21 major arcana and 56 minor
        var minor = [], major = [], cards = [],
            inDeck, nameFromIndex;

        _.times(MINOR, function buildMinor (index) {
            cards.push({
                name: "minor" + index,
                number: index % WEIGHTS,
                suit: index % SUITS.length,
                zone: DECK,
                order: "minor"
            });

            minor.push(index);
        });

        _.times(MAJOR, function buildMajor (index) {
            cards.push(CARDS[index]);

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
