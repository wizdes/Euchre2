module Namespace.State {
    export class MainMenu extends Phaser.State {

        preload() {
        }

        create() {
            //loading screen will have a white background
            this.game.stage.backgroundColor = '#5F9C73';
            // how to set background image?

            this.game.add.text(260, 160, "EUCHRE!", { font: '140px dimboregular', fill: '#000' });

            var startLabel = this.game.add.text(570, 700, "Start", { font: '55px dimboregular', fill: '#000' });
            startLabel.inputEnabled = true;
            startLabel.events.onInputDown.add(this.playGame);

            var instructionsLabel = this.game.add.text(570, 800, "Instructions", { font: '55px dimboregular', fill: '#000' });
            instructionsLabel.inputEnabled = true;
            instructionsLabel.events.onInputDown.add(this.goToInstructions);

            var creditsLabel = this.game.add.text(570, 900, "Credits", { font: '55px dimboregular', fill: '#000' });
            creditsLabel.inputEnabled = true;
            creditsLabel.events.onInputDown.add(this.goToCredits);

            this.game.add.sprite(150, 700, 'icon');
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
