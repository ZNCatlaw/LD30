
var Card = (function () {

    return function Card (options) {
        _.defaults(options, {
            draw_size: function () { return 3; },
            filter: function () { return true; }
        });

        return {
            name: options.name,
            number: options.number,
            zone: DECK,
            order: "major",
            draw_size: options.draw_size,
            filter: options.filter,
            init: options.init
        };
    };
}());

var CARDS = [
    new Card({ name: "Le Mat", number: 0}),
    new Card({ name: "Le Bateleur", number: 1}),
    new Card({ name: "La Papesse", number: 2}),
    new Card({ name: "L'Impératrice", number: 3}),
    new Card({ name: "L'Empereur", number: 4}),
    new Card({ name: "Le Pape", number: 5}),
    new Card({ name: "L'Amoureux", number: 6}),
    new Card({ name: "Le Chariot", number: 7}),
    new Card({ name: "La Justice", number: 8}),
    new Card({ name: "L'Hermite", number: 9 }),
    new Card({
        name: "La Roue de Fortune",
        number: 10,
        filter: function (card) {
            return card.order === "major";
        }
    }),
    new Card({ name: "La Force", number: 11 }),
    new Card({ name: "Le Pendu", number: 12 }),
    new Card({
        name: "L'Arcane sans nom",
        number: 13,
        // put all cards back in the deck
        // unless those cards are part of hands
        filter: function (card) {
            return card.name === "La Roue de Fortune";
        },
        init: function (deck) {
            var $body = $("body");
            _.each(deck.cards, function (card) {
                // flip all face up arcana cards
                if (card.zone === SPREAD || card.zone === CONTEXT) {
                    var $card = getMajorCardHTML(card.number);
                    $card.removeClass("face-up");
                    $card.addClass("face-down");
                }

                // put all minor arcana back in the deck
                if (card.zone !== HAND) {
                    removeMinorCardHTML(card);
                }
            });
        }
    }),
    new Card({ name: "Tempérance", number: 14 }),
    new Card({ name: "Le Diable", number: 15 }),
    new Card({ name: "La Maison Dieu", number: 16 }),
    new Card({ name: "L'Étoile", number: 17 }),
    new Card({ name: "La Lune", number: 18 }),
    new Card({ name: "Le Soleil", number: 19 }),
    new Card({ name: "Le Jugement", number: 20 }),
    new Card({ name: "Le Monde", number: 21 })
];

