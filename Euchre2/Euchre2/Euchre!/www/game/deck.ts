module Model {
    export enum Suit {
        Hearts,
        Spades,
        Clubs,
        Diamonds,
        None
    }

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

            // test, with a default list of cards
            //this.cards = new Array<Card>();
            //this.cards.push(new Card("Spades", "J"));
            //this.cards.push(new Card("Hearts", "10"));
            //this.cards.push(new Card("Clubs", "Q"));
            //this.cards.push(new Card("Diamonds", "9"));

            //this.cards.push(new Card("Diamonds", "10"));
            //this.cards.push(new Card("Spades", "A"));
            //this.cards.push(new Card("Hearts", "J"));
            //this.cards.push(new Card("Clubs", "9"));

            //this.cards.push(new Card("Clubs", "A"));
            //this.cards.push(new Card("Diamonds", "K"));
            //this.cards.push(new Card("Spades", "9"));
            //this.cards.push(new Card("Spades", "K"));

            //this.cards.push(new Card("Hearts", "9"));
            //this.cards.push(new Card("Diamonds", "J"));
            //this.cards.push(new Card("Hearts", "K"));
            //this.cards.push(new Card("Spades", "10"));

            //this.cards.push(new Card("Clubs", "K"));
            //this.cards.push(new Card("Spades", "Q"));
            //this.cards.push(new Card("Clubs", "10"));
            //this.cards.push(new Card("Clubs", "J"));

            //this.cards.push(new Card("Hearts", "Q"));
            //this.cards.push(new Card("Diamonds", "Q"));
            //this.cards.push(new Card("Diamonds", "A"));
            //this.cards.push(new Card("Hearts", "A"));

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