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
fairygui.GLoader.prototype["applyColor"] = function () {
    var cfm = this.getColorMatrix();
    var matrix = cfm.matrix;
    matrix[0] = ((this._color >> 16) & 0xFF) / 255;
    matrix[6] = ((this._color >> 8) & 0xFF) / 255;
    matrix[12] = (this._color & 0xFF) / 255;
    cfm.matrix = matrix;
};
fairygui.GLoader.prototype["getColorMatrix"] = function () {
    if (this._matrix)
        return this._matrix;
    if (this._content) {
        var filters = this._content.filters;
        if (filters) {
            for (var i = 0; i < filters.length; i++) {
                if (egret.is(filters[i], "egret.ColorMatrixFilter")) {
                    this._matrix = filters[i];
                    return this._matrix;
                }
            }
        }
    }
    var cmf = new egret.ColorMatrixFilter();
    this._matrix = cmf;
    filters = filters || [];
    filters.push(cmf);
    this._content.filters = filters;
    return cmf;
};
var fairygui;
(function (fairygui) {
    /// <summary>
    /// 长按手势。当按下一定时间后(duration)，派发onAction，如果once为false，则间隔duration时间持续派发onAction，直到手指释放。
    /// </summary>
    var LongPressGesture = (function (_super) {
        __extends(LongPressGesture, _super);
        function LongPressGesture(host) {
            var _this = _super.call(this) || this;
            _this.host = host;
            _this.trigger = LongPressGesture.TRIGGER;
            _this.interval = LongPressGesture.INTERVAL;
            _this.holdRangeRadius = 50;
            _this._timerId = -1;
            _this.enable(true);
            return _this;
        }
        LongPressGesture.prototype.dispose = function () {
            this.enable(false);
            this.host = null;
        };
        LongPressGesture.prototype.enable = function (value) {
            if (value) {
                this.host.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.__touchBegin, this);
                this.host.addEventListener(egret.TouchEvent.TOUCH_END, this.__touchEnd, this);
            }
            else {
                this.host.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.__touchBegin, this);
                this.host.removeEventListener(egret.TouchEvent.TOUCH_END, this.__touchEnd, this);
                egret.clearTimeout(this._timerId);
                fairygui.GRoot.inst.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.__timer, this);
            }
        };
        LongPressGesture.prototype.cancel = function () {
            fairygui.GRoot.inst.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.__timer, this);
            egret.clearTimeout(this._timerId);
            this._started = false;
        };
        LongPressGesture.prototype.__touchBegin = function (event) {
            this._startPoint = new egret.Point(event.stageX, event.stageY);
            this._started = false;
            this._timerId = egret.setTimeout(this.__timer, this, this.trigger * 1000);
            fairygui.GRoot.inst.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.__timer, this);
        };
        LongPressGesture.prototype.__timer = function (param) {
            if (param instanceof egret.TouchEvent) {
                var pt = new egret.Point(param.stageX, param.stageY);
                if (Math.pow(pt.x - this._startPoint.x, 2) + Math.pow(pt.y - this._startPoint.y, 2) > Math.pow(this.holdRangeRadius, 2)) {
                    this.cancel();
                }
                return;
            }
            if (!this._started) {
                this._started = true;
                this.dispatchEvent(new egret.Event(LongPressGesture.BEGIN));
                if (!this.justonce)
                    this._timerId = egret.setTimeout(this.__timer, this, this.interval * 1000);
            }
            this.dispatchEvent(new egret.Event(LongPressGesture.ACTION));
        };
        LongPressGesture.prototype.__touchEnd = function (event) {
            egret.clearTimeout(this._timerId);
            fairygui.GRoot.inst.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.__timer, this);
            if (this._started) {
                this._started = false;
                this.dispatchEvent(new egret.Event(LongPressGesture.END));
            }
        };
        /// <summary>
        /// 当手指按下时派发该事件。
        /// </summary>
        LongPressGesture.BEGIN = "onLongPressBegin";
        /// <summary>
        /// 手指离开屏幕时派发该事件。
        /// </summary>
        LongPressGesture.END = "onLongPressEnd";
        /// <summary>
        /// 当手指按下后一段时间后派发该事件。并且在手指离开前按一定周期派发该事件。
        /// </summary>
        LongPressGesture.ACTION = "onLongPressAction";
        LongPressGesture.TRIGGER = 1.5;
        LongPressGesture.INTERVAL = 1;
        return LongPressGesture;
    }(egret.EventDispatcher));
    fairygui.LongPressGesture = LongPressGesture;
    __reflect(LongPressGesture.prototype, "fairygui.LongPressGesture");
})(fairygui || (fairygui = {}));
//# sourceMappingURL=FairyguiPlus.js.map