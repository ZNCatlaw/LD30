LD30 -- Connected Worlds
------------------------

The 30th Ludum Dare. Something about Tarot cards.

There is an infinity spread on the table, and a place for your collection of up to seven cards at the bottom. At the top of the table there is a spot for the "context card" (world) and a modal area. The modal area either houses the deck and the draw (three face up cards that have been "drawn" in the current world), or the hands that have been submitted for the current world. Next to your collection of cards there is a modal submit button. The modal elements are available when the current world is one of the 4 hub worlds (see below).

The infinity spread is made up of 21 major arcana. In the center are "The World" and "The Wheel of Fortune", next to them there are 4 arcana representing the 4 hub worlds. The remaining 16 arcana are separated into to loops of 8 cards. Some of the cards begin face up, and some face down.

Clicking a face up major arcana card brings it to the fore. The player can then choose to "travel" to that world, setting it as the current context. When a major arcana is the current context it is missing from the spread. When the player travels to a new world, the current context card returns to the deck.

When the player travels to a new world, if that world is not a hub world, a draw of 3 cards is pulled from the deck according to that world's rules. When the three cards are drawn, two things can happen. If the card that would be drawn is a minor arcana, it moves from the deck and fills a spot in the draw. If the card drawn is a major arcana, the corresponding card in the spread turns face up. The player can click cards in the draw to move them to her collection.

When the player travels to a hub world, the deck is replaced by 4 slots which can either be empty, or contain "hands" of cards already completed for that world.

The two major arcana at the center of the spread are peculiar. The Wheel of Fortune is the starting context, and begins as the context card. When the world is The Wheel, the draw will always contain only major arcana. The World is the card under the wheel of fortune, and when it is the contect card the game ends if the player has built a sufficient number of hands (otherwise The World is spent and play continues). In order to travel to The World, the player must _always_ first travel to The Wheel.

#### Objects ####

- [ ] The Context Card
- [ ] Major Arcana
- [ ] Minor Arcana

#### Zones ####

- [ ] Collection
- [ ] Deck
- [ ] Spread
- [ ] World
- [ ] Draw (contains up to three cards)
- [ ] Hands (for each world)
