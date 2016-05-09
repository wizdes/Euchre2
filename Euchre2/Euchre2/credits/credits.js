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
            };
            return Credits;
        }(Phaser.State));
        State.Credits = Credits;
    })(State = Namespace.State || (Namespace.State = {}));
})(Namespace || (Namespace = {}));
//# sourceMappingURL=credits.js.map