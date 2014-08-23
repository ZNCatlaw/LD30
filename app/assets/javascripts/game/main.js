// globals for elements in the layout
var $spread;

$(function () {
    var deck = new Deck();

    $spread = $("[role=spread]");

    buildSpread(deck.major);

})
