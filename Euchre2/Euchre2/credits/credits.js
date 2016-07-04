var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Namespace;
(function (Namespace) {
    var State;
    (function (State) {
        var Credits = (function (_super) {
            __extends(Credits, _super);
            function Credits() {
                _super.apply(this, arguments);
            }
            Credits.prototype.preload = function () {
            };
            Credits.prototype.create = function () {
                var backObj = this.game.add.text(800, 5, "Back", { font: '60px dimboregular', fill: '#000' });
                backObj.inputEnabled = true;
                backObj.events.onInputDown.add(function (event) {
                    event.game.state.start('mainmenu', true);
                });
                var style = { font: 'bold 60pt dimboregular', fill: 'black', align: 'left', wordWrap: true, wordWrapWidth: 450 };
                var text = this.game.add.text(this.game.world.centerX, 600, "Thanks Dan and Spencer for your support and help!", style);
                text.anchor.set(0.5);
            };
            return Credits;
        }(Phaser.State));
        State.Credits = Credits;
    })(State = Namespace.State || (Namespace.State = {}));
})(Namespace || (Namespace = {}));
//# sourceMappingURL=credits.js.map