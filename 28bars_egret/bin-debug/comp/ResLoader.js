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
 * RES 资源加载
 */
var utils;
(function (utils) {
    var ResLoader = (function (_super) {
        __extends(ResLoader, _super);
        function ResLoader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._virturlIntervalId = -1;
            _this._virturlTimeout = -1;
            _this.showTime = 2000;
            return _this;
        }
        ResLoader.prototype.loadGroups = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length == 1 && args[0] instanceof Array)
                args = args[0];
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this._groupNames = args;
            this._groupProgress = [];
            var len = args.length;
            for (var i = 0; i < len; ++i) {
                this._groupProgress[i] = 0;
                RES.loadGroup(args[i], i * -1);
            }
            this._startTime = egret.getTimer();
        };
        /**
         * preload资源组加载完成
         * Preload resource group is loaded
         */
        ResLoader.prototype.onResourceLoadComplete = function (event) {
            var index = this._groupNames.indexOf(event.groupName);
            if (index != -1)
                this._groupProgress[index] = 1;
            if (utils.average(this._groupProgress) == 1) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                var delayTime = egret.getTimer() - this._startTime - this.showTime;
                if (delayTime > 0) {
                    this.dispatchEvent(new egret.Event("complete"));
                }
                else {
                    this._virturlIntervalId = egret.setInterval(this.dispatchEvent, this, 80, new egret.Event("loading"));
                    this._virturlTimeout = egret.setTimeout(this.dispatchEvent, this, -delayTime, new egret.Event("complete"));
                }
            }
        };
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        ResLoader.prototype.onResourceLoadError = function (event) {
            //TODO
            console.warn("Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //Ignore the loading failed projects
            // this.onResourceLoadComplete(event);
        };
        /**
         * preload资源组加载进度
         * Loading process of preload resource group
         */
        ResLoader.prototype.onResourceProgress = function (event) {
            var index = this._groupNames.indexOf(event.groupName);
            if (index != -1) {
                // console.log(event.groupName+">>"+event.itemsLoaded+"/"+event.itemsTotal);
                this._groupProgress[index] = event.itemsLoaded / event.itemsTotal;
                this.dispatchEvent(new egret.Event("loading"));
            }
        };
        Object.defineProperty(ResLoader.prototype, "progress", {
            get: function () {
                var t = egret.getTimer() - this._startTime; //实际运行的时间
                var pt = t / this.showTime; //理论匀速的时间
                var pi = utils.average(this._groupProgress);
                // console.log("pt:"+pt+" pi:"+pi);
                return pt < pi ? pt : pi;
            },
            enumerable: true,
            configurable: true
        });
        return ResLoader;
    }(egret.EventDispatcher));
    utils.ResLoader = ResLoader;
    __reflect(ResLoader.prototype, "utils.ResLoader");
})(utils || (utils = {}));
//# sourceMappingURL=ResLoader.js.map