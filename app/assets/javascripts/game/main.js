// globals for elements in the layout
var $spread, $context, $draw, $collection, $submit, $hands, $modal, $overlay, $infobox, $home,
    setContext, drawCards, getElementByCardNumber, selectMajorArcana, dismissModal, setTheHand,
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

    if (card.init != null) {
        card.init(deck);
    }
}

setTheHand = function setTheHand(card) {
    var $active = $the_hand.filter('.active'),
        $submit_cardbox = $submit.find('.cardbox'),
        $target;

    // assume the hand is null
    $target = $the_hand.filter('.null');
    $submit_cardbox.addClass('noninteractive');

    // if, however, there is a card, then we choose a
    // facing for the hand
    if (card !== null) {
        $submit_cardbox.removeClass('noninteractive');

        //show the correct hand button
        if (card === 'hub' || card.hub === true) {
            $target = $the_hand.filter('.down');
        } else if (card === 'send' || card.submitHandler !== undefined){
            $target = $the_hand.filter('.left');
        } else if (card === 'collect' || $draw.find('.card').length) {
            $target = $the_hand.filter('.right');
        } else {
            $submit_cardbox.addClass('noninteractive');
        }
    }

    if($active[0] !== $target[0]){
        $active.removeClass('active').css('opacity', 0);
        $target.addClass('active').css('opacity', 1);
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
    $active.removeClass('active').css('opacity', 0);
    $target.addClass('active').css('opacity', 1);
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
        getMinorCardHTML(card.number, card.suit).parent().removeClass("selected");
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

    setTheHand(card);

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
    $the_hand = $submit.find(".thehand");
    $cardbox_template = $($("script[role=cardbox]").html());
    $wrapper_template = $($("script[role=wrapper]").html());

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
            card = deck.getMajor(number),
            $modal_cardbox = $modal.find(".cardbox");

        $home = $card.parent();
        if (card.zone === CONTEXT) {
            $modal_cardbox.addClass('noninteractive');
        }
        $modal_cardbox.append($card);


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
        $modal.find(".cardbox").removeClass('noninteractive');
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

    $collection.on("click", ".card:not(.thehand)", function () {
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

        if ($submit.find(".noninteractive").length === 0 && card.submitHandler && card.submitHandler(deck)) {
            // add the most recent hand to the hands annex
            // (which we assume is visible)
            var $container = $wrapper_template.clone(),
                $handbox = $hands.find('.handbox:empty:first')
                hand = _.last(card.hands);

            _.each(hand, function (card, index) {
                var $cardbox = $cardbox_template.clone(),
                    $card = getMinorCardHTML(card.number, card.suit);

                $card.remove();
                card.zone = HAND;

                $cardbox.append($card);
                $container.append($cardbox);
            });

            // this appends the new hand to the hand container, and
            // ensures that the cards inside are non-interactive
            if ($container.children().length > 0) {
                $handbox.append($container.addClass('noninteractive'));
            }

            // once the submit handler has run succesfully, we don't want it
            // to be able to run again. So we send in a null object
            setTheHand(null);

        } else if (card.submitHandler === undefined) {
            // Pull all draw cards into the collection if possible
            var $draw_cards = $draw.find('.card'),
                $coll_slots = $collection.find('.cardbox'),
                $coll_cards = $collection.find('.card');
            if ($coll_slots.length - $coll_cards.length >= $draw_cards.length) {
                $draw_cards.each(function() { $(this).click(); });
            }
        }
    });
});

$(window).load(function(){
    $("#container").css('opacity', 1);
});
