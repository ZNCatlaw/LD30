// globals for elements in the layout
var $spread, $context, $draw, $collection, $submit, $hands,
    setContext, drawCards, getElementByCardNumber, selectMajorArcana,
    DECK = 0, CONTEXT = 1, DRAW = 2, SPREAD = 3, HAND = 4, COLLECTION = 5,
    MINOR = 56, MAJOR = 22, WEIGHTS = 14,
    THE_WHEEL = 10, NAMELESS_ARCANA = 13, THE_WORLD = 21;

getMajorCardHTML = function (number) {
    return $("[data-major-number=" + number + "]");
}

getMinorCardHTML = function (number, suit) {
    return $("[data-minor-number=" + number + "][data-minor-suit=" + suit + "]");
}

removeMinorCardHTML = function (card) {
    var $child = getMinorCardHTML(card.number, card.suit);

    card.zone = DECK;
    card.selected = false;
    $child.remove();
    $child.hide();
    $child.removeClass("selected");
    $("body").append($child);
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
    if (card.submitHandler === undefined) {
        $submit.hide();
    } else {
        $submit.show();
    }

    if (card.init != null) {
        card.init(deck);
    }

    // if this is a hub world, hide the $draw and build the $hand
    if (card.hub === true) {
        $draw.hide();
        $hands.show();

    } else {
        $hands.hide();
        $draw.show();
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
    var $children = $draw.children(),
        $body = $("body");

    _.each($children, function (child) {
        var $child = $(child),
            number = $child.data("minor-number"),
            suit = $child.data("minor-suit"),
            card = deck.getMinor(number, suit);

        removeMinorCardHTML(card);
    });
};

clearSelect = function clearSelect (deck) {
    _.each(deck.minor, function (number) {
        var card = deck.cards[number];

        card.selected = false;
        getMinorCardHTML(card.number, card.suit).removeClass("selected");
    });
};

selectMajorArcana = function (card, deck) {
    var draw;

    // the clicked arcana becomes the context, then we draw cards
    setContext(card, deck);

    // put the previous draw back in the deck if it is still up
    clearDraw(deck);
    clearSelect(deck);
    draw = deck.drawCards(card);

    console.log("draw:", _.pluck(draw, "order"));
    console.log("remaining:", deck.countMinor());

    showDraw(draw);

    // if only one major arcana is showing (the context) we must reveal the nameless arcana
    // TODO -- right now when we have chosen the nameless_arcana, it ends up being face up in the
    // context spot. Whatever we do, I'd like this game state to be identical to the initial
    // gamestate. Discuss having a mysterious face down arcana in the context at the beginning
    if ($(".card.face-up[data-major-number]").length === 1) {
        flipMajorCard(deck.getMajor(NAMELESS_ARCANA));
    }
};

$(function () {
    var deck = new Deck(), draw;

    $spread = $("[role=spread]");
    $context = $("[role=context]");
    $draw = $("[role=draw]");
    $collection = $("[role=collection]");
    $submit = $("[role=submit]");
    $hands = $("[role=hands]");

    // to start the game, we build the spread and then select the wheel
    buildSpread(deck);
    buildMinorArcana(deck);

    // to begin with, the world is selected
    flipMajorCard(deck.getMajor(THE_WORLD));
    selectMajorArcana(deck.getMajor(THE_WORLD), deck);

    $spread.on("click", ".card", function () {
        if (this.className === "card face-down") return false;

        var number = $(this).data("major-number"),
            card = deck.getMajor(number), draw;

        // if the number is THE WORLD, then the context must be THE WHEEL
        // or we ignore the click

        selectMajorArcana(card, deck);
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
        $this.toggleClass("selected");
        card.selected = (card.selected === true)? false : true;

        // TODO all "removing" of cards should go through a method
        // so that the select effect can be removed
    });

    $submit.on("click", function () {
        var $card = $context.children(),
            number = $card.data("major-number"),
            card = deck.getMajor(number);

        if (card.hands.length < 4 && card.submitHandler(deck)) {
            $submit.hide();

            // add the most recent hand to the hands annex
            // (which we assume is visible)
            var $container = $("<div class='relative'>"), width, height,
                hand = _.last(card.hands);

            $container.addClass("col-md-3 red-border full-height");
            $hands.append($container);
            width = $container.outerWidth();

            _.each(hand, function (card, index) {
                var $card = getMinorCardHTML(card.number, card.suit),
                    card_w = $card.width(),

                    // each of the 4 containers contains n cards
                    // so when we stack them we have to slide each one over
                    offset_w = (width - card_w)/(hand.length - 1);

                $card.remove();
                $card.show();

                $container.append($card);

                $card.addClass("absolute");
                $card.css({ left: offset_w*index });
            });
        }
    });
})
