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
        var Knight = (function (_super) {
            __extends(Knight, _super);
            function Knight() {
                var _this = _super.call(this) || this;
                _this._dbproxy.setCamp(avatar.CAMP.ARMY);
                return _this;
            }
            Knight.prototype.initPackSetting = function () {
                this._fairyPkgName = 'soldiers';
                this._fairyResName = 'Knight';
            };
            Knight.prototype.getInitMediatorName = function () {
                return 'Knight_' + this._dbproxy.getId();
            };
            Knight.prototype.initProxy = function () {
                this._dbproxy = new avatar.WarriorDataProxy();
                this._dbproxy.init();
                this._dbproxy.setHp(200);
                this._dbproxy.setMaxHp(200);
                this._dbproxy.setAtk(10);
                this._dbproxy.setAtkCd(2000);
            };
            Knight.prototype._atk = function (dir, callback) {
                if (callback === void 0) { callback = null; }
                this._playAction(66, 77, 66, callback, dir);
            };
            Knight.prototype._thron = function () {
                this._playAction(78, 96, 96, null);
            };
            Knight.prototype._thronFree = function () {
                this._playAction(97, 101, 101, null);
            };
            Knight.prototype._playDead = function (dir) {
                this._playAction(102, 109, 109, null, dir);
            };
            return Knight;
        }(avatar.Warrior));
        avatar.Knight = Knight;
        __reflect(Knight.prototype, "fg.avatar.Knight");
    })(avatar = fg.avatar || (fg.avatar = {}));
})(fg || (fg = {}));
//# sourceMappingURL=Knight.js.map