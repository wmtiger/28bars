var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fg;
(function (fg) {
    var avatar;
    (function (avatar) {
        var Atk = (function () {
            function Atk(atker, defer) {
                this._atker = atker;
                this._defer = defer;
            }
            return Atk;
        }());
        avatar.Atk = Atk;
        __reflect(Atk.prototype, "fg.avatar.Atk");
    })(avatar = fg.avatar || (fg.avatar = {}));
})(fg || (fg = {}));
//# sourceMappingURL=Atk.js.map