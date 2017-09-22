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
        var DesertScorpion = (function (_super) {
            __extends(DesertScorpion, _super);
            function DesertScorpion() {
                var _this = _super.call(this) || this;
                _this._dbproxy.setCamp(avatar.CAMP.DESERT);
                _this._dbproxy.setAtkCd(2000);
                _this._dbproxy.setAtk(13);
                return _this;
            }
            DesertScorpion.prototype.initPackSetting = function () {
                this._fairyPkgName = 'enemies';
                this._fairyResName = 'scorpion';
            };
            DesertScorpion.prototype.getInitMediatorName = function () {
                return 'DesertScorpion_' + this._dbproxy.getId();
            };
            return DesertScorpion;
        }(avatar.Warrior));
        avatar.DesertScorpion = DesertScorpion;
        __reflect(DesertScorpion.prototype, "fg.avatar.DesertScorpion");
    })(avatar = fg.avatar || (fg.avatar = {}));
})(fg || (fg = {}));
//# sourceMappingURL=DesertScorpion.js.map