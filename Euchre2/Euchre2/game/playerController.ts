//controller
module Controller {
    export class PlayerController {
        cards: Model.Card[];

        constructor() {
            this.cards = new Array<Model.Card>();
        }

        addCard(c) {
            if (this.cards.length >= 5) {
                throw new Error("Too many cards. Can't add until you remove first.");
            }
            this.cards.push(c);
        }

        removeCard(c) {
            var indexToRemove = -1;

            for (var i = 0; i < this.cards.length; i++) {
                if (this.cards[i].cardValue == c.cardValue && this.cards[i].cardSuit == c.cardSuit) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove != -1) {
                this.cards.splice(indexToRemove, 1);
            }
        }

        numCardsOfSuit(potentialSuit: string) {
            var numElt = 0;
            for (var i = 0; i < this.cards.length; i++) {
                if (this.cards[i].cardSuit == potentialSuit) {
                    numElt++;
                }
            }

            return numElt;
        }
    }
}
