var Model;
(function (Model) {
    var Deck = (function () {
        function Deck() {
            this.shuffle();
        }
        Deck.prototype.shuffle = function () {
            this.cards = new Array();
            var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
            var values = ["9", "10", "J", "Q", "K", "A"];
            for (var i = 0; i < suits.length; i++) {
                for (var j = 0; j < values.length; j++) {
                    var createdCard = new Card(suits[i], values[j]);
                    this.cards.push(createdCard);
                }
            }
            // actually shuffle the damn thing
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