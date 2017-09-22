var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var utils;
(function (utils) {
    //随机一个a~b的整数，包含a和b
    function random(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
    utils.random = random;
    function upsetArray(array) {
        var len = array.length;
        for (var i = 0; i < len; ++i) {
            var r = Math.floor(Math.random() * len);
            var t = array[i];
            array[i] = array[r];
            array[r] = t; //随机交换所有牌
        }
    }
    utils.upsetArray = upsetArray;
    function getDistance(p1, p2) {
        var w = p1.x > p2.x ? p1.x - p2.x : p2.x - p1.x;
        var h = p1.y > p2.y ? p1.y - p2.y : p2.y - p1.y;
        return Math.sqrt(w * w + h * h);
    }
    utils.getDistance = getDistance;
    function average() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        for (var i = 0, s = 0; i < len; ++i) {
            if (args[i] instanceof Array) {
                s += average.apply(this, args[i]);
            }
            else {
                s += args[i];
            }
        }
        return s / len;
    }
    utils.average = average;
    /** 计算位移距离 */
    function physical_s(t, a, u) {
        return a * t > u ? u * u / 2 / a + u * (t - u / a) : a * t * t / 2;
    }
    utils.physical_s = physical_s;
    /** 计算当前速度 */
    function physical_u(t, a, u) {
        return a * t > u ? u : a * t;
    }
    utils.physical_u = physical_u;
    var BezierNode = (function () {
        function BezierNode(target, pt1, pt2, pt3) {
            this.t = 0; //它是从0到1的闭区间。
            if (target == null)
                return;
            if (pt1 == null)
                return;
            if (pt2 == null)
                return;
            if (pt3 == null)
                return;
            this.p1 = pt1;
            this.p2 = pt2;
            this.p3 = pt3;
            this.tar = target;
        }
        /**
         * 随机生成p2
         */
        BezierNode.prototype.generatorP2 = function (scaleX, scaleY, isCenter) {
            if (scaleX === void 0) { scaleX = 1; }
            if (scaleY === void 0) { scaleY = 1; }
            if (isCenter === void 0) { isCenter = false; }
            var vx = this.p3.x - this.p1.x;
            var vy = this.p3.y - this.p1.y;
            var flagX = Math.floor(Math.random() * 100 % 2) == 0 ? -1 : 1;
            var flagY = Math.floor(Math.random() * 100 % 2) == 0 ? -1 : 1;
            var tx = Math.abs(vx * scaleX) * Math.random() * flagX;
            var ty = Math.abs(vy * scaleY) * Math.random() * flagY;
            if (isCenter) {
                tx = vx / 2;
                ty = tx * flagY;
            }
            this.p2 = new egret.Point(this.p1.x + tx, this.p1.y + ty);
            return this.p2;
        };
        Object.defineProperty(BezierNode.prototype, "factor", {
            get: function () {
                return this.t;
            },
            /**设置参数T */
            set: function (value) {
                this.t = value;
                this.tar.x = (1 - value) * (1 - value) * this.p1.x + 2 * value * (1 - value) * this.p2.x + value * value * this.p3.x;
                this.tar.y = (1 - value) * (1 - value) * this.p1.y + 2 * value * (1 - value) * this.p2.y + value * value * this.p3.y;
            },
            enumerable: true,
            configurable: true
        });
        return BezierNode;
    }());
    utils.BezierNode = BezierNode;
    __reflect(BezierNode.prototype, "utils.BezierNode");
})(utils || (utils = {}));
//# sourceMappingURL=MathUtils.js.map