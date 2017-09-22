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
        var DesertArcher = (function (_super) {
            __extends(DesertArcher, _super);
            function DesertArcher() {
                var _this = _super.call(this) || this;
                _this._dbproxy.setCamp(avatar.CAMP.DESERT);
                return _this;
            }
            DesertArcher.prototype.initPackSetting = function () {
                this._fairyPkgName = 'enemies';
                this._fairyResName = 'desertArcher';
            };
            DesertArcher.prototype.getInitMediatorName = function () {
                return 'DesertArcher_' + this._dbproxy.getId();
            };
            return DesertArcher;
        }(avatar.Warrior));
        avatar.DesertArcher = DesertArcher;
        __reflect(DesertArcher.prototype, "fg.avatar.DesertArcher");
    })(avatar = fg.avatar || (fg.avatar = {}));
})(fg || (fg = {}));
//# sourceMappingURL=DesertArcher.js.map