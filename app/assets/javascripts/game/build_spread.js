// place 21 cards on the board
var buildSpread = function buildSpread (deck) {
    // place each card on the board
    var cards          = deck.major,
        card_data      = {}
        card_template  = $("script[role=card]").html(),
        $card_template = $(card_template);

    _.forEach(cards, function (number, index) {
        var card = deck.cards[number],
            $card = $card_template.clone();

        $card.addClass("face-down");
        $card.attr("data-major-number", card.number);
        $card.attr("id", 'major-' + card.number);

        $spread.find('#spread-slot-' + card.number).append($card);
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
            $card = $card_template.clone();

        $card.addClass("face-up"); // minor arcana are always face-up
        $card.attr("data-minor-number", card.number);
        $card.attr("data-minor-suit", card.suit);
        $card.attr("id", 'minor-' + card.suit + '-' + card.number);

        $minor_store.append($card);
    });
}

var arrangeSpread = function arrangeSpread(){

}

var bernoulli = function bernoulli (t) {
    var scale = 2 / (3 - Math.cos(2*t));
    var x = scale * Math.cos(t);
    var y = scale * Math.sin(2*t) / 2;
    return [x, y];
}
