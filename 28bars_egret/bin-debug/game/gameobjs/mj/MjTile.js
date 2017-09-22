var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var mj;
(function (mj) {
    var MjTile = (function () {
        function MjTile() {
        }
        Object.defineProperty(MjTile.prototype, "mjdata", {
            get: function () {
                return this._mjdata;
            },
            set: function (d) {
                this._mjdata = d;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MjTile.prototype, "view", {
            get: function () {
                return this._view;
            },
            set: function (v) {
                this._view = v;
            },
            enumerable: true,
            configurable: true
        });
        MjTile.prototype.flushTile = function () {
        };
        return MjTile;
    }());
    mj.MjTile = MjTile;
    __reflect(MjTile.prototype, "mj.MjTile", ["mj.IMjTile"]);
    var MjData = (function () {
        function MjData(f, n, m) {
            if (f === void 0) { f = ''; }
            if (n === void 0) { n = 0; }
            if (m === void 0) { m = 0; }
            this.id = 0;
            /** 花色: [''->'4'] */
            this.flower = '';
            /** 字面: [1-9] */
            this.num = 1;
            /** 已经被执行的操作 0无 1吃 2碰 3杠/ 4胡 */
            this.action = 0;
            this.flower = f;
            this.num = n;
            this.action = m;
            this.id = MjData.CRT_ID++;
        }
        MjData.WAN = 1;
        MjData.TIAO = 2;
        MjData.TONG = 4;
        MjData.ZI = 8;
        MjData.HUA = 16;
        MjData.CRT_ID = 1; // 当前的总id值，一直累加
        return MjData;
    }());
    mj.MjData = MjData;
    __reflect(MjData.prototype, "mj.MjData");
})(mj || (mj = {}));
//# sourceMappingURL=MjTile.js.map