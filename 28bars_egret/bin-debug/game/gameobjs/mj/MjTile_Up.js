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
var mj;
(function (mj) {
    var MjTile_Up = (function (_super) {
        __extends(MjTile_Up, _super);
        function MjTile_Up() {
            var _this = _super.call(this) || this;
            _this.view = fairygui.UIPackage.createObject("tuitong", "TileUp").asCom;
            _this._content = _this.view.getChild('content').asCom;
            _this._img = new fairygui.GImage();
            _this._content.addChild(_this._img);
            return _this;
        }
        MjTile_Up.prototype.flushTile = function () {
            if (this.mjdata) {
                this._img.texture = RES.getRes('tile_meUp_' + this.mjdata.flower + this.mjdata.num + '_png');
                var x = this._content.initWidth - this._img.texture.textureWidth >> 1;
                this._img.scaleY = 0.9;
                var y = this._content.initHeight - this._img.texture.textureHeight * 0.9 >> 1;
                this._img.setXY(x, y);
            }
        };
        return MjTile_Up;
    }(mj.MjTile));
    mj.MjTile_Up = MjTile_Up;
    __reflect(MjTile_Up.prototype, "mj.MjTile_Up");
})(mj || (mj = {}));
//# sourceMappingURL=MjTile_Up.js.map