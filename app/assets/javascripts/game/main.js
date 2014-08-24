// globals for elements in the layout
var $spread, $context, setContext, drawCards, getElementByCardNumber,
    DECK = 0, CONTEXT = 1, DRAW = 2, SPREAD = 3, HAND = 4
    THE_WHEEL = 10, NAMELESS_ARCANA = 13;

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

    // TODO update the submit callback

    if (card.init != null) {
        card.init(deck);
    }
}

flipCard = function (card) {
    var $card = getCardHTML(card.number);
    $card.toggleClass("face-up face-down");

    card.zone = SPREAD;
}

// flips major arcana and adds minor to the draw annex
showDraw = function showDraw (draw) {
    _.each(draw, function (card) {
        if (card.order === "major") {
            flipCard(card);
        }
    });
};

$(function () {
    var deck = new Deck(), draw, selectMajorArcana;

    $spread = $("[role=spread]");
    $context = $("[role=context]");

    // to start the game, we build the spread and then select the wheel
    buildSpread(deck);

    flipCard(deck.getMajor(THE_WHEEL));

    $spread.on("click", ".card", function () {
        if (this.className === "card face-down") return false;

        var number = $(this).data("major-number"),
            card = deck.getMajor(number), draw;

        // the clicked arcana becomes the context, then we draw cards
        setContext(card, deck);
        draw = deck.drawCards(card);

        showDraw(draw);

        // if only one major arcana is showing (the context) we must reveal the nameless arcana
        // TODO -- right now when we have chosen the nameless_arcana, it ends up being face up in the
        // context spot. Whatever we do, I'd like this game state to be identical to the initial
        // gamestate. Discuss having a mysterious face down arcana in the context at the beginning
        if ($(".card.face-up").length === 1) {
            flipCard(deck.getMajor(NAMELESS_ARCANA));
        }
    });
})
