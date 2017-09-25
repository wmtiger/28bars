var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var utils;
(function (utils) {
    var TimeUtil = (function () {
        function TimeUtil() {
        }
        return TimeUtil;
    }());
    utils.TimeUtil = TimeUtil;
    __reflect(TimeUtil.prototype, "utils.TimeUtil");
    function getCrtTimeStamp() {
        var t = new Date();
        return t.getTime();
    }
    utils.getCrtTimeStamp = getCrtTimeStamp;
})(utils || (utils = {}));
//# sourceMappingURL=TimeUtil.js.map