module ScreenView {

    class CardView {
        value: string;
        suit: string;
        x: number;
        y: number;
        moveToX: number;
        moveToY: number;
        imgObj;

        constructor(value, suit, posX, posY, imgObj) {
            this.value = value;
            this.suit = suit;
            this.x = posX;
            this.y = posY;
            this.imgObj = imgObj;
        }

        toMove() {
            if (this.moveToX !== this.x && this.moveToY !== this.y) {
                return true;
            }

            return false;
        }

        isOnBoard() {
            if (this.x < 0 && this.y < 0) {
                return false;
            }

            return true;
        }
    }

    export class ScreenView {
        currentGame;
        private cardViews: CardView[];
        private map: { [key: string]: CardView; } = {};

        constructor(game) {
            this.currentGame = game;

            var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
            var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

            for (var i = 0; i < suits.length; i++) {
                for (var j = 0; j < values.length; j++) {
                    var createdCardView = new CardView(
                        values[j], suits[i], -1000, -1000, this.currentGame.add.sprite(-1000, -1000, suits[i] + '-' + values[j]));
                    this.cardViews.push(createdCardView);
                    this.map[suits[i] + '-' + values[j]] = createdCardView;
                }
            }
        }

        drawAt(x, y, suit, value, moveToX, moveToY) {
            var retrievedCardView = this.map[suit + '-' + value];
            retrievedCardView.x = x;
            retrievedCardView.y = y;
            retrievedCardView.moveToX = moveToX;
            retrievedCardView.moveToY = moveToY;
        }

        addMoveTo(suit, value, moveToX, moveToY) {
            //.body.x 
            var retrievedCardView = this.map[suit + '-' + value];
            retrievedCardView.moveToX = moveToX;
            retrievedCardView.moveToY = moveToY;
        }

        doMoveOperation() {
            for (var i = 0; i < this.cardViews.length; i++) {
                if (this.cardViews[i].toMove()) return true;
            }

            return false;
        }
    }

}

