/// <reference path="deck.ts"/>
//controller
var Controller;
(function (Controller) {
    (function (GameState) {
        GameState[GameState["Shuffle"] = 0] = "Shuffle";
        GameState[GameState["SelectCardTrump"] = 1] = "SelectCardTrump";
        GameState[GameState["SelectCardTrumpPickupSwitch"] = 2] = "SelectCardTrumpPickupSwitch";
        GameState[GameState["SelectingCardTrumpPickupSwitch"] = 3] = "SelectingCardTrumpPickupSwitch";
        GameState[GameState["SelectCardTrumpFinishPickupStartGame"] = 4] = "SelectCardTrumpFinishPickupStartGame";
        GameState[GameState["SelectCardTrumpPassAI"] = 5] = "SelectCardTrumpPassAI";
        GameState[GameState["SwitchingCardWithMiddle"] = 6] = "SwitchingCardWithMiddle";
        GameState[GameState["SelectingCardTrump"] = 7] = "SelectingCardTrump";
        GameState[GameState["SelectTrump"] = 8] = "SelectTrump";
        GameState[GameState["Game"] = 9] = "Game";
        GameState[GameState["GameUserInput"] = 10] = "GameUserInput";
        GameState[GameState["GameAiInput"] = 11] = "GameAiInput";
    })(Controller.GameState || (Controller.GameState = {}));
    var GameState = Controller.GameState;
    var Action = (function () {
        function Action(actionName, duration, cardValue, cardSuit, action) {
            this.actionName = actionName;
            this.duration = duration;
            this.cardValue = cardValue;
            this.cardSuit = cardSuit;
            this.action = action;
        }
        return Action;
    }());
    Controller.Action = Action;
    var GameStateController = (function () {
        function GameStateController() {
            this.actions = new Array();
            this.players = new Array();
            this.state = GameState.Shuffle;
            this.deck = new Model.Deck;
            this.trumpSelector = 0;
            for (var i = 0; i < 4; i++)
                this.players.push(new Controller.PlayerController());
        }
        GameStateController.prototype.nextActionExists = function () {
            return this.actions.length > 0;
        };
        GameStateController.prototype.getNextAction = function () {
            if (this.actions.length > 0) {
                var action = this.actions[0];
                this.actions.splice(0, 1);
                return action;
            }
            else {
                return null;
            }
        };
        GameStateController.prototype.setGameState = function (stateToSet) {
            this.state = stateToSet;
        };
        GameStateController.prototype.SwitchCardWithMiddle = function (player, value, suit) {
            //add state for 'switching with the middle card'
            this.players[player].removeCard(new Model.Card(suit, value));
            this.actions.push(new Action("Remove-Card-Player1", -1, value, suit, null));
            for (var i = 0; i < this.players[player].cards.length; i++) {
                this.actions.push(new Action("Sort-Hand-Player1-" + i, -1, this.players[player][i].cardValue, this.players[player][i].cardSuit, null));
            }
            this.players[player].addCard(this.cardInMiddleForTrump);
            this.cardInMiddleForTrump = null;
            this.actions.push(new Action("Move-Middle-Player1", -1, this.cardInMiddleForTrump.cardValue, this.cardInMiddleForTrump.cardSuit, null));
            //remove the sign
            // add the "In Game" sign
        };
        GameStateController.prototype.setActionForGameState = function () {
            switch (this.state) {
                case GameState.Shuffle:
                    // shuffle the cards
                    this.deck.shuffle();
                    // give player 1 5 cards, one after another
                    for (var i = 0; i < 5; i++) {
                        var card = this.deck.getNextCard();
                        this.players[0].addCard(card);
                        this.actions.push(new Action("Move-Deck-Player1", -1, card.cardValue, card.cardSuit, null));
                        card = this.deck.getNextCard();
                        this.players[1].addCard(card);
                        this.actions.push(new Action("Move-Deck-Player2", -1, card.cardValue, card.cardSuit, null));
                        card = this.deck.getNextCard();
                        this.players[2].addCard(card);
                        this.actions.push(new Action("Move-Deck-Player3", -1, card.cardValue, card.cardSuit, null));
                        card = this.deck.getNextCard();
                        this.players[3].addCard(card);
                        this.actions.push(new Action("Move-Deck-Player4", -1, card.cardValue, card.cardSuit, null));
                    }
                    this.state = GameState.SelectCardTrump;
                    break;
                case GameState.SelectCardTrump:
                    this.actions.push(new Action("Show-SelectCardTrump", -1, null, null, null));
                    var card = this.deck.getNextCard();
                    this.cardInMiddleForTrump = card;
                    this.actions.push(new Action("Move-Deck-Center", -1, card.cardValue, card.cardSuit, null));
                    this.state = GameState.SelectingCardTrump;
                    break;
                case GameState.SelectCardTrumpPickupSwitch:
                    //create the sign
                    this.actions.push(new Action("Show-SelectCardSwitch", -1, null, null, null));
                    // wait for user input
                    this.state = GameState.SelectingCardTrumpPickupSwitch;
                    break;
                case GameState.SwitchingCardWithMiddle:
                    this.state = GameState.Game;
                    break;
                case GameState.SelectCardTrumpPassAI:
                    //calculate AI work
                    // translate these into actions
                    break;
                default:
                    return;
            }
        };
        return GameStateController;
    }());
    Controller.GameStateController = GameStateController;
})(Controller || (Controller = {}));
//# sourceMappingURL=gameStateController.js.map