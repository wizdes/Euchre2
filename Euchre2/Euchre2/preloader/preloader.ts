module Namespace.State {
    export class Preloader extends Phaser.State {
        loadingBar: Entity.PreloadBar;

        preload() {
            this.loadingBar = new Entity.PreloadBar(this.game);

            var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
            var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

            for (var i = 0; i < suits.length; i++) {
                for (var j = 0; j < values.length; j++) {
                    var suit = suits[i];
                    var value = values[j];
                    this.load.image(suit + "-" + value, 'assets/card' + suit + value + '.png');
                }
            }

            this.load.image("cardBack", "assets/cardBack_red3.png");

        }

        create() {
            this.loadingBar.setFillPercent(100);
            var tween = this.game.add.tween(this.loadingBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);

            // loading screen will have a white background
            this.game.stage.backgroundColor = '#000';

            // scaling options
            // this makes it scale to the screen
            this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('mainmenu', true);
        }

        loadUpdate() {
            this.loadingBar.setFillPercent(this.load.progress);
        }
    }
}
