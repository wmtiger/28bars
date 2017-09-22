var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var mj;
(function (mj) {
    /** type=1则是万条筒; 2是字; 3是花; 可以用 1|2|4|8|16 的方式来获取不同的需求 */
    function getRandomMjs(type) {
        if (type === void 0) { type = 1; }
        var mjs = [];
        if (type & mj.MjData.WAN) {
            // 初始化 万 36张
            for (var i = 1; i <= 9; i++) {
                for (var j = 0; j < 4; j++) {
                    var d = new mj.MjData('', i, 0); //{ flower: '', num: i, hasMo: 0 };
                    mjs.push(d);
                }
            }
        }
        if (type & mj.MjData.TIAO) {
            // 初始化 条 36张
            for (var i = 1; i <= 9; i++) {
                for (var j = 0; j < 4; j++) {
                    var d = new mj.MjData('1', i, 0); //{ flower: '1', num: i, hasMo: 0 };
                    mjs.push(d);
                }
            }
        }
        if (type & mj.MjData.TONG) {
            // 初始化 筒 36张
            for (var i = 1; i <= 9; i++) {
                for (var j = 0; j < 4; j++) {
                    var d = new mj.MjData('2', i, 0); //{ flower: '2', num: i, hasMo: 0 };
                    mjs.push(d);
                }
            }
        }
        if (type & mj.MjData.ZI) {
            // 初始化 字 28张
            for (var i = 1; i <= 7; i++) {
                for (var j = 0; j < 4; j++) {
                    var d = new mj.MjData('3', i, 0); //{ flower: '3', num: i, hasMo: 0 };
                    mjs.push(d);
                }
            }
        }
        if (type & mj.MjData.HUA) {
            // 初始化 花 32张
            for (var i = 1; i <= 8; i++) {
                for (var j = 0; j < 4; j++) {
                    var d = new mj.MjData('4', i, 0); //{ flower: '4', num: i, hasMo: 0 };
                    mjs.push(d);
                }
            }
        }
        utils.upsetArray(mjs);
        return mjs;
    }
    mj.getRandomMjs = getRandomMjs;
    var MjTools = (function () {
        function MjTools() {
        }
        return MjTools;
    }());
    mj.MjTools = MjTools;
    __reflect(MjTools.prototype, "mj.MjTools");
})(mj || (mj = {}));
//# sourceMappingURL=MjTools.js.map