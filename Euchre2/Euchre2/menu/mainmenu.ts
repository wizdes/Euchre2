module Namespace.State {
    export class MainMenu extends Phaser.State {

        preload() {
        }

        create() {
            //loading screen will have a white background
            this.game.stage.backgroundColor = '#333';
            // how to set background image?

            this.game.add.sprite(0, 0, 'background');
        }

        playGame() {
            this.game.state.start('game', true);
        }
    }
}
