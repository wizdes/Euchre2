module ScreenView {
    var hiddenCardsLogic = true;

    class SignButtonView {
        currentGame;
        ActionImgObj;
        PickupOrPass;
        PickClubs;
        PickSpades;
        PickHearts;
        PickDiamonds;
        Pickup;
        Pass;
        constructor(game) {
            this.currentGame = game;
        }

        ShowActionTitle() {
            this.PickupOrPass = this.currentGame.add.text(300, 400, 'Pick up card', { font: '30px dimboregular', fill: '#000' });
        }

        ShowPickupOrPass() {
            this.Pickup = this.currentGame.add.text(300, 1000, 'Pick up', { font: '30px dimboregular', fill: '#000' });
            this.Pickup.inputEnabled = true;
            this.Pickup.events.onInputDown.add(function (event) {
                console.log("asdfasdf");
                window.alert(42);
            });
            this.Pass = this.currentGame.add.text(600, 1000, 'Pass', { font: '30px dimboregular', fill: '#000' });
            this.Pass.inputEnabled = true;
            this.Pass.events.onInputDown.add(function (event) {
                console.log("asdfasdf");
                window.alert(43);
                
            });
        }
    }

    class CardView {
        value: string;
        suit: string;
        x: number;
        y: number;
        moveToX: number;
        moveToY: number;
        imgObj;
        hiddenImgObj;
        isHidden: boolean;

        constructor(value, suit, posX, posY, imgObj, hiddenImgObj) {
            this.value = value;
            this.suit = suit;
            this.x = posX;
            this.y = posY;
            this.moveToX = posX;
            this.moveToY = posY;
            this.imgObj = imgObj;
            this.hiddenImgObj = hiddenImgObj;
            this.isHidden = false;
        }

        toMove() {
            if (this.moveToX !== this.x || this.moveToY !== this.y) {
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

    class PlayerView {
        private numCards: number;
        private moveX: number;
        private moveY: number;
        initX: number;
        initY: number;

        constructor(numPlayer) {
            this.numCards = 0;
            this.moveX = 0;
            this.moveY = 0;
            switch(numPlayer) {
                case 0:
                    this.initX = 80;
                    this.initY = 1300;
                    this.moveX = 150;
                    break;
                case 1:
                    this.initX = 80;
                    this.initY = 250;
                    this.moveY = 200;
                    break;
                case 2:
                    this.initX = 80;
                    this.initY = 50;
                    this.moveX = 150;
                    break;
                case 3:
                    this.initX = 680;
                    this.initY = 250;
                    this.moveY = 200;
                    break;
                default:
                    break;
            }
        }

        addCard() {
            this.numCards++;
        }

        removeCard() {
            this.numCards--;
        }

        finalX() {
            if (this.numCards == 0) return -1;
            return this.initX + (this.numCards - 1) * this.moveX;
        }

        finalY() {
            if (this.numCards == 0) return -1;
            return this.initY + (this.numCards - 1) * this.moveY;
        }      
    }

    export class ScreenView {
        private moveSpeed: number;
        currentGame;
        private cardViews: CardView[];
        private hiddenCardViews: CardView[];
        private map: { [key: string]: CardView; } = {};
        private players: PlayerView[];
        private signView: SignButtonView;

        constructor(game) {
            this.currentGame = game;
            this.moveSpeed = 50;
            this.cardViews = new Array<CardView>();
            this.hiddenCardViews = new Array<CardView>();
            this.map = {};
            this.players = new Array<PlayerView>();
            this.signView = new SignButtonView(this.currentGame);

            for (var i = 0; i < 4; i++) {
                this.players.push(new PlayerView(i));
            }

            var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
            var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

            for (var i = 0; i < suits.length; i++) {
                for (var j = 0; j < values.length; j++) {
                    var createdCardView = new CardView(
                        values[j],
                        suits[i],
                        -1000,
                        -1000,
                        this.currentGame.add.sprite(-1000, -1000, suits[i] + '-' + values[j]),
                        this.currentGame.add.sprite(-1000, -1000, "cardBack"));
                    this.cardViews.push(createdCardView);
                    this.map[suits[i] + '-' + values[j]] = createdCardView;
                }
            }
        }

        drawAt(x, y, suit, value, moveToX, moveToY, hidden) {
            var retrievedCardView = this.map[suit + '-' + value];
            retrievedCardView.x = x;
            retrievedCardView.y = y;
            retrievedCardView.moveToX = moveToX;
            retrievedCardView.moveToY = moveToY;
            retrievedCardView.isHidden = hidden;

            if (hidden) {
                retrievedCardView.hiddenImgObj.x = x;
                retrievedCardView.hiddenImgObj.y = y;
            } else {
                retrievedCardView.imgObj.x = x;
                retrievedCardView.imgObj.y = y;                
            }
        }

        addMoveTo(suit, value, moveToX, moveToY, hidden) {
            var retrievedCardView = this.map[suit + '-' + value];
            retrievedCardView.moveToX = moveToX;
            retrievedCardView.moveToY = moveToY;

            retrievedCardView.isHidden = hidden;
        }

        shouldMove() {
            for (var i = 0; i < this.cardViews.length; i++) {
                if (this.cardViews[i].toMove()) return true;
            }

            return false;
        }

        abs(val) {
            if (val < 0) return -1 * val;
            return val;
        }

        resolveAction(action) {
            var actionElements = action.actionName.split("-");
            if (actionElements[0] == "Move") {
                var initX = -1;
                var initY = -1;
                var finalX = -1;
                var finalY = -1;
                var hidden = false;

                if (actionElements[1] == "Deck") {
                    initX = 400;
                    initY = 300;
                }

                if (actionElements[2].indexOf("Player") != -1) {
                    var playerNum = Number(actionElements[2].substr(actionElements[2].length - 1)) - 1;
                    if (playerNum != 0) {
                        hidden = hiddenCardsLogic;
                    }
                    this.players[playerNum].addCard();
                    finalX = this.players[playerNum].finalX();
                    finalY = this.players[playerNum].finalY();
                }
                else if (actionElements[2].indexOf("Center") != -1) {
                    finalX = 370;
                    finalY = 710;
                }

                this.drawAt(initX, initY, action.cardSuit, action.cardValue, finalX, finalY, hidden);
            }
            else if (actionElements[0] == "Show") {
                //Show-SelectCardTrump
                if (actionElements[1] == "SelectCardTrump") {
                    this.signView.ShowActionTitle();
                    this.signView.ShowPickupOrPass();
                }
            }
        }

        doMoveOperation() {
            for (var i = 0; i < this.cardViews.length; i++) {
                if (this.cardViews[i].toMove()) {
                    var xMove = this.moveSpeed;
                    if (this.cardViews[i].moveToX < this.cardViews[i].x) xMove = -1 * this.moveSpeed;
                    var yMove = this.moveSpeed;
                    if (this.cardViews[i].moveToY < this.cardViews[i].y) yMove = -1 * this.moveSpeed;

                    if (this.abs(this.cardViews[i].moveToX - this.cardViews[i].x) < this.moveSpeed) {
                        xMove = this.cardViews[i].moveToX - this.cardViews[i].x;
                    }
                    if (this.abs(this.cardViews[i].moveToY - this.cardViews[i].y) < this.moveSpeed) {
                        yMove = this.cardViews[i].moveToY - this.cardViews[i].y;
                    }

                    this.cardViews[i].x += xMove;
                    this.cardViews[i].y += yMove;

                    if (this.cardViews[i].isHidden) {
                        this.cardViews[i].hiddenImgObj.x = this.cardViews[i].x;
                        this.cardViews[i].hiddenImgObj.y = this.cardViews[i].y;
                    } else {
                        this.cardViews[i].imgObj.x = this.cardViews[i].x;
                        this.cardViews[i].imgObj.y = this.cardViews[i].y;
                    }
                }
            }

            return false;            
        }
    }

}

