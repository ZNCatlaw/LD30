// globals for elements in the layout
var $spread, $context, $draw, $collection, $submit, $hands, $modal, $overlay, $infobox, $home,
    setContext, drawCards, getElementByCardNumber, selectMajorArcana, dismissModal,
    DECK = 0, CONTEXT = 1, DRAW = 2, SPREAD = 3, HAND = 4, COLLECTION = 5,
    MINOR = 56, MAJOR = 22, WEIGHTS = 14,
    THE_WHEEL = 10, NAMELESS_ARCANA = 13, THE_WORLD = 21;

getMajorCardHTML = function (number) {
    return $("#major-" + number);
}

getMinorCardHTML = function (number, suit) {
    return $("#minor-" + suit + "-" + number);
}

removeMinorCardHTML = function (card) {
    var $card = getMinorCardHTML(card.number, card.suit);

    card.zone = DECK;
    card.selected = false;
    $card.parent().removeClass("selected");
    $card.remove();
    $minor_store.append($card);
}

setContext = function setContext (card, deck) {
    var $card = getMajorCardHTML(card.number), $slot,
        $old = $context.find('.card'), callbacks;

    if ($old.length > 0) {
        var number = $old.data("major-number"),
            old = deck.getMajor(number);

        $slot = $("#spread-slot-" + number);
        $old.toggleClass("face-up face-down");
        $old.remove();
        old.zone = DECK;

        $slot.append($old);
    }

    $card.remove();
    $context.find('.cardbox').append($card);
    card.zone = CONTEXT;

    // TODO update the submit callback
    if (card.submitHandler === undefined) {
        $submit.addClass('hidden')
    } else {
        $submit.removeClass('hidden')
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

setBackground = function setBackground(card){
  var number = card.number,
      $active = $bg.find('.active'),
      $target;
  if(number === 0){
    $target = $bg.find('.bg-0');
  }else if(number === 9){
    $target = $bg.find('.bg-9');
  }else if(number === 10){
    $target = $bg.find('.bg-10');
  }else if(number === 11){
    $target = $bg.find('.bg-11');
  }else if(number === 13){
    $target = $bg.find('.bg-13');
  }else if(number === 20){
    $target = $bg.find('.bg-20');
  }else if(number === 21){
    $target = $bg.find('.bg-21');
  }else{
    $target = $bg.find('.bg');
  }

  if($active[0] !== $target[0]){
    $active.removeClass('active').fadeOut(3000);
    $target.hide().addClass('active').removeClass('hidden').fadeIn(1500);
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

coverMajorCard = function (card) {
    var $card = getMajorCardHTML(card.number);
    $card.toggleClass("face-up face-down");

    card.zone = DECK;
}

// flips major arcana and adds minor to the draw annex
showDraw = function showDraw (draw) {
    _.each(draw, function (card) {
        if (card.order === "major") {
            flipMajorCard(card);
        } else {
            var $card = getMinorCardHTML(card.number, card.suit);
            $card.remove();
            $draw.find('.cardbox:empty:first').append($card);
            $card.show();
        }
    });
};

// removes children from the draw annex, and puts them in the deck
clearDraw = function clearDraw (deck) {
    var $children = $draw.find('.cardbox:not(#deck)').children();

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
    var draw, spread;

    // the clicked arcana becomes the context, then we draw cards
    setContext(card, deck);
    setBackground(card); //potentially changes the page background

    // put the previous draw back in the deck if it is still up
    clearDraw(deck);
    clearSelect(deck);
    draw = deck.drawCards(card);

    showDraw(draw);

    // if only one major arcana is showing (the context) we must reveal the nameless arcana
    // TODO -- right now when we have chosen the nameless_arcana, it ends up being face up in the
    // context spot. Whatever we do, I'd like this game state to be identical to the initial
    // gamestate. Discuss having a mysterious face down arcana in the context at the beginning
    spread = _.where(deck.cards, { order: "major", zone: SPREAD });

    if (spread.length === 0 || (spread.length === 1 && spread[0].number === THE_WORLD)) {
        flipMajorCard(deck.getMajor(NAMELESS_ARCANA));
    }
};

$(function () {
    var deck = new Deck(), draw;

    $bg = $("#background-images");
    $spread = $("#spread");
    $context = $("#context");
    $draw = $("#draw");
    $collection = $("#collection");
    $submit = $("#submit");
    $hands = $("#hands");
    $overlay = $("#overlay");
    $modal = $("#modal");
    $infobox = $modal.find(".infobox");
    $minor_store = $("#minor-store");
    $cardbox_template = $($("script[role=cardbox]").html());

    // to start the game, we build the spread and then select the wheel
    buildSpread(deck);
    buildMinorArcana(deck);

    // to begin with, the world is selected
    flipMajorCard(deck.getMajor(THE_WORLD));
    selectMajorArcana(deck.getMajor(THE_WORLD), deck);

    $spread.on("click", ".card", function () {
        if (this.className === "card face-down") return false;

        var $card = $(this),
            number = $card.data("major-number"),
            card = deck.getMajor(number);

        $home = $card.parent();
        $modal.find(".cardbox").append($card);

        $infobox.find(".title").text(card.name);
        $infobox.find(".subtitle").text(card.brief);
        $infobox.find(".description").text(card.description);

        $modal.show();
        $overlay.show();
    });

    $context.on("click", ".card", function () {
        var $card = $(this),
            number = $card.data("major-number"),
            card = deck.getMajor(number);

        $home = $card.parent();
        $modal.find(".cardbox").append($card);

        $infobox.find(".title").text(card.name);
        $infobox.find(".subtitle").text(card.brief);
        $infobox.find(".description").text(card.description);

        $modal.show();
        $overlay.show();
    });

    dismissModal = function () {
        var $card = $modal.find(".card"),
            number = $card.data("major-number"),
            card = deck.getMajor(number);

        $card.remove();

        $home.append($card);
        $modal.hide();
        $overlay.hide();
    };

    $overlay.on("click", dismissModal);
    $modal.on("click", dismissModal);

    $modal.on("click", ".card", function () {
        var number = $(this).data("major-number"),
            card = deck.getMajor(number), draw, context;

        // if this is the context card, just dismiss
        if (card.zone === CONTEXT) return dismissModal();

        // if the number is THE WORLD, then the context must be THE WHEEL
        // or we ignore the click
        if (number === THE_WORLD && $context.find(".card").data("major-number") !== THE_WHEEL) {
            return false;
        }

        selectMajorArcana(card, deck);
        $modal.hide();
        $overlay.hide();
    });

    $draw.on("click", ".card", function () {
        var $this, number, suit, card;

        if (_.where(deck.cards, { zone: COLLECTION }).length > 4) return false;

        $this = $(this),
        number = $this.data("minor-number"),
        suit = $this.data("minor-suit"),
        card = deck.getMinor(number, suit);

        card.zone = COLLECTION;
        $this.remove();
        $collection.find('.cardbox:empty:first').append($this);
    });

    $collection.on("click", ".card", function () {
        var $this = $(this),
            number = $this.data("minor-number"),
            suit = $this.data("minor-suit"),
            card = deck.getMinor(number, suit);

        $this.parent().toggleClass("selected");
        card.selected = (card.selected === true)? false : true;
    });

    $submit.on("click", function () {
        var $card = $context.find('.card'),
            number = $card.data("major-number"),
            card = deck.getMajor(number);

        if (card.hands.length < 4 && card.submitHandler(deck)) {
            $submit.addClass('hidden');

            // add the most recent hand to the hands annex
            // (which we assume is visible)
            var $container = $hands.find('.handbox:empty:first')
                hand = _.last(card.hands);

            _.each(hand, function (card, index) {
                var $cardbox = $cardbox_template.clone(),
                    $card = getMinorCardHTML(card.number, card.suit);

                $card.remove();
                card.zone = HAND;

                $cardbox.append($card);
                $container.append($cardbox);
            });
        }
    });
})
