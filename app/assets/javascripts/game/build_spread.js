// place 21 cards on the board
var buildSpread = function buildSpread (deck) {
    // place each card on the board
    var cards          = deck.major,
        card_data      = {},
        rows           = 2,
        cols           = Math.ceil(cards.length/rows),
        card_template  = $("script[role=card]").html(),
        $card_template = $(card_template);

    _.forEach(cards, function (number, index) {
        var card = deck.cards[number],
            $cardbox = $card_template.clone(),
            $card = $cardbox.find(".card");

        $cardbox.attr("id", 'spread-slot-' + card.number);

        $card.addClass("face-down");
        $card.attr("data-major-number", card.number);
        $card.attr("id", 'major-' + card.number);

        $spread.append($cardbox);
    });

}

var buildMinorArcana = function buildMinorArcana (deck) {
    // create and hide the cards somewhere
    var cards          = deck.minor,
        card_data      = {},
        card_template  = $("script[role=card]").html(),
        $card_template = $(card_template),
        $minor_store   = $("#minor-store");

    _.forEach(cards, function (number, index) {
        var card = deck.cards[number],
            $card = $card_template.clone().find(".card");

        $card.addClass("face-up"); // minor arcana are always face-up
        $card.attr("data-minor-number", card.number);
        $card.attr("data-minor-suit", card.suit);
        $card.attr("id", 'minor-' + card.suit + '-' + card.number);

        $minor_store.append($card);
    });
}

