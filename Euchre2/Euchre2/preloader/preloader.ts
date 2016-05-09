module Namespace.State {
    export class Preloader extends Phaser.State {
        loadingBar: Entity.PreloadBar;

        preload() {
            this.loadingBar = new Entity.PreloadBar(this.game);
        }

        create() {
            this.loadingBar.setFillPercent(100);
            var tween = this.game.add.tween(this.loadingBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);

            // loading screen will have a white background
            this.game.stage.backgroundColor = '#fff';

            // scaling options
            // this makes it scale to the screen
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    
            //have the game centered horizontally
            //this.scale.pageAlignHorizontally = true;
            //this.scale.pageAlignVertically = true;

            //physics system
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

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
