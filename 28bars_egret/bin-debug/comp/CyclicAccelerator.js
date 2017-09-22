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
var utils;
(function (utils) {
    var CyclicAcceleratorState = (function () {
        function CyclicAcceleratorState() {
        }
        CyclicAcceleratorState.STAY = "stay";
        CyclicAcceleratorState.UPSPEED = "upspeed";
        CyclicAcceleratorState.FULLSPEED = "fullspeed";
        CyclicAcceleratorState.BREAKING = "breaking";
        return CyclicAcceleratorState;
    }());
    utils.CyclicAcceleratorState = CyclicAcceleratorState;
    __reflect(CyclicAcceleratorState.prototype, "utils.CyclicAcceleratorState");
    var CyclicAcceleratorEvent = (function (_super) {
        __extends(CyclicAcceleratorEvent, _super);
        function CyclicAcceleratorEvent(type, accelerator) {
            var _this = _super.call(this, type, false, false, accelerator) || this;
            _this.accelerator = accelerator;
            return _this;
        }
        CyclicAcceleratorEvent.START = "start";
        CyclicAcceleratorEvent.FULLSPEED = "fullspeed";
        CyclicAcceleratorEvent.BREAK = "break";
        CyclicAcceleratorEvent.OUT = "out";
        CyclicAcceleratorEvent.BUFF_START = "buff_start";
        CyclicAcceleratorEvent.STOP = "stop";
        return CyclicAcceleratorEvent;
    }(egret.Event));
    utils.CyclicAcceleratorEvent = CyclicAcceleratorEvent;
    __reflect(CyclicAcceleratorEvent.prototype, "utils.CyclicAcceleratorEvent");
    var AcceleratorBuff = (function () {
        function AcceleratorBuff() {
        }
        return AcceleratorBuff;
    }());
    utils.AcceleratorBuff = AcceleratorBuff;
    __reflect(AcceleratorBuff.prototype, "utils.AcceleratorBuff");
    var CyclicAccelerator = (function (_super) {
        __extends(CyclicAccelerator, _super);
        function CyclicAccelerator(id, isFirst, isLast) {
            var _this = _super.call(this) || this;
            _this._coordinate = 0; //坐标
            _this._targetCoor = -1; //目标坐标
            _this._acceleration = .0015; //加速度
            _this._breakTime = 800; //全速制动时间
            _this._currentSpeed = 0; //当前速度
            _this._topSpeed = 1.6; //最高速度
            _this._bufflist = [];
            _this._currentIndex = 0;
            _this._lastIndex = 0;
            _this.id = 0; //序号（无内置功能，仅为标记用）
            _this.gap = 0; //元素间距(首尾边距为1/2 gap)
            _this._state = CyclicAcceleratorState.STAY;
            _this._startTime = 0;
            _this._timerId = -1;
            _this.blurFilter = new egret.BlurFilter(0, 3);
            _this.id = id;
            _this.isFirst = isFirst;
            _this.isLast = isLast;
            return _this;
        }
        CyclicAccelerator.prototype.setSize = function (areaSize, itemSize) {
            this.areaSize = areaSize;
            this.itemSize = itemSize;
            this.numItems = Math.floor(this.areaSize / this.itemSize) + 1;
            return this;
        };
        CyclicAccelerator.prototype.setItem = function (param) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._itemParam = param;
            this._items = args;
            return this;
        };
        CyclicAccelerator.prototype.addItem = function (item) {
            if (this._items == null)
                this._items = [];
            this._items.push(item);
            return this;
        };
        CyclicAccelerator.prototype.getItem = function (index) {
            if (this._items == null)
                return null;
            if (index >= this._items.length)
                return null;
            return this._items[index];
        };
        /** 监听函数会促发，新更新的ICON项，第二个参数为序号，第三个参数会最后一个的序号，0表示未知 */
        CyclicAccelerator.prototype.setUpdate = function (listener, thisObj, param) {
            this._updateListener = listener;
            this._listenerThisObj = thisObj;
            this._listenerParamObj = param;
            return this;
        };
        CyclicAccelerator.prototype.reset = function () {
            this._startTime = egret.getTimer();
            this._outEventDispatched = false;
            this._currentIndex = 0;
            this._lastIndex = 0;
            this._targetCoor = -1;
            this._bufflist = [];
            this.step();
        };
        CyclicAccelerator.prototype.setSpeedBuff = function (speed, delay) {
            if (delay === void 0) { delay = 0; }
            var buff = this.getSpeedBuff(1);
            if (buff == null) {
                buff = new AcceleratorBuff();
                buff.id = 1; //暂时只有一个BUFF，所以不管理ID，直接写死就好
                buff.acc = this._acceleration;
                buff.speed = speed;
                buff.startTime = egret.getTimer() + delay;
                buff.endTime = -1;
                this._bufflist.push(buff);
            }
        };
        CyclicAccelerator.prototype.getSpeedBuff = function (id) {
            var len = this._bufflist.length;
            for (var i = 0; i < len; ++i) {
                var buff = this._bufflist[i];
                if (buff.id = id)
                    return buff;
            }
            return null;
        };
        CyclicAccelerator.prototype.start = function () {
            this.reset();
            if (this._timerId == -1) {
                this._timerId = egret.setInterval(this.step, this, 16);
            }
            this._state = CyclicAcceleratorState.UPSPEED;
            this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.START));
        };
        CyclicAccelerator.prototype.stop = function () {
            this._lastIndex = this._currentIndex + this.numItems;
            // var tarCoor = this._coordinate + this.gapSize * this.numItems;
            this._targetCoor = this._lastIndex * this.gapSize;
            var bt = this._breakTime * Math.sqrt(Math.sqrt(this._topSpeed / this._currentSpeed));
            egret.Tween.get(this).to({ _coordinate: this._targetCoor }, bt, egret.Ease.getBackOut(1.5)).call(this.over, this);
            this._state = CyclicAcceleratorState.BREAKING;
            this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.BREAK));
        };
        CyclicAccelerator.prototype.over = function () {
            if (this._timerId != -1) {
                egret.clearInterval(this._timerId);
                this._timerId = -1;
            }
            this._state = CyclicAcceleratorState.STAY;
            this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.STOP));
        };
        CyclicAccelerator.prototype.step = function () {
            if (this._state != CyclicAcceleratorState.BREAKING) {
                this.physical();
                if (this._state == CyclicAcceleratorState.UPSPEED
                    && this._currentSpeed >= this._topSpeed) {
                    this._state = CyclicAcceleratorState.FULLSPEED;
                    this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.FULLSPEED));
                }
            }
            if (!this._outEventDispatched && this._targetCoor != -1 && this._coordinate > this._targetCoor) {
                this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.OUT));
                this._outEventDispatched = true;
            }
            this.update();
        };
        CyclicAccelerator.prototype.physical = function () {
            var now = egret.getTimer();
            var t = now - this._startTime;
            var a = this._acceleration;
            var u = this._topSpeed;
            this._currentSpeed = utils.physical_u(t, a, u);
            this._coordinate = utils.physical_s(t, a, u);
            var len = this._bufflist.length;
            for (var i = 0; i < len; ++i) {
                var buff = this._bufflist[i];
                var time = now - buff.startTime;
                if (time > 0) {
                    this._coordinate += utils.physical_s(time, buff.acc, buff.speed);
                    if (!buff._startEventDispatched) {
                        this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.BUFF_START, false, false, buff));
                        buff._startEventDispatched = true;
                    }
                }
            }
        };
        Object.defineProperty(CyclicAccelerator.prototype, "gapSize", {
            get: function () { return this.itemSize + this.gap; },
            enumerable: true,
            configurable: true
        });
        CyclicAccelerator.prototype.update = function () {
            var index = Math.floor(this._coordinate / (this.gapSize));
            while (index > this._currentIndex) {
                var item = this._items.pop();
                if (this._updateListener != null) {
                    this._updateListener.call(this._listenerThisObj, item, index, this._lastIndex, this._listenerParamObj);
                }
                this._items.unshift(item);
                ++this._currentIndex;
            }
            var c = (this._coordinate % this.gapSize) - this.gapSize;
            for (var i = 0; i < this.numItems; ++i) {
                this._items[i][this._itemParam] = c + this.gapSize * i + this.gap / 2;
                //测试功能+++
                // var blurItem:fairygui.GComponent = this._items[i];
                // if(this._state == CyclicAcceleratorState.FULLSPEED) {
                //     if (blurItem.filters==null||blurItem.filters.length==0) {
                //         blurItem.filters = [this.blurFilter];
                //     }
                // } else {
                //     blurItem.filters = null;
                // }
                //测试功能---
            }
        };
        return CyclicAccelerator;
    }(egret.EventDispatcher));
    utils.CyclicAccelerator = CyclicAccelerator;
    __reflect(CyclicAccelerator.prototype, "utils.CyclicAccelerator");
})(utils || (utils = {}));
//# sourceMappingURL=CyclicAccelerator.js.map