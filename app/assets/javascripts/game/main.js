// globals for elements in the layout
var $spread, $context, $draw, $collection,
    setContext, drawCards, getElementByCardNumber,
    DECK = 0, CONTEXT = 1, DRAW = 2, SPREAD = 3, HAND = 4, COLLECTION = 5,
    MINOR = 56, MAJOR = 22, WEIGHTS = 14,
    THE_WHEEL = 10, NAMELESS_ARCANA = 13;

getMajorCardHTML = function (number) {
    return $("[data-major-number=" + number + "]");
}

getMinorCardHTML = function (number, suit) {
    return $("[data-minor-number=" + number + "][data-minor-suit=" + suit + "]");
}

setContext = function setContext (card, deck) {
    var $card = getMajorCardHTML(card.number), $slot,
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

// Assumption: we NEVER need to flip minor arcana. They are either in the
// draw or in the deck or in a hand or the collection and always either
// are face up all the time, or are face down all the time
flipMajorCard = function (card) {
    var $card = getMajorCardHTML(card.number);
    $card.toggleClass("face-up face-down");

    card.zone = SPREAD;
}

// flips major arcana and adds minor to the draw annex
showDraw = function showDraw (draw) {
    _.each(draw, function (card) {
        if (card.order === "major") {
            flipMajorCard(card);
        } else {
            var $card = getMinorCardHTML(card.number, card.suit);
            $card.remove();
            $draw.append($card);
            $card.show();
        }
    });
};

// removes children from the draw annex, and puts them in the deck
clearDraw = function clearDraw (deck) {
    var $children = $draw.children();

    _.each($children, function (child) {
        var $child = $(child),
            number = $child.data("minor-number"),
            suit = $child.data("minor-suit"),
            card = deck.getMinor(number, suit);

        card.zone = DECK;
        $child.remove();
        $("body").append($child);
    });
}

$(function () {
    var deck = new Deck(), draw, selectMajorArcana;

    $spread = $("[role=spread]");
    $context = $("[role=context]");
    $draw = $("[role=draw]");
    $collection = $("[role=collection]");

    // to start the game, we build the spread and then select the wheel
    buildSpread(deck);
    buildMinorArcana(deck);

    flipMajorCard(deck.getMajor(THE_WHEEL));

    $spread.on("click", ".card", function () {
        if (this.className === "card face-down") return false;

        var number = $(this).data("major-number"),
            card = deck.getMajor(number), draw;

        // the clicked arcana becomes the context, then we draw cards
        setContext(card, deck);

        // put the previous draw back in the deck if it is still up
        clearDraw(deck);
        draw = deck.drawCards(card);

        console.log(_.pluck(draw, "order"));
        console.log(deck.countMinor());

        showDraw(draw);

        // if only one major arcana is showing (the context) we must reveal the nameless arcana
        // TODO -- right now when we have chosen the nameless_arcana, it ends up being face up in the
        // context spot. Whatever we do, I'd like this game state to be identical to the initial
        // gamestate. Discuss having a mysterious face down arcana in the context at the beginning
        if ($(".card.face-up[data-major-number]").length === 1) {
            flipMajorCard(deck.getMajor(NAMELESS_ARCANA));
        }
    });

    $draw.on("click", ".card", function () {
        var $this = $(this),
            number = $this.data("minor-number"),
            suit = $this.data("minor-suit"),
            card = deck.getMinor(number, suit);

        card.zone = COLLECTION;
        $this.remove();
        $collection.append($this);
    });

    $collection.on("click", ".card", function () {
        var $this = $(this),
            number = $this.data("minor-number"),
            suit = $this.data("minor-suit"),
            card = deck.getMinor(number, suit);

        // select the card
        // TODO all "removing" of cards should go through a method
        // so that the select effect can be removed
    });
})
