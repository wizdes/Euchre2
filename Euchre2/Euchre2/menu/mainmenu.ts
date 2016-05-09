module Namespace.State {
    export class MainMenu extends Phaser.State {

        preload() {
        }

        create() {
            //loading screen will have a white background
            this.game.stage.backgroundColor = '#eee';
            // how to set background image?

            this.game.add.text(500, 200, "EUCHRE!", { font: '60px dimboregular', fill: '#000' });

            var startLabel = this.game.add.text(500, 600, "Start", { font: '55px dimboregular', fill: '#000' });
            startLabel.inputEnabled = true;
            startLabel.events.onInputDown.add(this.playGame);

            var instructionsLabel = this.game.add.text(500, 700, "Instructions", { font: '55px dimboregular', fill: '#000' });
            instructionsLabel.inputEnabled = true;
            instructionsLabel.events.onInputDown.add(this.goToInstructions);

            var creditsLabel = this.game.add.text(500, 800, "Credits", { font: '55px dimboregular', fill: '#000' });
            creditsLabel.inputEnabled = true;
            creditsLabel.events.onInputDown.add(this.goToCredits);
        }

        goToInstructions(event) {
            event.game.state.start('instructions', true);            
        }

        goToCredits(event) {
            event.game.state.start('credits', true);
        }

        playGame(event) {
            event.game.state.start('game', true);
        }
    }
}
