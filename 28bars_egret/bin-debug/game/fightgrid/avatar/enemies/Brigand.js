var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var fg;
(function (fg) {
    var avatar;
    (function (avatar) {
        var Brigand = (function (_super) {
            __extends(Brigand, _super);
            function Brigand() {
                var _this = _super.call(this) || this;
                _this._dbproxy.setCamp(avatar.CAMP.BRIGAND);
                return _this;
            }
            Brigand.prototype.initPackSetting = function () {
                this._fairyPkgName = 'enemies';
                this._fairyResName = 'brigand';
            };
            Brigand.prototype.setViewPivot = function () {
                this.view.setPivot(0.6, 0.8, true);
            };
            Brigand.prototype.getInitMediatorName = function () {
                return 'Brigand_' + this._dbproxy.getId();
                // egret.setTimeout()
            };
            return Brigand;
        }(avatar.Warrior));
        avatar.Brigand = Brigand;
        __reflect(Brigand.prototype, "fg.avatar.Brigand");
    })(avatar = fg.avatar || (fg.avatar = {}));
})(fg || (fg = {}));
//# sourceMappingURL=Brigand.js.map