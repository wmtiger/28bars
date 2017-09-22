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
/**
 * 数字滚动逻辑控制处理
 */
var utils;
(function (utils) {
    var NumberScrollController = (function (_super) {
        __extends(NumberScrollController, _super);
        function NumberScrollController(ui, moneyFormat, isAnimation) {
            if (moneyFormat === void 0) { moneyFormat = utils.NTSF_K; }
            if (isAnimation === void 0) { isAnimation = true; }
            var _this = _super.call(this) || this;
            //动画没有播完的时候获取的最新的值
            _this.nowValue = 0;
            _this.duration = 1000;
            _this.numberValue = 0;
            _this.numberUI = ui;
            _this.formatFlag = moneyFormat;
            _this.isAnimation = isAnimation;
            _this.value = _this.nowValue;
            return _this;
        }
        Object.defineProperty(NumberScrollController.prototype, "value", {
            get: function () {
                return this.numberValue;
            },
            set: function (val) {
                var newValue = val;
                if (newValue != this.numberValue && this.isAnimation) {
                    this.setValueAsAnimation(newValue);
                }
                else {
                    this.setValue(newValue);
                }
            },
            enumerable: true,
            configurable: true
        });
        NumberScrollController.prototype.setValueAsAnimation = function (newValue) {
            var _this = this;
            //动画没有播完的时候获取的最新的值
            this.nowValue = newValue;
            //let duration:number = 300;//Math.abs(newValue - this.numberValue) / 300;
            egret.Tween.removeTweens(this);
            egret.Tween.get(this, { onChange: this.onChange, onChangeObj: this })
                .to({ $value: newValue }, this.duration, egret.Ease.quartOut)
                .call(function () {
                _this.renderData(newValue, _this.formatFlag);
                _this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
            });
        };
        NumberScrollController.prototype.setValue = function (newValue) {
            this.numberValue = this.nowValue = newValue;
            this.renderData(newValue, this.formatFlag);
        };
        NumberScrollController.prototype.renderData = function (val, format) {
            val = Math.floor(val);
            if (this.numberUI != null) {
                this.numberUI.text = utils.numberFormat(val, format);
            }
        };
        NumberScrollController.prototype.onChange = function () {
            this.renderData(this.numberValue, this.formatFlag);
        };
        Object.defineProperty(NumberScrollController.prototype, "$value", {
            get: function () {
                return this.numberValue;
            },
            set: function (val) {
                this.numberValue = val;
            },
            enumerable: true,
            configurable: true
        });
        NumberScrollController.prototype.dispose = function () {
            egret.Tween.removeTweens(this);
        };
        return NumberScrollController;
    }(egret.EventDispatcher));
    utils.NumberScrollController = NumberScrollController;
    __reflect(NumberScrollController.prototype, "utils.NumberScrollController");
})(utils || (utils = {}));
//# sourceMappingURL=NumberScrollController.js.map