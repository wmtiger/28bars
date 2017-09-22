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
        var HpBar = (function (_super) {
            __extends(HpBar, _super);
            function HpBar(maxHp, maxWid) {
                if (maxWid === void 0) { maxWid = 30; }
                var _this = _super.call(this) || this;
                _this._maxWid = 30;
                _this._hei = 2;
                _this._maxHp = 100;
                _this._crtHp = 100;
                _this._maxWid = maxWid;
                _this._barbg = new fairygui.GGraph();
                _this._barbg.graphics.beginFill(0xff0000);
                _this._barbg.graphics.drawRect(0, 0, _this._maxWid, _this._hei);
                _this._barbg.graphics.endFill();
                _this.addChild(_this._barbg);
                _this._bar = new fairygui.GGraph();
                _this._bar.graphics.beginFill(0x00ff00);
                _this._bar.graphics.drawRect(0, 0, _this._maxWid, _this._hei);
                _this._bar.graphics.endFill();
                _this.addChild(_this._bar);
                _this.initMaxHp(maxHp);
                return _this;
            }
            HpBar.prototype.initMaxHp = function (v) {
                this.setMaxHp(v);
                this._crtHp = v;
            };
            HpBar.prototype.setMaxWid = function (v) {
                this._maxWid = v;
                this._barbg.graphics.clear();
                this._barbg.graphics.beginFill(0xff0000);
                this._barbg.graphics.drawRect(0, 0, this._maxWid, this._hei);
                this._barbg.graphics.endFill();
                this.setHp(this._crtHp);
            };
            HpBar.prototype.getMaxWid = function () {
                return this._maxWid;
            };
            HpBar.prototype.setMaxHp = function (v) {
                this._maxHp = v;
            };
            HpBar.prototype.setHp = function (v) {
                this._crtHp = v;
                var bwidth = this._maxWid * (this._crtHp / this._maxHp);
                this._bar.graphics.clear();
                this._bar.graphics.beginFill(0x00ff00);
                this._bar.graphics.drawRect(0, 0, bwidth, this._hei);
                this._bar.graphics.endFill();
            };
            return HpBar;
        }(fairygui.GComponent));
        avatar.HpBar = HpBar;
        __reflect(HpBar.prototype, "fg.avatar.HpBar");
    })(avatar = fg.avatar || (fg.avatar = {}));
})(fg || (fg = {}));
//# sourceMappingURL=HpBar.js.map