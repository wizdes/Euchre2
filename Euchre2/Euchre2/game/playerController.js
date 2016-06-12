//controller
var Controller;
(function (Controller) {
    var PlayerController = (function () {
        function PlayerController() {
            this.cards = new Array();
        }
        PlayerController.prototype.addCard = function (c) {
            if (this.cards.length >= 5) {
                throw new Error("Too many cards. Can't add until you remove first.");
            }
            this.cards.push(c);
        };
        PlayerController.prototype.removeCard = function (c) {
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
        };
        return PlayerController;
    }());
    Controller.PlayerController = PlayerController;
})(Controller || (Controller = {}));
//# sourceMappingURL=playerController.js.map