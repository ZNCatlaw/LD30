// place 21 cards on the board
var buildSpread = function buildSpread (cards) {
    // place each card on the board
    var width            = $spread.width(),
        height           = $spread.height(),
        card_data        = {},
        rows             = 2,
        cols             = Math.ceil(cards.length/rows),
        card_template    = $("[role=card]").html(),
        $card_template   = $(card_template);

    card_data.width  = width/cols - 1;
    card_data.height = height/rows;

    _.forEach(cards, function (card, index) {
        var $card = $card_template.clone();
        $card.width(card_data.width);
        $card.height(card_data.height);
        $card.text(index);

        $spread.append($card)
    });
}


