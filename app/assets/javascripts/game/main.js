// globals for elements in the layout
var $spread, $context, setContext, drawCards, getElementByCardNumber,
    DECK = 0, CONTEXT = 1, DRAW = 2, SPREAD = 3,
    THE_WHEEL = 10;

setContext = function setContext (card) {
    var $card = $("[data-major-number=" + card.number + "]"), $slot,
        $old = $context.children();

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


$(function () {
    var deck = new Deck();

    var a = deck.drawOne();
    var b = deck.drawOne();

$(function () {
    var deck = new Deck(), draw, selectMajorArcana;

    $spread = $("[role=spread]");
    $context = $("[role=context]");

    // to start the game, we build the spread and then select the wheel
    buildSpread(deck);
    setContext(deck.getMajor(2));

    $spread.on("click", ".card", function () {
        if (this.className === "card face-down") return false;

        setContext(deck.getMajor(number));
    });
})
