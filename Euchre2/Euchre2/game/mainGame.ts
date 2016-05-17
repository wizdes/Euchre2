/// <reference path="screenView.ts"/>
/// <reference path="gameStateController.ts"/>
module Namespace.State {
    export class Game extends Phaser.State {
        currentView: ScreenView.ScreenView;
        gameStateController: Controller.GameStateController;

        preload() {
            this.currentView = new ScreenView.ScreenView(this);
            this.gameStateController = new Controller.GameStateController();

            //print a card
            // go in, and move a card
            // build a shuffle game state and and use the AI to shuffle the cards
        }

        create() {
            // to remove
            //this.currentView.drawAt(50, 50, "Clubs", "A", 500, 500);
        }

        update() {
            // if there is a move operation
            if (this.currentView.shouldMove()) {
                this.currentView.doMoveOperation();
            } else if (this.gameStateController.nextActionExists()) {
                //  pull the action and execute it
                var action = this.gameStateController.getNextAction();

                this.currentView.resolveAction(action);

            } else {
                this.gameStateController.setGameState();
            }
        }

        // pass this to each cardView to call
        handleUserInput = (suit: string, value: string): void => {
            if (this.currentView.shouldMove()) {
                // skip, since you can't do anything if something is moving
            }

            alert(suit.toString());
        }
    }
}

// this is what i want for the delegates 
//class Foo {
//    save(callback: (n: number) => any): void {
//        callback(42);
//    }
//}
//var foo = new Foo();

//var numCallback = (result: number): void => {
//    alert(result.toString());
//}

//foo.save(numCallback); // OK

// action

// callBack function:
// check Game status (is there an blocking animation/thing going on right now?)
// if Yes, skip
// if No:
// get the current game state
// Get what the current action is
// is this a valid option?
// if it is a valid option:
// encode the movement

// update function will run blocking animations/states
// if blocking, do the action 
//  call move
//  get the game state
//  if there is a blocking action
//      blocking action here is like a callback called by the update function
//      includes waiting
//      do the blocking action
//          like AI wait, or AI encode move

