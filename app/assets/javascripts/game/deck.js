var Deck = (function () {
    var MINOR = 56, MAJOR = 22, SUITS,
        nameFromIndex;

    SUITS = ["coins", "cups", "swords", "batons"];

    nameFromIndex = function nameFromIndex (index) {
        return index;
    };

    return function Deck () {
        // builds the deck, 21 major arcana and 56 minor
        var deck = {};
        deck.minor = [];
        deck.major = [];

        _.times(MINOR, function buildMinor (index) {
            deck.minor.push({
                name: nameFromIndex(index, { major: false }),
                number: index % 14, // 0 is ACE
                suit: index % 4
            });
        });

        _.times(MAJOR, function buildMajor (index) {
            deck.major.push({
                name: nameFromIndex(index, { major: true }),
            });
        });

        return deck
    }
}())
