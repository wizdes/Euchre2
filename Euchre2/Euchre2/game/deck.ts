module Model {
    export class Deck {
        cards: Card[];

        constructor() {
            this.shuffle();
        }

        shuffle() {
            this.cards = new Array<Card>();
            var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
            var values = ["9", "10", "J", "Q", "K", "A"];

            var prefabDeck = new Array<Card>();

            for (var i = 0; i < suits.length; i++) {
                for (var j = 0; j < values.length; j++) {
                    var createdCard = new Card(suits[i], values[j]);
                    prefabDeck.push(createdCard);
                }
            }

            // actually shuffle the damn thing
            var index = 24;
            while (index > 0) {
                var selectedCardIndex = Math.floor(Math.random() * index);
                this.cards.push(prefabDeck[selectedCardIndex]);
                prefabDeck.splice(selectedCardIndex, 1);
                index--;
            }
        }

        getNextCard() {
            if (this.cards.length > 0) {
                var card = this.cards[0];
                this.cards.splice(0, 1);
                return card;
            } else {
                return null;
            }
        }
    }

    export class Card {
        cardValue: string;
        cardSuit: string;

        constructor(cardSuit, cardValue) {
            this.cardSuit = cardSuit;
            this.cardValue = cardValue;
        }
    }
}