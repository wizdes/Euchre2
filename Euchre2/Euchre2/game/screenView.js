var ScreenView;
(function (ScreenView_1) {
    var hiddenCardsLogic = true;
    var SignButtonView = (function () {
        function SignButtonView(game) {
            this.currentGame = game;
        }
        SignButtonView.prototype.Clear = function () {
            if (this.Pickup != null)
                this.Pickup.destroy();
            if (this.Pass != null)
                this.Pass.destroy();
            if (this.Choose != null)
                this.Choose.destroy();
            if (this.Spades != null)
                this.Spades.destroy();
            if (this.Hearts != null)
                this.Hearts.destroy();
            if (this.Diamonds != null)
                this.Diamonds.destroy();
            if (this.Clubs != null)
                this.Clubs.destroy();
        };
        SignButtonView.prototype.ShowHud = function () {
            this.HudBar = this.currentGame.add.sprite(0, 0, 'black');
            this.HudBar.alpha = 0.2;
            this.HudBar.width = 900;
            this.HudBar.height = 50;
        };
        SignButtonView.prototype.ShowMessageBoard = function () {
            this.HudBar = this.currentGame.add.sprite(0, 50, 'black');
            this.HudBar.alpha = 0.1;
            this.HudBar.width = 900;
            this.HudBar.height = 50;
        };
        SignButtonView.prototype.ShowActionTitle = function (text) {
            if (this.ActionImgObj != null)
                this.ActionImgObj.destroy();
            this.ActionImgObj = this.currentGame.add.text(2, 5, text, { font: '30px dimboregular', fill: '#000' });
        };
        SignButtonView.prototype.ShowMessageText = function (text) {
            if (this.MessageTextObj != null)
                this.MessageTextObj.destroy();
            this.MessageTextObj = this.currentGame.add.text(2, 55, text, { font: '30px dimboregular', fill: '#000' });
        };
        SignButtonView.prototype.ShowPoints = function (text) {
            if (this.PointObj != null)
                this.PointObj.destroy();
            this.PointObj = this.currentGame.add.text(600, 5, text, { font: '30px dimboregular', fill: '#000' });
        };
        SignButtonView.prototype.ShowSelectedTrump = function (suit) {
            if (this.TrumpObj != null)
                this.TrumpObj.destroy();
            this.TrumpObj = this.currentGame.add.text(600, 55, suit, { font: '30px dimboregular', fill: '#000' });
        };
        SignButtonView.prototype.ShowPickupOrPass = function () {
            this.Pickup = this.currentGame.add.text(270, 1000, 'Pick up', { font: '50px dimboregular', fill: '#000' });
            this.Pickup.inputEnabled = true;
            this.Pickup.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "Pick up", action: "Pick up", game: this.currentGame });
            this.Pass = this.currentGame.add.text(515, 1000, 'Pass', { font: '50px dimboregular', fill: '#000' });
            this.Pass.inputEnabled = true;
            this.Pass.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "Pass", action: "Pass", game: this.currentGame });
        };
        SignButtonView.prototype.ShowChooseOptions = function () {
            //this.Choose = this.currentGame.add.text(270, 1000, 'Choose', { font: '50px dimboregular', fill: '#000' });
            //this.Choose.inputEnabled = true;
            //this.Choose.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "Choose", action: "Choose", game: this.currentGame });
            this.Pass = this.currentGame.add.text(515, 1000, 'Pass', { font: '50px dimboregular', fill: '#000' });
            this.Pass.inputEnabled = true;
            this.Pass.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "Pass Choose", action: "Pass Choose", game: this.currentGame });
        };
        SignButtonView.prototype.ShowSuitOptions = function () {
            this.Spades = this.currentGame.add.text(300, 500, 'Spades', { font: '50px dimboregular', fill: '#000' });
            this.Spades.inputEnabled = true;
            this.Spades.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "ChooseSpades", action: "ChooseSpades", game: this.currentGame });
            this.Hearts = this.currentGame.add.text(300, 575, 'Hearts', { font: '50px dimboregular', fill: '#963232' });
            this.Hearts.inputEnabled = true;
            this.Hearts.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "ChooseHearts", action: "ChooseHearts", game: this.currentGame });
            this.Diamonds = this.currentGame.add.text(300, 650, 'Diamonds', { font: '50px dimboregular', fill: '#963232' });
            this.Diamonds.inputEnabled = true;
            this.Diamonds.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "ChooseDiamonds", action: "ChooseDiamonds", game: this.currentGame });
            this.Clubs = this.currentGame.add.text(300, 725, 'Clubs', { font: '50px dimboregular', fill: '#000' });
            this.Clubs.inputEnabled = true;
            this.Clubs.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "ChooseClubs", action: "ChooseClubs", game: this.currentGame });
        };
        SignButtonView.prototype.ShowBackObj = function () {
            this.BackObj = this.currentGame.add.text(800, 5, "Back", { font: '30px dimboregular', fill: '#000' });
            this.BackObj.inputEnabled = true;
            this.BackObj.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "Back", action: "Back", game: this.currentGame });
        };
        SignButtonView.prototype.ShowUserNames = function () {
            this.p1 = this.currentGame.add.text(240, 330, 'Player 4', { font: '30px dimboregular', fill: '#000' });
            this.p2 = this.currentGame.add.text(250, 1200, 'Player 2', { font: '30px dimboregular', fill: '#000' });
            this.p3 = this.currentGame.add.text(560, 1200, 'Player 3', { font: '30px dimboregular', fill: '#000' });
            this.p4 = this.currentGame.add.text(78, 1560, 'Player 1', { font: '30px dimboregular', fill: '#000' });
        };
        SignButtonView.prototype.WinScreen = function () {
            this.currentGame.add.sprite(0, 0, 'black');
            this.HudBar.alpha = 0.2;
            this.HudBar.width = 900;
            this.HudBar.height = 1600;
            this.currentGame.add.text(240, 500, 'YOU WIN!', { font: '80px dimboregular', fill: '#000' });
            var continueButton = this.currentGame.add.text(240, 700, "Continue", { font: '50px dimboregular', fill: '#000' });
            continueButton.inputEnabled = true;
            continueButton.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "Back", action: "Back", game: this.currentGame });
        };
        SignButtonView.prototype.LoseScreen = function () {
            this.currentGame.add.sprite(0, 0, 'black');
            this.HudBar.alpha = 0.2;
            this.HudBar.width = 900;
            this.HudBar.height = 1600;
            this.currentGame.add.text(240, 500, 'You lose.', { font: '80px dimboregular', fill: '#000' });
            var continueButton = this.currentGame.add.text(240, 700, "Continue", { font: '50px dimboregular', fill: '#000' });
            continueButton.inputEnabled = true;
            continueButton.events.onInputDown.add(this.currentGame.handleUserInput, { suit: "Back", action: "Back", game: this.currentGame });
        };
        return SignButtonView;
    }());
    var CardView = (function () {
        function CardView(value, suit, posX, posY, imgObj, hiddenImgObj) {
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
        CardView.prototype.toMove = function () {
            if (this.moveToX !== this.x || this.moveToY !== this.y) {
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
    var PlayerView = (function () {
        function PlayerView(numPlayer) {
            this.numCards = 0;
            this.moveX = 0;
            this.moveY = 0;
            switch (numPlayer) {
                case 0:
                    this.initX = 80;
                    this.initY = 1370;
                    this.moveX = 150;
                    break;
                case 1:
                    this.initX = 80;
                    this.initY = 320;
                    this.moveY = 200;
                    break;
                case 2:
                    this.initX = 80;
                    this.initY = 120;
                    this.moveX = 150;
                    break;
                case 3:
                    this.initX = 680;
                    this.initY = 320;
                    this.moveY = 200;
                    break;
                default:
                    break;
            }
        }
        PlayerView.prototype.addCard = function () {
            this.numCards++;
        };
        PlayerView.prototype.removeCard = function () {
            this.numCards--;
        };
        PlayerView.prototype.getSortedX = function (p) {
            return this.initX + p * this.moveX;
        };
        PlayerView.prototype.getSortedY = function (p) {
            return this.initY + p * this.moveY;
        };
        PlayerView.prototype.finalX = function () {
            if (this.numCards == 0)
                return -1;
            return this.initX + (this.numCards - 1) * this.moveX;
        };
        PlayerView.prototype.finalY = function () {
            if (this.numCards == 0)
                return -1;
            return this.initY + (this.numCards - 1) * this.moveY;
        };
        return PlayerView;
    }());
    var ScreenView = (function () {
        function ScreenView(game) {
            this.map = {};
            this.currentGame = game;
            this.moveSpeed = 100;
            this.cardViews = new Array();
            this.hiddenCardViews = new Array();
            this.map = {};
            this.players = new Array();
            this.signView = new SignButtonView(this.currentGame);
            this.signView.ShowHud();
            this.signView.ShowMessageBoard();
            this.signView.ShowBackObj();
            this.signView.ShowUserNames();
            this.waitEnd = 0;
            for (var i = 0; i < 4; i++) {
                this.players.push(new PlayerView(i));
            }
            var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
            var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
            for (var i = 0; i < suits.length; i++) {
                for (var j = 0; j < values.length; j++) {
                    var createdCardView = new CardView(values[j], suits[i], -1000, -1000, this.currentGame.add.sprite(-1000, -1000, suits[i] + '-' + values[j]), this.currentGame.add.sprite(-1000, -1000, "cardBack"));
                    //here add the input
                    createdCardView.imgObj.inputEnabled = true;
                    createdCardView.imgObj.events.onInputDown.add(this.currentGame.handleUserInput, {
                        suit: suits[i],
                        value: values[j],
                        action: "cardTouch",
                        game: this.currentGame
                    });
                    this.cardViews.push(createdCardView);
                    this.map[suits[i] + '-' + values[j]] = createdCardView;
                }
            }
        }
        ScreenView.prototype.drawAtNoInit = function (suit, value, moveToX, moveToY, hidden) {
            var retrievedCardView = this.map[suit + '-' + value];
            this.drawAt(retrievedCardView.x, retrievedCardView.y, suit, value, moveToX, moveToY, hidden);
        };
        ScreenView.prototype.showWinScreen = function () {
            this.signView.WinScreen();
        };
        ScreenView.prototype.showLoseScreen = function () {
            this.signView.LoseScreen();
        };
        ScreenView.prototype.drawAt = function (x, y, suit, value, moveToX, moveToY, hidden) {
            var retrievedCardView = this.map[suit + '-' + value];
            retrievedCardView.x = x;
            retrievedCardView.y = y;
            retrievedCardView.moveToX = moveToX;
            retrievedCardView.moveToY = moveToY;
            retrievedCardView.isHidden = hidden;
            if (hidden) {
                retrievedCardView.hiddenImgObj.x = x;
                retrievedCardView.hiddenImgObj.y = y;
                retrievedCardView.imgObj.x = -1000;
                retrievedCardView.imgObj.y = -1000;
            }
            else {
                retrievedCardView.hiddenImgObj.x = -1000;
                retrievedCardView.hiddenImgObj.y = -1000;
                retrievedCardView.imgObj.x = x;
                retrievedCardView.imgObj.y = y;
            }
        };
        ScreenView.prototype.addMoveTo = function (suit, value, moveToX, moveToY, hidden) {
            var retrievedCardView = this.map[suit + '-' + value];
            retrievedCardView.moveToX = moveToX;
            retrievedCardView.moveToY = moveToY;
            retrievedCardView.isHidden = hidden;
        };
        ScreenView.prototype.shouldMove = function () {
            for (var i = 0; i < this.cardViews.length; i++) {
                if (this.cardViews[i].toMove())
                    return true;
            }
            return false;
        };
        ScreenView.prototype.shouldPause = function () {
            if (Date.now() < this.waitEnd) {
                return true;
            }
            return false;
        };
        ScreenView.prototype.setPause = function (pauseTimeInSeconds) {
            this.waitEnd = Date.now() + 1000 * pauseTimeInSeconds;
        };
        ScreenView.prototype.abs = function (val) {
            if (val < 0)
                return -1 * val;
            return val;
        };
        ScreenView.prototype.resolveAction = function (action) {
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
                }
                else if (actionElements[1] == "Middle") {
                    initX = 400;
                    initY = 300;
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
                }
                this.drawAt(initX, initY, action.cardSuit, action.cardValue, finalX, finalY, hidden);
            }
            else if (actionElements[0] == "Win") {
                this.showWinScreen();
            }
            else if (actionElements[0] == "Lose") {
                this.showLoseScreen();
            }
            else if (actionElements[0] == "Show") {
                var messageElements = action.actionName.split("`");
                var message = messageElements[1];
                // ActionImgObj;
                // MessageTextObj;
                // PointObj;
                // SuitObj;
                if (actionElements[1] == "Title") {
                    this.signView.ShowActionTitle(message);
                }
                else if (actionElements[1] == "Message") {
                    this.signView.ShowMessageText(message);
                }
                else if (actionElements[1] == "Point") {
                    this.signView.ShowPoints(message);
                }
                else if (actionElements[1] == "Suit") {
                    this.signView.ShowSelectedTrump(message);
                }
                //Show-SelectCardTrump
                if (actionElements[1] == "SelectCardTrump") {
                    this.signView.ShowPickupOrPass();
                }
                else if (actionElements[1] == "SelectTrump") {
                    this.signView.Clear();
                    this.signView.ShowChooseOptions();
                    this.signView.ShowSuitOptions();
                }
                else if (actionElements[1] == "SelectCardSwitch") {
                    this.signView.Clear();
                    this.signView.ShowMessageText('Select card to switch');
                }
                else if (actionElements[1] == "StartGame") {
                    this.signView.Clear();
                    this.signView.ShowActionTitle('Phase - Game start.');
                }
            }
            else if (actionElements[0] == "Remove") {
                if (actionElements[1] == "Center") {
                    this.drawAtNoInit(action.cardSuit, action.cardValue, -300, -300, false);
                }
                else if (actionElements[1] == "Card" && actionElements[2].indexOf("Player") != -1) {
                    var playerNum = Number(actionElements[2].substr(actionElements[2].length - 1)) - 1;
                    this.players[playerNum].removeCard();
                    this.drawAtNoInit(action.cardSuit, action.cardValue, -1000, -1000, false);
                }
            }
            else if (actionElements[0] == "Sort") {
                var playerNum = Number(actionElements[2].substr(actionElements[2].length - 1)) - 1;
                var numCard = Number(actionElements[3]);
                var finalX = this.players[playerNum].getSortedX(numCard);
                var finalY = this.players[playerNum].getSortedY(numCard);
                this.drawAtNoInit(action.cardSuit, action.cardValue, finalX, finalY, playerNum != 0);
            }
            else if (actionElements[0] == "Play") {
                var playerNum = Number(actionElements[2].substr(actionElements[2].length - 1)) - 1;
                this.drawAtNoInit(action.cardSuit, action.cardValue, this.getPlayerCenterX(playerNum), this.getPlayerCenterY(playerNum), false);
                this.players[playerNum].removeCard();
            }
            else if (actionElements[0] == "Clean") {
                var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
                var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
                for (var i = 0; i < suits.length; i++) {
                    for (var j = 0; j < values.length; j++) {
                        this.drawAtNoInit(suits[i], values[j], -300, -300, false);
                    }
                }
            }
            else if (actionElements[0] == "Clear") {
                var cardRep = actionElements[1].split(';');
                var playerNum = Number(actionElements[2].substr(actionElements[2].length - 1)) - 1;
                for (var i = 0; i < 4; i++) {
                    this.drawAtNoInit(cardRep[i].split(",")[0], cardRep[i].split(",")[1], this.getPlayerClearX(playerNum), this.getPlayerClearY(playerNum), false);
                }
            }
            else if (actionElements[0] == "Pause") {
                this.setPause(action.duration);
            }
        };
        ScreenView.prototype.getPlayerClearX = function (player) {
            if (player == 0 || player == 2) {
                return 385;
            }
            if (player == 1)
                return -235;
            return 1000;
        };
        ScreenView.prototype.getPlayerClearY = function (player) {
            if (player == 1 || player == 3) {
                return 450;
            }
            if (player == 2)
                return -250;
            return 1650;
        };
        ScreenView.prototype.getPlayerCenterX = function (player) {
            if (player == 0 || player == 2) {
                return 385;
            }
            if (player == 1)
                return 235;
            return 535;
        };
        ScreenView.prototype.getPlayerCenterY = function (player) {
            if (player == 1 || player == 3) {
                return 550;
            }
            if (player == 2)
                return 350;
            return 750;
        };
        ScreenView.prototype.doMoveOperation = function () {
            for (var i = 0; i < this.cardViews.length; i++) {
                if (this.cardViews[i].toMove()) {
                    var xMove = this.moveSpeed;
                    if (this.cardViews[i].moveToX < this.cardViews[i].x)
                        xMove = -1 * this.moveSpeed;
                    var yMove = this.moveSpeed;
                    if (this.cardViews[i].moveToY < this.cardViews[i].y)
                        yMove = -1 * this.moveSpeed;
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
                    }
                    else {
                        this.cardViews[i].imgObj.x = this.cardViews[i].x;
                        this.cardViews[i].imgObj.y = this.cardViews[i].y;
                    }
                }
            }
            return false;
        };
        return ScreenView;
    }());
    ScreenView_1.ScreenView = ScreenView;
})(ScreenView || (ScreenView = {}));
//# sourceMappingURL=screenView.js.map