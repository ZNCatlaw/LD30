NEXTSTEPS
---------

#### MVP ####

[ ] build a layout in javascript for the board itself
  [ ] The Spread
  [ ] The Collection
  [ ] The Context
  [ ] The Modal Area
  [ ] Deck & Draw
  [ ] Hands

[ ] basic flow
  [ ] clicking an arcana changes the context
    [ ] changing the context changes the submit callback
    [ ] changing the context may run some code (eg, death puts all major arcana back in the deck)
    [ ] changing the context adds a callback to the draw verb
    [ ] changing the context draws a number of cards
  [ ] clicking cards in the draw collects them
  [ ] clicking cards in hand selects them
  [ ] Hub worlds present the hand slots
    [ ] clicking submit moves them to the slots
  [ ] when there are no arcana revealed, death is revealed
    [ ] death covers all cards, and then reveals

[ ] initially restrict the deck:
  [ ] hub worlds
  [ ] the wheel
  [ ] the world
  [ ] death
  [ ] l'etoile draw three minor arcana

#### DECK ####

- need to be able to draw a random card from the deck
  - if it is an arcana, we should flip the corresponding card in the spread
- need to perform selects on the deck
- the deck always contains 78 objects,
  - a flag marks their "zone" whether collection, hand, context, draw, or deck
  - we can do selects by zone
- to build a draw, we
  - select by inDeck
  - make two piles by some criteria
  - randomly choose one of the piles
  - randomly choose a card in a pile
- might be good to do "maps" where the card's index is the result,
  so when we do "inDeck" we get back an array of indexes into the deck
  rather than card objects
- deck.major and deck.minor can then just be indexes into deck.cards

