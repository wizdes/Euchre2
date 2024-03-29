﻿/// <reference path="deck.ts"/>
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
        SelectTrumpSuit,
        SelectingTrumpSuit,
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
        SelectTrumpSuitAi,
        SelectTrumpSuitPrep,
        GameEnd
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

    export class CardsInMiddleLogic {
        cards: Model.Card[];
        private cardOwner: number[];
        private trump: Model.Suit;
        private leadCardSuit: Model.Suit;
        private controller: GameStateController;

        constructor(controller) {
            this.reset(Model.Suit.None);
            this.controller = controller;
        }

        addCard(playerNum, card, isLeadCard) {
            this.cards.push(card);
            this.cardOwner.push(playerNum);

            if (isLeadCard) {
                this.leadCardSuit = this.controller.suitStringToSuit(card.cardSuit);
            }
        }

        reset(suit) {
            this.cards = new Array<Model.Card>();
            this.cardOwner = new Array<number>();            
            this.trump = suit;
        }

        getHighestTrumpPlayer(trumpCards) {
            if (trumpCards.length == 1) return this.cardOwner[trumpCards[0]];

            var highestValue = -1;
            var highestValueIndex = -1;

            for (var i = 0; i < trumpCards.length; i++) {
                var valueOfCard = this.getValueOfCardTrump(this.cards[trumpCards[i]]);
                if (valueOfCard > highestValue) {
                    highestValue = valueOfCard;
                    highestValueIndex = trumpCards[i];
                }                
            }

            return this.cardOwner[highestValueIndex];
        }

        getValueOfCardTrump(card) {
            switch (card.cardValue) {
                case "9":
                    return 1;
                case "10":
                    return 2;
                case "J":
                    if (this.controller.suitStringToSuit(card.cardSuit) == this.trump) {
                        return 7;
                    }
                    return 6;
                case "Q":
                    return 3;
                case "K":
                    return 4;
                case "A":
                    return 5;
                default:
                    return -1;
            }
        }

        getValueOfCard(card) {
            switch(card.cardValue) {
                case "9":
                    return 1;
                case "10":
                    return 2;
                case "J":
                    return 3;
                case "Q":
                    return 4;
                case "K":
                    return 5;
                case "A":
                    return 6;
                default:
                    return -1;
            }
        }

        getHighestMatchingLeadCardPlayer(matchingLeadCards) {
            if (matchingLeadCards.length == 1) return this.cardOwner[matchingLeadCards[0]];

            var highestValue = -1;
            var highestValueIndex = -1;

            for (var i = 0; i < matchingLeadCards.length; i++) {
                var valueOfCard = this.getValueOfCard(this.cards[matchingLeadCards[i]]);
                if (valueOfCard > highestValue) {
                    highestValue = valueOfCard;
                    highestValueIndex = matchingLeadCards[i];
                }
            }

            return this.cardOwner[highestValueIndex];
        }

        getWinner() {
            var trumpCards = new Array<number>();
            for (var i = 0; i < 4; i++) {
                if (this.controller.isTrumpCard(this.cards[i].cardSuit, this.cards[i].cardValue)) {
                    trumpCards.push(i);
                }
            }

            if (trumpCards.length > 0) return this.getHighestTrumpPlayer(trumpCards);

            var matchingLeadCards = new Array<number>();
            for (var i = 0; i < 4; i++) {
                if (this.controller.suitStringToSuit(this.cards[i].cardSuit) == this.leadCardSuit) {
                    matchingLeadCards.push(i);
                }
            }

            return this.getHighestMatchingLeadCardPlayer(matchingLeadCards);
        }
    }

    export class GameStateController {
        // have a list of actions here
        private actions: Action[];
        state: GameState;
        private deck: Model.Deck;
        private trumpSelector: Model.Suit;
        private secondarySelector: Model.Suit;
        private players: PlayerController[];
        private cardInMiddleForTrump: Model.Card;
        private roundUserStart: number;
        // between 0-4, but always starts at 0 at the beginning of the turn
        // to get the current player: roundUserStart + currentRoundTurnNumber
        private currentRoundTurnNumber: number;

        private currentSetRoundNumber: number;
        private setStart : number;

        private cardsInMiddleLogic: CardsInMiddleLogic;

        private crossScore: number;
        private sideScore: number;

        private globalCrossScore: number;
        private globalSideScore: number;

        private userInput: boolean;
        private dealerScrewedCount: number;
        private numSet : number;

        private cardInitiative: number;

        constructor() {
            this.actions = new Array<Action>();
            this.players = new Array<PlayerController>();
            this.state = GameState.Shuffle;
            this.deck = new Model.Deck;
            this.trumpSelector = Model.Suit.None;
            this.secondarySelector = Model.Suit.None;
            this.roundUserStart = 0;
            this.currentRoundTurnNumber = 0;
            this.currentSetRoundNumber = 0;
            this.cardsInMiddleLogic = new CardsInMiddleLogic(this);
            this.setStart = 0;
            this.crossScore = 0;
            this.sideScore = 0;
            this.globalCrossScore = 0;
            this.globalSideScore = 0;
            this.userInput = false;
            this.numSet = 1;

            for (var i = 0; i < 4; i++) this.players.push(new PlayerController());
        }

        nextActionExists() {
            return this.actions.length > 0;
        }

        setTrumpSelector(suit) {
            this.trumpSelector = this.suitStringToSuit(suit);
            this.cardsInMiddleLogic.reset(this.trumpSelector);
        }

        suitToSuitString(suit) {
            switch (suit) {
                case Model.Suit.Hearts:
                    return "Hearts";
                case Model.Suit.Diamonds:
                    return "Diamonds";
                case Model.Suit.Clubs:
                    return "Clubs";
                case Model.Suit.Spades:
                    return "Spades";
                default:
                    return "None";
            }
        }

        suitStringToSuit(suit) {
            switch(suit) {
                case "Hearts":
                    return Model.Suit.Hearts;
                case "Diamonds":
                    return Model.Suit.Diamonds;
                case "Spades":
                    return Model.Suit.Spades;
                case "Clubs":
                    return Model.Suit.Clubs;
                default:
                    return Model.Suit.None;
            }
        }

        setSecondarySelector(suit) {
            this.secondarySelector = this.suitStringToSuit(suit);
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
            var strictAvailableCardsToSelect = new Array<number>();
            var secondarySuitCardList = new Array<number>();

            if (this.currentRoundTurnNumber != 0) {
                // if you're the first, fuck it. just put them all in the damn list.
                // generate this list by getting the trump cards and the cards that follow the thing
                // if there's none at the end of this, fuck it, put them all the damn list.
                for (var i = 0; i < this.players[this.GetCurrentAiPlayer()].cards.length; i++) {
                    var suitToCheck = this.players[this.GetCurrentAiPlayer()].cards[i].cardSuit;
                    var valueToCheck = this.players[this.GetCurrentAiPlayer()].cards[i].cardValue;
                    if (this.secondarySelector == this.suitStringToSuit(suitToCheck) ||
                        this.secondarySelector == Model.Suit.None ||
                        this.isTrumpCard(suitToCheck, valueToCheck)) {
                        strictAvailableCardsToSelect.push(i);
                        if (this.secondarySelector == this.suitStringToSuit(suitToCheck)) {
                            secondarySuitCardList.push(i);
                        }
                    }
                }
            }

            // if you're the first player, do whatever the fuck you want.
            if (this.currentRoundTurnNumber == 0) {
                this.setSecondarySelector(suit);
            } else {
                //at this point, determine if the rules have been followed.
                // does the card follow the trump rules?
                //  if there is a trump, you must suit must be the trump
                //  is trump even recorded?
                //  else, is secondary suit played? 
                // it is OK to play
                if (this.secondarySelector != this.suitStringToSuit(suit) &&
                    this.secondarySelector != Model.Suit.None) {
                    if (this.isTrumpCard(suit, value)) {

                    } else if(secondarySuitCardList.length > 0) {
                        // this means you have a card with that suit
                        // BUT, you chose to not select it
                        // go away
                        return;
                    }
                }
            }

            this.cardsInMiddleLogic.addCard(player, new Model.Card(suit, value), this.currentRoundTurnNumber == 0);

            this.players[player].removeCard(new Model.Card(suit, value));

            this.actions.push(new Action("Play-Card-Player1", -1, value, suit, null));

            for (var i = 0; i < this.players[player].cards.length; i++) {
                this.actions.push(new Action("Sort-Hand-Player1-" + i, -1, this.players[player].cards[i].cardValue, this.players[player].cards[i].cardSuit, null));
            }

            this.currentRoundTurnNumber++;

            this.actions.push(new Action("Player " + 1 + " played the " + value + " of " + suit + ".", 0.5, null, null, null));

            // use this pattern in the future instead of 'ing' state 
            this.setGameState(GameState.Game_DetermineNextPlayerInRound);
        }

        GetCurrentAiPlayer() {
            return (this.currentRoundTurnNumber + this.roundUserStart) % 4;
        }

        isTrumpCard(suit, value) {
            if (this.suitStringToSuit(suit) == this.trumpSelector) {
                return true;
            }
            if (value != "J") {
                return false;
            }
            if ((suit == "Hearts" || suit == "Diamonds") && (this.trumpSelector == Model.Suit.Hearts || this.trumpSelector == Model.Suit.Diamonds)) {
                return true;
            }
            if ((suit == "Spades" || suit == "Clubs") && (this.trumpSelector == Model.Suit.Spades || this.trumpSelector == Model.Suit.Clubs)) {
                return true;
            }

            return false;
        }

        AddAiAction() {
            var availableCardsToSelect = new Array<number>();
            if (this.currentRoundTurnNumber != 0) {
                // if you're the first, fuck it. just put them all in the damn list.
                // generate this list by getting the trump cards and the cards that follow the thing
                // if there's none at the end of this, fuck it, put them all the damn list.
                for (var i = 0; i < this.players[this.GetCurrentAiPlayer()].cards.length; i++) {
                    var suit = this.players[this.GetCurrentAiPlayer()].cards[i].cardSuit;
                    var value = this.players[this.GetCurrentAiPlayer()].cards[i].cardValue;
                    if (this.secondarySelector == this.suitStringToSuit(suit) ||
                        this.secondarySelector == Model.Suit.None ||
                        this.isTrumpCard(suit,value)) {
                        availableCardsToSelect.push(i);
                    }
                }
            }

            if (availableCardsToSelect.length == 0) {
                for (var i = 0; i < this.players[this.GetCurrentAiPlayer()].cards.length; i++) {
                    availableCardsToSelect.push(i);
                }
            }

            // all of these need to change to 'this.currentRoundTurnNumber + this.roundUserStart'
            // maybe make that into a function, yeah?
            var cardIndex = availableCardsToSelect[availableCardsToSelect.length - 1];
            var value = this.players[this.GetCurrentAiPlayer()].cards[cardIndex].cardValue;
            var suit = this.players[this.GetCurrentAiPlayer()].cards[cardIndex].cardSuit;

            if (this.currentRoundTurnNumber == 0) {
                this.setSecondarySelector(suit);
            }

            this.cardsInMiddleLogic.addCard(this.GetCurrentAiPlayer(), new Model.Card(suit, value), this.currentRoundTurnNumber == 0);

            this.players[this.GetCurrentAiPlayer()].removeCard(new Model.Card(suit, value));
            this.actions.push(new Action("Play-Card-Player" + (this.GetCurrentAiPlayer() + 1), -1, value, suit, null));

            for (var i = 0; i < this.players[this.GetCurrentAiPlayer()].cards.length; i++) {
                this.actions.push(new Action("Sort-Hand-Player" + (this.GetCurrentAiPlayer() + 1) + "-" + i, -1, this.players[this.GetCurrentAiPlayer()].cards[i].cardValue, this.players[this.GetCurrentAiPlayer()].cards[i].cardSuit, null));
            }

            this.actions.push(new Action("Player " + (this.GetCurrentAiPlayer() + 1) + " played the " + value + " of " + suit + ".", 0.5, null, null, null));
            this.actions.push(new Action("Pause", 0.5, null, null, null));

            this.currentRoundTurnNumber++;
            this.state = GameState.Game_DetermineNextPlayerInRound;
        }

        shouldPickUp(playerNum, playerToPickup) {
            var potentialSuit = this.cardInMiddleForTrump.cardSuit;
            var numCardsSuit = 3;
            if (playerNum == playerToPickup) numCardsSuit = 2;
            if (this.players[playerNum].numCardsOfSuit(potentialSuit) >= numCardsSuit) {
                return true;
            }
            return false;
        }

        PickUpAI(playerNum) {
            var suit = this.players[playerNum].cards[0].cardSuit;
            var value = this.players[playerNum].cards[0].cardValue;

            for (var i = 0; i < this.players[playerNum].cards.length; i++) {
            // TODO: trump check here is required
                if (this.players[playerNum].cards[i].cardSuit != this.cardInMiddleForTrump.cardSuit) {
                    suit = this.players[playerNum].cards[i].cardSuit;
                    value = this.players[playerNum].cards[i].cardValue;
                }   
            }

            this.players[playerNum].removeCard(new Model.Card(suit, value));
            this.actions.push(new Action("Remove-Card-Player" + (playerNum + 1), -1, value, suit, null));

            for (var i = 0; i < this.players[playerNum].cards.length; i++) {
                this.actions.push(new Action("Sort-Hand-Player" + (playerNum + 1) + "-" + i, -1, this.players[playerNum].cards[i].cardValue, this.players[playerNum].cards[i].cardSuit, null));
            }

            this.players[playerNum].addCard(this.cardInMiddleForTrump);
            this.actions.push(new Action("Move-Middle-Player" + (playerNum + 1), -1, this.cardInMiddleForTrump.cardValue, this.cardInMiddleForTrump.cardSuit, null));
            this.setTrumpSuitAddUiActions(this.cardInMiddleForTrump.cardSuit);

            this.cardInMiddleForTrump = null;
        }

        setActionForGameState() {
            switch(this.state) {
                case GameState.Shuffle:
                    this.cardInitiative = 0;
                    this.actions.push(new Action("Show-Title-`Phase - Beginning the round.", -1, null, null, null));
                    this.actions.push(new Action("Show-Message-`Shuffling and passing.", -1, null, null, null));
                    this.sideScore = 0;
                    this.crossScore = 0;
                    this.actions.push(new Action("Show-Point-`Score: " + this.globalCrossScore + " - " + this.globalSideScore, -1, null, null, null));
                    this.actions.push(new Action("Show-Suit-` ", -1, null, null, null));

                    this.userInput = false;
                    this.dealerScrewedCount = 0;

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
                    this.actions.push(new Action("Show-Title-`Phase - Choose to pick up trump or pass.", -1, null, null, null));
                    this.actions.push(new Action("Show-SelectCardTrump", -1, null, null, null));

                    this.actions.push(new Action("Show-Message-`Player " + (1) + "'s turn.", -1, null, null, null));

                    var card = this.deck.getNextCard();
                    this.cardInMiddleForTrump = card;
                    this.actions.push(new Action("Move-Deck-Center", -1, card.cardValue, card.cardSuit, null));

                    // TODO: this state is wrong if AI is the caller
                    if (this.setStart == 0) {
                        this.state = GameState.SelectingCardTrump;
                        this.userInput = true;
                    } else {
                        this.state = GameState.SelectCardTrumpPassAi;
                    }
                    break;
                case GameState.SelectCardTrumpPickupSwitch:
                    // check it is the user's turn to pick up the middle card
                    // SUPER IMPORTANT: If it is a user selecting PICK UP, but it is the AI's turn to pick it up, then AI needs to pick it up. 
                    if (this.setStart == 0) {
                        //create the sign
                        this.actions.push(new Action("Show-SelectCardSwitch", -1, null, null, null));
                        this.setTrumpSelector(this.cardInMiddleForTrump.cardSuit);
                        this.actions.push(new Action("Show-Suit-`Trump Suit: " + this.suitToSuitString(this.trumpSelector), -1, null, null, null));
                        this.cardInitiative = 0;
                        // wait for user input
                        this.state = GameState.SelectingCardTrumpPickupSwitch;
                    } else {
                        this.PickUpAI(this.setStart);
                        this.state = GameState.Game;
                    }

                    break;
                case GameState.SwitchingCardWithMiddle:
                    this.state = GameState.Game;
                    break;
                case GameState.SelectCardTrumpPassAi:
                    //calculate AI work
                    // translate these into actions

                    // for each AI starting position of the set -> user or start of the set
                    //  calculate if he wants to pick up
                    // function: shouldPickUp()
                    //  add a pause and a message
                    //  then either force the player to pick up
                    //  or go to the next AI

                    var incrementIfFirst = 0;
                    if (this.setStart == 0) incrementIfFirst = 1;

                    for (var i = 0; i < 4; i++) {
                        var eltToCheck = (this.setStart + i + incrementIfFirst) % 4;

                        this.actions.push(new Action("Show-Message-`Player " + (eltToCheck + 1) + "'s turn.", -1, null, null, null));

                        if (eltToCheck == 0 && this.userInput != true) {
                            this.userInput = true;
                            this.state = GameState.SelectingCardTrump;
                            break;
                        }
                        else if (eltToCheck == this.setStart && this.userInput == true) {
                            this.userInput = false;
                            this.state = GameState.SelectTrumpSuitPrep;
                            break;
                        } else {
                            if (this.shouldPickUp(eltToCheck, this.setStart)) {
                                this.state = GameState.SelectCardTrumpPickupSwitch;
                                this.actions.push(new Action("Show-Message-`Player " + (eltToCheck + 1) + " decided for the card to be picked up.", -1, null, null, null));
                                this.actions.push(new Action("Pause", 1, null, null, null));
                                if (eltToCheck == 2) this.cardInitiative = 0;
                                else this.cardInitiative = 1;

                                break;
                            } else {
                                this.actions.push(new Action("Show-Message-`Player " + (eltToCheck + 1) + " decided to pass.", -1, null, null, null));                                
                                this.actions.push(new Action("Pause", 1, null, null, null));
                            }
                        }
                    }
                    break;
                case GameState.SelectTrumpSuit:
                    // change to 'SelectingTrumpSuit'

                    this.actions.push(new Action("Show-SelectTrump", -1, null, null, null));

                    // TODO: this state is wrong if AI is the caller
                    if (this.setStart == 0) {

                        if (this.userInput == true) {
                            // user is forced
                            // screw the dealer
                        }

                        this.state = GameState.SelectingTrumpSuit;
                        this.userInput = true;
                    } else {
                        this.state = GameState.SelectTrumpSuitAi;
                    }
                    break;
                case GameState.SelectTrumpSuitPrep:
                    this.userInput = false;
                    this.actions.push(new Action("Show-Title-`Phase - Choose to select trump or pass.", -1, null, null, null));

                    this.actions.push(new Action("Show-SelectTrump", -1, null, null, null));
                    this.actions.push(new Action("Remove-Center", -1, this.cardInMiddleForTrump.cardValue, this.cardInMiddleForTrump.cardSuit, null));
                    this.state = GameState.SelectTrumpSuitAi;
                    break;
                case GameState.SelectTrumpSuitAi:
                    //calculate AI work
                    // translate these into actions

                    // for each AI starting position of the set -> user or start of the set
                    //  calculate if he wants to pick up
                    // function: shouldPickUp()
                    //  add a pause and a message
                    //  then either force the player to pick up
                    //  or go to the next AI

                    if (this.dealerScrewedCount >= 4 && this.setStart == 0) {
                        this.actions.push(new Action("Show-Message-`Player " + (1) + " is screwed and must pick a suit.", -1, null, null, null));
                        this.cardInitiative = 0;
                        this.state = GameState.SelectingTrumpSuit;
                        break;
                    }

                    var incrementIfFirst = 0;
                    if (this.setStart == 0) incrementIfFirst = 0;
                    if (this.dealerScrewedCount != 0) incrementIfFirst = 1;

                    for (var i = 0; i < 4; i++) {
                        var eltToCheck = (this.setStart + i + incrementIfFirst) % 4;

                        this.actions.push(new Action("Show-Message-`Player " + (eltToCheck + 1) + "'s turn.", -1, null, null, null));

                        if (eltToCheck == 0) {
                            this.userInput = true;
                            this.dealerScrewedCount++;
                            this.state = GameState.SelectingTrumpSuit;
                            break;
                        } else {
                            var s = this.ShouldChooseTrump(eltToCheck, this.setStart);
                            if (s != Model.Suit.None) {
                                this.actions.push(new Action("Show-Message-`Player " + (eltToCheck + 1) + " decided to select trump.", -1, null, null, null));
                                this.actions.push(new Action("Pause", 1, null, null, null));
                                this.dealerScrewedCount++;
                                this.setTrumpSuitAddUiActions(this.suitToSuitString(s));
                                if (eltToCheck == 2) this.cardInitiative = 0;
                                else this.cardInitiative = 1;
                                this.state = GameState.Game;
                                break;
                            } else {
                                this.actions.push(new Action("Show-Message-`Player " + (eltToCheck + 1) + " decided to pass.", -1, null, null, null));                                
                                this.dealerScrewedCount++;
                                this.actions.push(new Action("Pause", 1, null, null, null));
                            }
                        }
                    }
                    break;

                case GameState.Game:
                    this.actions.push(new Action("Show-StartGame", -1, null, null, null));
                    this.actions.push(new Action("Show-Title-`Phase - Game round " + this.numSet + " start.", -1, null, null, null));
                    this.actions.push(new Action("Show-Message-` ", -1, null, null, null));
                    this.state = GameState.Game_RoundStart;
                    this.roundUserStart = this.setStart;
                    break;

                case GameState.Game_RoundStart:
                    this.currentRoundTurnNumber = 0;
                    this.cardsInMiddleLogic.reset(this.trumpSelector);
                    this.setSecondarySelector("None");
                    //GetCurrentAiPlayer
                    if (this.GetCurrentAiPlayer() == 0){
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
                    this.AddAiAction();
                    break;
                case GameState.Game_DetermineNextPlayerInRound:
                    if(this.currentRoundTurnNumber == 4){
                        this.state = GameState.Game_EndOfRound;
                        this.actions.push(new Action("Pause", 1, null, null, null));
                        break;
                    }
                    else if (this.GetCurrentAiPlayer() == 0){
                        this.state = GameState.Game_UserInputTurn;
                    }
                    else{
                        this.state = GameState.Game_AITurn;
                    }
                    break;
                case GameState.Game_EndOfRound:
                    this.currentSetRoundNumber++;

                    var winnerIndex = this.cardsInMiddleLogic.getWinner();
                    this.roundUserStart = winnerIndex;

                    this.actions.push(new Action("Show-Message-`Player " + (winnerIndex + 1) + " wins this hand.", -1, null, null, null));

                    console.log(this.crossScore + " " + this.sideScore + " " + this.globalCrossScore + " " + this.globalSideScore);

                    if (winnerIndex == 0 || winnerIndex == 2) {
                        this.crossScore++;
                    } else {
                        this.sideScore++;
                    }

                    if (this.currentSetRoundNumber == 5) {
                        // clean up board actions
                        this.actions.push(new Action("Clean-Board", -1, null, null, null));

                        //calculate points here
                        if (this.crossScore > this.sideScore) {
                            this.globalCrossScore++;
                            if (this.crossScore == 5 || this.cardInitiative == 1) {
                                this.globalCrossScore++;
                            }
                            this.actions.push(new Action("Show-Message-`Players 1 and 3 wins this round.", -1, null, null, null));
                        } else {
                            this.globalSideScore++;
                            if (this.sideScore == 5 || this.cardInitiative == 0) {
                                this.globalSideScore++;
                            }
                            this.actions.push(new Action("Show-Message-`Players 2 and 4 wins this round.", -1, null, null, null));
                        }

                        this.actions.push(new Action("Show-Point-`Score: " + this.globalCrossScore + " - " + this.globalSideScore, -1, null, null, null));

                        this.sideScore = 0;
                        this.crossScore = 0;

                        this.state = GameState.Game_EndOfSet;
                        this.setStart = (this.setStart + 1) % 4;
                        this.currentSetRoundNumber = 0;
                    } else {
                        var str = "";
                        for (var i = 0; i < 4; i++) {
                            str += this.cardsInMiddleLogic.cards[i].cardSuit + "," + this.cardsInMiddleLogic.cards[i].cardValue;
                            if (i != 3) str += ";";
                        }
                        this.actions.push(new Action("Clear-" + str + "-" + (winnerIndex + 1), -1, null, null, null));
                        console.log("after:" + this.crossScore + " " + this.sideScore + " " + this.globalCrossScore + " " + this.globalSideScore);

                        this.state = GameState.Game_RoundStart;
                    }

                    break;
                case GameState.Game_EndOfSet:
                    if (this.globalCrossScore >= 10) {
                        this.actions.push(new Action("Win", -1, null, null, null));
                        this.state = GameState.GameEnd;
                    }
                    else if (this.globalSideScore >= 10) {
                        this.actions.push(new Action("Lose", -1, null, null, null));
                        this.state = GameState.GameEnd;
                    } else {
                        this.roundUserStart++;
                        this.numSet++;
                        this.roundUserStart = this.roundUserStart % 4;
                        this.state = GameState.Shuffle;
                        break;                        
                    }
                case GameState.GameEnd:
                    break;
                default:
                    return;
            }    
        }

        IsComplete() {
            return this.globalCrossScore >= 10 || this.globalSideScore >= 10;
        }

        // TODO: add this function
        ShouldChooseTrump(eltToCheck: number, start: number) {
            var forced = false;
            var max = -1;
            var index = 0;
            var keys = ["Hearts", "Diamonds", "Spades", "Clubs"];

            if (start == eltToCheck && this.userInput) {
                forced = true;
            } else {

            }

            var map = {};
            for (var i = 0; i < this.players[eltToCheck].cards.length; i++) {
                var s = this.players[eltToCheck].cards[i].cardSuit;
                if (typeof map[s] === "undefined") {
                    map[s] = 1;
                } else {
                    map[s] = map[s] + 1;
                }
            }

            for (var i = 0; i < 4; i++) {
                if (typeof map[keys[i]] !== "undefined" && map[keys[i]] > max) {
                    max = map[keys[i]];
                    index = i;
                }
            }

            if (max >= 3 || forced) {
                return this.suitStringToSuit(keys[index]);
            }

            return Model.Suit.None;
        }

        // TODO: add this function
        setTrumpSuitAddUiActions(s: string) {
            this.state = GameState.Game;
            this.setTrumpSelector(s);
            this.actions.push(new Action("Show-Suit-`Trump Suit: " + this.suitToSuitString(this.trumpSelector), -1, null, null, null));
        }
    }
}
