// globals for elements in the layout
var $spread, $context, setContext,
    DECK = 0, CONTEXT = 1;

setContext = function setContext (card) {
    var $card = $("[data-major-number=" + card.number + "]"), $slot,
        $old = $context.children();

    if ($old.length > 0) {
        $slot = $("[data-slot-number=" + $old.data("major-number") + "]");
        $old.toggleClass("face-up", "face-down");
        $old.remove();
        $slot.append($old);
    }

    $card.remove();
    $context.append($card);
    card.zone = CONTEXT;

    // update the submit callback
    // run the init callback
    // update the draw filter
    // run draw(number)
    //
}


$(function () {
    var deck = new Deck();

    var a = deck.drawOne();
    var b = deck.drawOne();

    console.log(a);
    console.log(b);

    $spread = $("[role=spread]");
    $context = $("[role=context]");

    // to start the game, we build the spread and then select the wheel
    buildSpread(deck);
    setContext(deck.getMajor(2));

    $spread.on("click", ".card", function () {
        var number = $(this).data("major-number");

        setContext(deck.getMajor(number));
    });
})
