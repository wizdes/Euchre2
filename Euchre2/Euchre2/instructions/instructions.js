var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Namespace;
(function (Namespace) {
    var State;
    (function (State) {
        var Instructions = (function (_super) {
            __extends(Instructions, _super);
            function Instructions() {
                _super.apply(this, arguments);
            }
            Instructions.prototype.preload = function () {
            };
            Instructions.prototype.create = function () {
            };
            return Instructions;
        }(Phaser.State));
        State.Instructions = Instructions;
    })(State = Namespace.State || (Namespace.State = {}));
})(Namespace || (Namespace = {}));
//# sourceMappingURL=instructions.js.map