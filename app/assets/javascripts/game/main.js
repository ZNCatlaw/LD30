// globals for elements in the layout
var $spread, $context, setContext, drawCards, getElementByCardNumber,
    DECK = 0, CONTEXT = 1, DRAW = 2, SPREAD = 3,
    THE_WHEEL = 10;

getCardHTML = function (number) {
    return $("[data-major-number=" + number + "]");
}

setContext = function setContext (card, deck) {
    var $card = getCardHTML(card.number), $slot,
        $old = $context.children(), callbacks;

    if ($old.length > 0) {
        var number = $old.data("major-number"),
            old = deck.getMajor(number);

        $slot = $("[data-slot-number=" + number + "]");
        $old.toggleClass("face-up face-down");
        $old.remove();
        old.zone = DECK;

        $slot.append($old);
    }

    $card.remove();
    $context.append($card);
    card.zone = CONTEXT;

    // update the submit callback
    // run the init callback
}

// flips major arcana and adds minor to the draw annex
showDraw = function showDraw (draw) {
    _.each(draw, function (card) {
        if (card.order === "major") {
            var $card = getCardHTML(card.number);
            $card.toggleClass("face-up face-down");

            card.zone = SPREAD;
        }
    });
};

$(function () {
    var deck = new Deck(), draw, selectMajorArcana;

    $spread = $("[role=spread]");
    $context = $("[role=context]");

    // to start the game, we build the spread and then select the wheel
    buildSpread(deck);

    // the wheel starts flipped
    $("[data-major-number=" + THE_WHEEL + "]").toggleClass("face-up face-down");

    selectMajorArcana = function selectMajorArcana (number) {
        var card = deck.getMajor(number), draw;

        // the clicked arcana becomes the context, then we draw cards
        setContext(card, deck);
        draw = deck.drawCards(card);

        showDraw(draw);
    };

    selectMajorArcana(THE_WHEEL);

    $spread.on("click", ".card", function () {
        if (this.className === "card face-down") return false;

        selectMajorArcana($(this).data("major-number"));
    });
})
