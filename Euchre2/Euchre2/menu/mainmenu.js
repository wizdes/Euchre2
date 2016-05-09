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
                this.game.stage.backgroundColor = '#333';
                // how to set background image?
                this.game.add.sprite(0, 0, 'background');
            };
            MainMenu.prototype.playGame = function () {
                this.game.state.start('game', true);
            };
            return MainMenu;
        }(Phaser.State));
        State.MainMenu = MainMenu;
    })(State = Namespace.State || (Namespace.State = {}));
})(Namespace || (Namespace = {}));
//# sourceMappingURL=mainmenu.js.map