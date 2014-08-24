// place 21 cards on the board
var buildSpread = function buildSpread (deck) {
    // place each card on the board
    var cards          = deck.major,
        width          = $spread.width(),
        height         = $spread.height(),
        card_data      = {},
        rows           = 2,
        cols           = Math.ceil(cards.length/rows),
        card_template  = $("[role=card]").html(),
        $card_template = $(card_template),
        $table = $("<table>");

    card_data.width  = width/cols - 1;
    card_data.height = height/rows;

    $table.append("<tbody>")

    _.forEach(cards, function (number, index) {
        var card = deck.cards[number],
            $card = $card_template.clone(),
            $tr = $table.find("tr").last(), $td = $("<td>");

        if (index % cols == 0) {
            $tr = $("<tr>");
            $table.append($tr);
        }

        $card.width(card_data.width);
        $card.height(card_data.height);
        $card.text(card.name);
        $card.addClass("face-down");
        $card.attr("data-major-number", card.number);
        $td.attr("data-slot-number", card.number);

        $td.append($card);
        $tr.append($td);
    });

    $spread.append($table);
}


