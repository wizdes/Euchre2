var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="screenView.ts"/>
/// <reference path="gameStateController.ts"/>
var Namespace;
(function (Namespace) {
    var State;
    (function (State) {
        var Game = (function (_super) {
            __extends(Game, _super);
            function Game() {
                var _this = this;
                _super.apply(this, arguments);
                // pass this to each cardView to call
                this.handleUserInput = function (suit, value) {
                    if (_this.currentView.shouldMove()) {
                    }
                    alert(suit.toString());
                };
            }
            Game.prototype.preload = function () {
                this.currentView = new ScreenView.ScreenView(this);
                this.gameStateController = new Controller.GameStateController();
            };
            Game.prototype.create = function () {
                // to remove
            };
            Game.prototype.update = function () {
                // if there is a move operation
                if (this.currentView.shouldMove()) {
                    this.currentView.doMoveOperation();
                }
                else if (this.gameStateController.nextActionExists()) {
                    //  pull the action and execute it
                    var action = this.gameStateController.getNextAction();
                    this.currentView.resolveAction(action);
                }
                else {
                    this.gameStateController.setGameState();
                }
            };
            return Game;
        }(Phaser.State));
        State.Game = Game;
    })(State = Namespace.State || (Namespace.State = {}));
})(Namespace || (Namespace = {}));
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
//# sourceMappingURL=mainGame.js.map