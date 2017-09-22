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
var lps;
(function (lps) {
    var LuckyPkSizeStartup = (function (_super) {
        __extends(LuckyPkSizeStartup, _super);
        function LuckyPkSizeStartup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LuckyPkSizeStartup.prototype.registerNet = function () {
        };
        LuckyPkSizeStartup.prototype.registerUi = function () {
            ui.register(320 /* LUCKY_PK_SIZE */, lps.LuckyPkSizeScreen);
        };
        LuckyPkSizeStartup.prototype.startup = function () {
            this.moduleProxy = lps.LuckyPkSizeProxy.inst;
            this.moduleProxy.setServer(cfg.hallServer, dat.hallServerInfoVO);
            _super.prototype.startup.call(this);
            ui.open(320 /* LUCKY_PK_SIZE */);
        };
        return LuckyPkSizeStartup;
    }(ssp.ModuleStartup));
    lps.LuckyPkSizeStartup = LuckyPkSizeStartup;
    __reflect(LuckyPkSizeStartup.prototype, "lps.LuckyPkSizeStartup");
})(lps || (lps = {}));
//# sourceMappingURL=LuckyPkSizeStartup.js.map