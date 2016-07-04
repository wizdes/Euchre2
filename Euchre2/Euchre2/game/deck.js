var Model;
(function (Model) {
    (function (Suit) {
        Suit[Suit["Hearts"] = 0] = "Hearts";
        Suit[Suit["Spades"] = 1] = "Spades";
        Suit[Suit["Clubs"] = 2] = "Clubs";
        Suit[Suit["Diamonds"] = 3] = "Diamonds";
        Suit[Suit["None"] = 4] = "None";
    })(Model.Suit || (Model.Suit = {}));
    var Suit = Model.Suit;
    var Deck = (function () {
        function Deck() {
            this.shuffle();
        }
        Deck.prototype.shuffle = function () {
            this.cards = new Array();
            var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
            var values = ["9", "10", "J", "Q", "K", "A"];
            var prefabDeck = new Array();
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
        };
        Deck.prototype.getNextCard = function () {
            if (this.cards.length > 0) {
                var card = this.cards[0];
                this.cards.splice(0, 1);
                return card;
            }
            else {
                return null;
            }
        };
        return Deck;
    }());
    Model.Deck = Deck;
    var Card = (function () {
        function Card(cardSuit, cardValue) {
            this.cardSuit = cardSuit;
            this.cardValue = cardValue;
        }
        return Card;
    }());
    Model.Card = Card;
})(Model || (Model = {}));
//# sourceMappingURL=deck.js.map