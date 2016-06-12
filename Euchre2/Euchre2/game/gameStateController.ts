/// <reference path="deck.ts"/>
//controller
module Controller {

    export enum GameState {
        Shuffle,
        SelectCardTrump,
        SelectCardTrumpPickupSwitch,
        SelectingCardTrumpPickupSwitch,
        SelectCardTrumpFinishPickupStartGame,
        SelectCardTrumpPassAI,
        SwitchingCardWithMiddle,
        SelectingCardTrump,
        SelectTrump,
        Game,
        GameUserInput,
        GameAiInput
    }

    export class Action {
        duration: number;
        actionName: string;
        cardValue: string;
        cardSuit: string;
        action: Action;

        constructor(actionName, duration, cardValue, cardSuit, action) {
            this.actionName = actionName;
            this.duration = duration;
            this.cardValue = cardValue;
            this.cardSuit = cardSuit;
            this.action = action;
        }
    }

    export class GameStateController {
        // have a list of actions here
        private actions: Action[];
        state: GameState;
        private deck: Model.Deck;
        private trumpSelector: number;
        private players: PlayerController[];
        private cardInMiddleForTrump: Model.Card;

        constructor() {
            this.actions = new Array<Action>();
            this.players = new Array<PlayerController>();
            this.state = GameState.Shuffle;
            this.deck = new Model.Deck;
            this.trumpSelector = 0;

            for (var i = 0; i < 4; i++) this.players.push(new PlayerController());
        }

        nextActionExists() {
            return this.actions.length > 0;
        }

        getNextAction() {
            if (this.actions.length > 0) {
                var action = this.actions[0];
                this.actions.splice(0, 1);
                return action;
            } else {
                return null;
            }
        }

        setGameState(stateToSet) {
            this.state = stateToSet;
        }


        SwitchCardWithMiddle(player, value, suit) {
            //add state for 'switching with the middle card'
            this.players[player].removeCard(new Model.Card(suit, value));
            this.actions.push(new Action("Remove-Card-Player1", -1, value, suit, null));

            for (var i = 0; i < this.players[player].cards.length; i++) {
                this.actions.push(new Action("Sort-Hand-Player1-" + i, -1, this.players[player].cards[i].cardValue, this.players[player].cards[i].cardSuit, null));
            }

            this.players[player].addCard(this.cardInMiddleForTrump);
            this.actions.push(new Action("Move-Middle-Player1", -1, this.cardInMiddleForTrump.cardValue, this.cardInMiddleForTrump.cardSuit, null));
            this.cardInMiddleForTrump = null;
            //remove the sign

            // add the "In Game" sign
        }

        setActionForGameState() {
            switch(this.state) {
                case GameState.Shuffle:
                    // shuffle the cards
                    this.deck.shuffle();

                    // give player 1 5 cards, one after another
                    for (var i = 0; i < 5; i++)
                    {
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
        }

        // if there is a list of actions, encode the action into the game

        // if not, decide what to do
    }
}
