var ScreenView;
(function (ScreenView_1) {
    var CardView = (function () {
        function CardView(value, suit, posX, posY, imgObj) {
            this.value = value;
            this.suit = suit;
            this.x = posX;
            this.y = posY;
            this.imgObj = imgObj;
        }
        CardView.prototype.toMove = function () {
            if (this.moveToX !== this.x && this.moveToY !== this.y) {
                return true;
            }
            return false;
        };
        CardView.prototype.isOnBoard = function () {
            if (this.x < 0 && this.y < 0) {
                return false;
            }
            return true;
        };
        return CardView;
    }());
    var ScreenView = (function () {
        function ScreenView(game) {
            this.map = {};
            this.currentGame = game;
            var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
            var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
            for (var i = 0; i < suits.length; i++) {
                for (var j = 0; j < values.length; j++) {
                    var createdCardView = new CardView(values[j], suits[i], -1000, -1000, this.currentGame.add.sprite(-1000, -1000, suits[i] + '-' + values[j]));
                    this.cardViews.push(createdCardView);
                    this.map[suits[i] + '-' + values[j]] = createdCardView;
                }
            }
        }
        ScreenView.prototype.drawAt = function (x, y, suit, value, moveToX, moveToY) {
            var retrievedCardView = this.map[suit + '-' + value];
            retrievedCardView.x = x;
            retrievedCardView.y = y;
            retrievedCardView.moveToX = moveToX;
            retrievedCardView.moveToY = moveToY;
        };
        ScreenView.prototype.addMoveTo = function (suit, value, moveToX, moveToY) {
            //.body.x 
            var retrievedCardView = this.map[suit + '-' + value];
            retrievedCardView.moveToX = moveToX;
            retrievedCardView.moveToY = moveToY;
        };
        ScreenView.prototype.doMoveOperation = function () {
            for (var i = 0; i < this.cardViews.length; i++) {
                if (this.cardViews[i].toMove())
                    return true;
            }
            return false;
        };
        return ScreenView;
    }());
    ScreenView_1.ScreenView = ScreenView;
})(ScreenView || (ScreenView = {}));
//# sourceMappingURL=screenView.js.map