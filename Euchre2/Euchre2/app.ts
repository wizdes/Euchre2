module Namespace {
    export class Game extends Phaser.Game {

        constructor() {
            super({
                width: 900,
                height: 1600,
                renderer: Phaser.AUTO
            });

            this.state.add('game', State.Game);
            this.state.add('instructions', State.Instructions);
            this.state.add('credits', State.Credits);
            this.state.add('mainmenu', State.MainMenu);
            this.state.add('preloader', State.Preloader, true);
        }
    }
}

// export Game to window
var Game = Namespace.Game;
var loadGame = new Game();