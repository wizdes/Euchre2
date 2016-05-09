var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Namespace;
(function (Namespace) {
    var State;
    (function (State) {
        var MainMenu = (function (_super) {
            __extends(MainMenu, _super);
            function MainMenu() {
                _super.apply(this, arguments);
            }
            MainMenu.prototype.preload = function () {
            };
            MainMenu.prototype.create = function () {
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
            };
            MainMenu.prototype.goToInstructions = function (event) {
                event.game.state.start('instructions', true);
            };
            MainMenu.prototype.goToCredits = function (event) {
                event.game.state.start('credits', true);
            };
            MainMenu.prototype.playGame = function (event) {
                event.game.state.start('game', true);
            };
            return MainMenu;
        }(Phaser.State));
        State.MainMenu = MainMenu;
    })(State = Namespace.State || (Namespace.State = {}));
})(Namespace || (Namespace = {}));
//# sourceMappingURL=mainmenu.js.map