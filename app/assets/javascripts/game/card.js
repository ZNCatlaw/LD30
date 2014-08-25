
var Card = (function () {

    return function Card (options) {
        _.defaults(options, {
            // note that this function looks silly now,
            // but later you will thank me
            draw_size: function () { return 3; },
            filter: function () { return true; },
            hub: false
        });

        // if this is a hub world, generate a rule for its hands
        // and create 4 empty hands with those rules attached to
        // this. Then the submit handler should just be checking
        // those

        return {
            name: options.name,
            number: options.number,
            brief: options.brief,
            description: options.description,
            zone: DECK,
            order: "major",
            draw_size: options.draw_size,
            filter: options.filter,
            init: options.init,
            submitHandler: options.submitHandler,
            submitPredicate: options.submitPredicate,
            hub: options.hub,
            hands: []
        };
    };
}()), defaultSubmitHandler, defaultSubmitPredicate, swapSelectedForOrder, shard_name, CARDS;

defaultSubmitHandler = function (deck) {
    // get all the selected cards
    var submitted = false,
        selection = _.filter(deck.cards, function (card) {
            return card.selected === true;
        });

    // compare them to the requirements
    if (this.submitPredicate(selection) === true) {
        var hand = selection;

        // remove and deselect these cards
        _.each(hand, function (card) {
            removeMinorCardHTML(card);
            card.zone = HAND;
        });

        // append all cards in this hand to the $hand

        this.hands.push(hand);
        submitted = true;
    } else {
        console.log("NOT VALID");
    }

    return submitted;
};

defaultSubmitPredicate = function (selection) {
    return selection.length === 3;
};

swapSelectedForOrder = function (order) {
    return function submitHander (deck) {
        // get all the selected cards
        var submitted = false, draw,
        selection = _.filter(deck.cards, function (card) {
            return card.selected === true;
        });

        if (selection.length > 0) {
            // remove and deselect these cards
            _.each(selection, function (card) {
                removeMinorCardHTML(card);
                card.zone = DECK;
            });

            draw = deck.drawCards({
                filter: function (card) {
                    return card.order === order;
                },
                draw_size: function () {
                    return selection.length;
                }
            });

            showDraw(draw);
            submitted = true;
        }

        return submitted;
    }
}

shard_name = "A Shard World";

CARDS = [
    new Card({
        name: "Le Mat",
        number: 0,
        brief: "A World of Potential",
        description: "Combine three Minor Arcana into a Hand, as long as they have nothing in common. Through the power of Hands, you shall reunite the Worlds.",
        hub: true,
        draw_size: function () { return 0; },
        submitHandler: defaultSubmitHandler,
        // all royal or all number
        submitPredicate: function (selection) {
            var unique_numbers = _.uniq(_.pluck(selection, "number")).length === 3,
                unique_suits = _.uniq(_.pluck(selection, "suit")).length === 3;

            return selection.length === 3 && (unique_numbers && unique_suits);
        }
    }),
    new Card({
        name: "Le Bateleur ",
        number: 1,
        brief: shard_name + " and A Source Of Power",
        description: "For every face up Major Arcana, a new Major Arcana is revealed.",
        draw_size: function () {
            return $spread.find(".card.face-up").length;
        },
        filter: function (card) {
            return card.order === "major";
        }
    }),
    new Card({
        name: "La Papesse",
        number: 2,
        brief: shard_name + " and A Source of Richness",
        description: "For every face up card, draw a Minor Arcana.",
        draw_size: function () {
            return $spread.find(".card.face-up").length + $collection.find(".card.face-up").length;
        },
        filter: function (card) {
            return card.order === "minor";
        }
    }),
    new Card({
        name: "L'Impératrice",
        number: 3,
        brief: shard_name + " and A Source of Possibility",
        description: "Select any number of face up Minor Arcana to discard them and draw new Minor Arcana.",
        draw_size: function () { return 0; },
        submitHandler: swapSelectedForOrder("minor")
    }),
    new Card({
        name: "L'Empereur",
        number: 4,
        brief: shard_name + " and A Source of Nobility",
        description: "Draw Minor Arcana until there are five Minor Arcana face up.",
        draw_size: function () {
            return (5 - $collection.find(".card.face-up").length);
        },
        filter: function (card) {
            return card.order === "minor";
        }
    }),
    new Card({
        name: "Le Pape",
        number: 5,
        brief: shard_name + " and A Source of Sanctity",
        description: "Discard all Minor Arcana, and draw a Minor Arcana for every face up Major Arcana.",
        draw_size: function (deck) {
            var collection = _.where(deck.cards, { zone: COLLECTION }),
                size = collection.length;

            _.each(collection, function (card) {
                removeMinorCardHTML(card);
            });

            return size;
        },
        filter: function (card) {
            return card.order === "major";
        }
    }),
    new Card({
        name: "L'Amoureux",
        number: 6,
        brief: shard_name + " and A Source of Emotion",
        description: "Reveal or draw five cards at random.",
        draw_size: function () { return 5; }
    }),
    new Card({
        name: "Le Chariot",
        number: 7,
        brief: shard_name + " and A Source of Achievement",
        description: "Select any number of face up Minor Arcana to discard them and reveal the same number of Major Arcana.",
        draw_size: function () { return 0; },
        submitHandler: swapSelectedForOrder("major")
    }),
    new Card({
        name: "La Justice",
        number: 8,
        brief: shard_name + " and A Source of Justice",
        description: "Discard all Minor Arcana, reveal or draw an equal number of cards at random.",
        draw_size: function (deck) {
            var collection = _.where(deck.cards, { zone: COLLECTION }),
                size = collection.length;

            _.each(collection, function (card) {
                removeMinorCardHTML(card);
            });

            return size;
        }
    }),
    new Card({
        name: "L'Hermite",
        number: 9,
        brief: "A World of Serenity",
        description: "If you have no Minor Arcana, you may form a Hand, though you may only do this once.  Afterwards, l'Hermite will reveal a Major Arcana. Through the power of Hands, you shall reunite the Worlds.",
        hub: true,
        draw_size: function () { return 0; },
        submitHandler: function (deck) {
            var submitted = defaultSubmitHandler.call(this, deck);

            // once the hermit has been used, it becomes the null arcana
            if (submitted === true) {
                this.submitHandler = function () { return false; };
                this.draw_size = function () { return 1; };
                $hands.find('.handbox:empty:first').append($('#nullhand').children());
                this.filter = function (card) {
                    return card.order === "major";
                };
            }

            return submitted;
        },
        submitPredicate: function (selection) {
            // collection and selection must be ZEMPTY

            return $collection.find('.card').length === 0 && selection.length === 0;
        }
    }),
    new Card({
        name: "La Roue de Fortune",
        number: 10,
        brief: "A World of Chaos",
        description: "Reveal five Major Arcana.",
        draw_size: function () { return 5; },
        filter: function (card) {
            return card.order === "major";
        }
    }),
    new Card({
        name: "La Force",
        number: 11,
        brief: "A World of Order",
        description: "Combine three Minor Arcana into a Hand, as long as they share the same suit. Through the power of Hands, you shall reunite the Worlds.",
        hub: true,
        draw_size: function () { return 0; },
        submitHandler: defaultSubmitHandler,
        submitPredicate: function (selection) {
            return selection.length === 3 && _.uniq(_.pluck(selection, "suit")).length === 1;
        }
    }),
    new Card({
        name: "Le Pendu",
        number: 12,
        brief: shard_name + " and a Source of Reversal",
        description: "Hide all face up Major Arcana, and reveal all face down Major Arcana.",
        draw_size: function (deck) {
            var spread = _.where(deck.cards, { zone: SPREAD }),
                deck = _.where(deck.cards, { zone: DECK, order: "major" });

            _.each(spread, function (card) {
                coverMajorCard(card);
            });

            _.each(deck, function (card) {
                flipMajorCard(card);
            });

            return 0;
        },
        filter: function (card) {
            return card.order === "major";
        }
    }),
    new Card({
        name: "L'Arcane sans nom",
        number: 13,
        brief: shard_name + " and a Source of Ending",
        description: "Hide all face up Major Arcana and discard all Minor Arcana.  Reveal La Roue de Fortune.",
        // put all cards back in the deck
        // unless those cards are part of hands
        filter: function (card) {
            return card.name === "La Roue de Fortune";
        },
        init: function (deck) {
            var $body = $("body");
            _.each(deck.cards, function (card) {
                // flip all face up arcana cards in the spread
                if (card.zone === SPREAD) {
                    var $card = getMajorCardHTML(card.number);
                    $card.removeClass("face-up");
                    $card.addClass("face-down");
                }

                // put all minor arcana back in the deck
                if (card.zone !== HAND) {
                    removeMinorCardHTML(card);
                }
            });
        }
    }),
    new Card({
        name: "Tempérance",
        number: 14 ,
        brief: shard_name + " and a Source of Transformation",
        description: "Select any number of face up Minor Arcana to transform. Cups change to Swords, Batons change to coins, and vice versa.",
        draw_size: function () { return 0; },
        submitHandler: function (deck) {
            // get all the selected cards
            var submitted = false, draw = [],
                selection = _.filter(deck.cards, function (card) {
                    return card.selected === true;
                });

            if (selection.length > 0) {
                // remove and deselect these cards
                _.each(selection, function (card) {
                    var suit = swapping_table[card.suit], replacement;

                    replacement = _.findWhere(deck.cards, { zone: DECK, number: card.number, suit: suit });

                    if (replacement != undefined) {
                        draw.push(replacement);
                    }

                    removeMinorCardHTML(card);
                    card.zone = DECK;
                });

                console.log(draw);
                showDraw(draw);
                submitted = true;
            }

            return submitted;
        }
    }),
    new Card({
        name: "Le Diable",
        number: 15,
        brief: shard_name + " and a Source of Bargain",
        description: "Hide all face up Major Arcana and discard all Minor Arcana, reveal or draw one less cards at random.",
        draw_size: function (deck) {
            var spread = _.where(deck.cards, { zone: SPREAD }),
                collection = _.where(deck.cards, { zone: COLLECTION }),
                size = Math.max(spread.length + collection.length - 1, 0);

            _.each(spread, function (card) {
                coverMajorCard(card);
            });

            _.each(collection, function (card) {
                removeMinorCardHTML(card);
            });

            return size;
        }
    }),
    new Card({
        name: "La Maison Dieu",
        number: 16,
        brief: shard_name + " and a Source of Change",
        description: "Hide all face up Major Arcana, and then reveal an equal number of Major Arcana.",
        draw_size: function (deck) {
            var spread = _.where(deck.cards, { zone: SPREAD }),
                size = spread.length;

            _.each(spread, function (card) {
                coverMajorCard(card);
            });

            return size;
        },
        filter: function (card) {
            return card.order === "major";
        }
    }),
    new Card({
        name: "L'Étoile",
        number: 17,
        brief: shard_name + " and a Source of Balance",
        description: "Draw three Minor Arcana.",
        draw_size: function () { return 3; },
        filter: function (card) {
            return card.order === "minor";
        }
    }),
    new Card({
        name: "La Lune",
        number: 18,
        brief: shard_name + " and a Source of Reception",
        description: "Draw three Minor Arcana, but only Cups and Coins.",
        draw_size: function () { return 3; },
        filter: function (card) {
            // cups and coins
            return card.suit === CUPS || card.suit === COINS;
        }
    }),
    new Card({
        name: "Le Soleil",
        number: 19,
        brief: shard_name + " and a Source of Action",
        description: "Draw three Minor Arcana, but only Batons and Swords.",
        draw_size: function () { return 3; },
        filter: function (card) {
            // swords and batons
            return card.suit === SWORDS || card.suit === BATONS;
        }
    }),
    new Card({
        name: "Le Jugement",
        number: 20,
        brief: "A World of Power",
        description: "Combine three Minor Arcana into a Hand, as long as they are all royal, or all numbered. Through the power of Hands, you shall reunite the Worlds.",
        hub: true,
        draw_size: function () { return 0; },
        submitHandler: defaultSubmitHandler,
        // all royal or all number
        submitPredicate: function (selection) {
            var all_royal = _.select(selection, function (card) { return card.number > 9; }).length === 3,
                all_number = _.select(selection, function (card) { return card.number <= 9; }).length === 3;

            return selection.length === 3 && (all_number || all_royal);
        }
    }),
    new Card({
        name: "Le Monde",
        number: 21,
        brief: "A World of Worlds, Once Whole",
        description: "This card may only be accessed from La Roue de Fortune. If you have formed four Hands, the Worlds shall be reunited.",
        draw_size: function () { return 0; },
        init: function (deck) {
            // count the number of hands in all hubs
            // if that is FOUR then you win
            var finished_hands = _.inject(deck.major, function (count, index) {
                card = deck.cards[index];
                if (card.hub === true) {
                    // count the number of hands
                    count += card.hands.length
                }

                return count;
            }, 0);

            if (finished_hands >= 4) {
                window.location = "http://parkhowell.com/wp-content/uploads/2011/02/Victory-Baby.jpg";
            }
        }
    })
];

