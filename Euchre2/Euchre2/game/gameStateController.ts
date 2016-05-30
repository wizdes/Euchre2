/// <reference path="deck.ts"/>
//controller
module Controller {

    enum GameState {
        Shuffle,
        SelectCardTrump,
        SelectingCardTrump,
        SelectTrump,
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
        private state: GameState;
        private deck: Model.Deck;
        private trumpSelector: number;

        constructor() {
            this.actions = new Array<Action>();
            this.state = GameState.Shuffle;
            this.deck = new Model.Deck;
            this.trumpSelector = 0;
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

        setGameState() {
            switch(this.state) {
                case GameState.Shuffle:
                    // shuffle the cards
                    this.deck.shuffle();

                    // give player 1 5 cards, one after another
                    for (var i = 0; i < 5; i++)
                    {
                        var card = this.deck.getNextCard();
                        this.actions.push(new Action("Move-Deck-Player1", -1, card.cardValue, card.cardSuit, null));
                        card = this.deck.getNextCard();
                        this.actions.push(new Action("Move-Deck-Player2", -1, card.cardValue, card.cardSuit, null));
                        card = this.deck.getNextCard();
                        this.actions.push(new Action("Move-Deck-Player3", -1, card.cardValue, card.cardSuit, null));
                        card = this.deck.getNextCard();
                        this.actions.push(new Action("Move-Deck-Player4", -1, card.cardValue, card.cardSuit, null));
                    }
                    this.state = GameState.SelectCardTrump;
                    break;
                case GameState.SelectCardTrump:
                    this.actions.push(new Action("Show-SelectCardTrump", -1, null, null, null));
                    var card = this.deck.getNextCard();
                    this.actions.push(new Action("Move-Deck-Center", -1, card.cardValue, card.cardSuit, null));
                    this.state = GameState.SelectingCardTrump;
                    break;

                default:
                    return;
            }    
        }

        // if there is a list of actions, encode the action into the game

        // if not, decide what to do
    }
}
