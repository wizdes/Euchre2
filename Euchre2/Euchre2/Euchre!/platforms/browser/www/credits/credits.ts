module Namespace.State {
    export class Credits extends Phaser.State {

        preload() {
        }

        create() {
            var backObj = this.game.add.text(800, 5, "Back", { font: '60px dimboregular', fill: '#000' });
            backObj.inputEnabled = true;
            backObj.events.onInputDown.add(event => {
                event.game.state.start('mainmenu', true);
            });

            var style = { font: 'bold 60pt dimboregular', fill: 'black', align: 'left', wordWrap: true, wordWrapWidth: 450 };

            var text = this.game.add.text(this.game.world.centerX, 600, "Thanks Dan and Spencer for your support and help!", style);
            text.anchor.set(0.5);
        }
    }
}
