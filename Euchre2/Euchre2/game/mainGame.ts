/// <reference path="screenView.ts"/>
module Namespace.State {
    export class Game extends Phaser.State {
        currentView: ScreenView.ScreenView;

        preload() {
            this.currentView = new ScreenView.ScreenView(this);

        }

        create() {
        }
    }
}
