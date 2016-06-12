/// <reference path="deck.ts"/>
//controller
module Controller {

    export enum GameState {
        Shuffle,
        SelectCardTrump,
        SelectCardTrumpPickupSwitch,
        SelectingCardTrumpPickupSwitch,
        SelectCardTrumpFinishPickupStartGame,
        SelectCardTrumpPassAi,
        SwitchingCardWithMiddle,
        SelectingCardTrump,
        Game,
        Game_RoundStart,
        Game_AITurn,
        Game_UserInputTurn,
        Game_EndOfRound,
        Game_EndOfSet,
        Game_DetermineNextPlayerInRound,

        //unused game states
        SelectingTrumpCardAi,
        SelectTrumpUser,
        SelectTrumpAi,
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
        private roundStart: number;
        // between 0-3, but always starts at 0 at the beginning of the turn
        // to get the current player: roundStart + currentRoundTurnNumber
        private currentRoundTurnNumber : number;

        constructor() {
            this.actions = new Array<Action>();
            this.players = new Array<PlayerController>();
            this.state = GameState.Shuffle;
            this.deck = new Model.Deck;
            this.trumpSelector = 0;
            this.roundStart = 0;
            this.currentRoundTurnNumber = 0;

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

            // TODO: add the "In Game" sign
        }

        PlayCard(player, value, suit) {
            //TODO: play the card (add actions)
            this.currentRoundTurnNumber++;
        }

        AddAiAction(){
            //TODO: encode actions
            this.currentRoundTurnNumber++;
            this.state = GameState.Game_DetermineNextPlayerInRound;
        }

        setActionForGameState() {
            switch(this.state) {
                case GameState.Shuffle:
                    // TODO: you will need to reset everything here

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
                    this.actions.push(new Action("Show-StartGame", -1, null, null, null));
                    this.state = GameState.Game;
                    break;
                case GameState.SelectCardTrumpPassAi:
                    //calculate AI work
                    // translate these into actions
                    break;
                case GameState.Game:
                    this.state = GameState.Game_RoundStart;
                    break;

                case GameState.Game_RoundStart:
                    this.currentRoundTurnNumber = 0;
                    if(this.roundStart + this.currentRoundTurnNumber == 0){
                        this.state = GameState.Game_UserInputTurn;
                    }
                    else{
                        this.state = GameState.Game_AITurn;
                    }
                    break;
                case GameState.Game_UserInputTurn:
                    // show a sign it is your turn
                    // wait for user input
                    break;
                case GameState.Game_AITurn:
                    //add the actions of putting in one card
                    AddAiAction();
                    break;
                case GameState.Game_DetermineNextPlayerInRound:
                    if(this.currentRoundTurnNumber == 3){
                        this.state = GameState.Game_EndOfRound;
                        break;
                    }
                    else if(this.currentRoundTurnNumber + this.roundStart == 0){
                        this.state = GameState.Game_UserInputTurn;
                    }
                    else{
                        this.state = GameState.Game_AITurn;
                    }
                    break;
                case GameState.Game_EndOfRound:
                    this.state = GameState.Game_EndOfSet;
                    // clean up board actions

                    //calculate points here
                    break;
                case GameState.Game_EndOfSet:
                    this.roundStart++;
                    this.state = GameState.Shuffle;
                    break;
                default:
                    return;
            }    
        }
    }
}
