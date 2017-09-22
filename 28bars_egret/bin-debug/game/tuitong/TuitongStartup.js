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
var tuitong;
(function (tuitong) {
    var TuitongStartup = (function (_super) {
        __extends(TuitongStartup, _super);
        function TuitongStartup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TuitongStartup.prototype.registerNet = function () {
        };
        TuitongStartup.prototype.registerUi = function () {
            ui.register(300 /* TUITONG */, ui.TuitongScreen);
        };
        TuitongStartup.prototype.startup = function () {
            this.moduleProxy = tuitong.TuitongProxy.inst;
            this.moduleProxy.setServer(cfg.hallServer, dat.hallServerInfoVO);
            _super.prototype.startup.call(this);
            ui.open(300 /* TUITONG */);
        };
        return TuitongStartup;
    }(ssp.ModuleStartup));
    tuitong.TuitongStartup = TuitongStartup;
    __reflect(TuitongStartup.prototype, "tuitong.TuitongStartup");
})(tuitong || (tuitong = {}));
//# sourceMappingURL=TuitongStartup.js.map