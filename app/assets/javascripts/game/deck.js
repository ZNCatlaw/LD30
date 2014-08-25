var SUITS, BATONS = 0, SWORDS = 1, CUPS = 2, COINS = 3;

var Deck = (function () {

    SUITS = ["Batons", "Swords", "Cups", "Coins"];
    NUMBERS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"]

    return function Deck () {
        // builds the deck, 21 major arcana and 56 minor
        var minor = [], major = [], cards = [],
            inDeck, nameFromIndex;

        _.times(MINOR, function buildMinor (index) {
            var number = index % WEIGHTS,
                suit = Math.floor(index / WEIGHTS);

            cards.push({
                name: "" + NUMBERS[number] + " of " + SUITS[suit],
                number: index % WEIGHTS,
                suit: suit,
                zone: DECK,
                order: "minor",
                selected: false
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
            getMinor: function getMinor (number, suit) {
                return this.cards[this.minor[suit * WEIGHTS + number]]
            },

            drawOne: function drawOne (draw, deck) {
                var index, card;
                // if the draw fills up, filter out minor arcana before
                // continuing
                if (draw.length === 5) {
                    deck = _.filter(deck, function (card) { return card.order === "major"; });
                }

                if (deck.length > 0) {
                    // splice modifies the array in place, and returns an array of
                    // the elements removed
                    index = Math.floor((Math.random() * 100)) % deck.length;
                    card = deck.splice(index, 1)[0];

                    card.zone = DRAW;
                    draw.push(card);
                }
            },

            // returns a number of cards
            drawCards: function drawCards (context) {
                var size = context.draw_size(this), draw = [],
                    deck = _.first(_.partition(this.cards, inDeck)), index;

                deck = _.filter(deck, context.filter);
                size = Math.min(size, deck.length);

                _.times(size, function () {
                    this.drawOne(draw, deck);
                }, this);

                return draw;
            },

            // just for testing
            countMinor: function () {
                var count = 0;

                _.each(this.minor, function (index) {
                    if (this.cards[index].zone === DECK) count++;

                }, this);

                return count;
            }
        }
    }
}())
