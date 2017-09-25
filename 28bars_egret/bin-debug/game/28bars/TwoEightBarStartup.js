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
var twoeightbar;
(function (twoeightbar) {
    var TwoEightBarStartup = (function (_super) {
        __extends(TwoEightBarStartup, _super);
        function TwoEightBarStartup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TwoEightBarStartup.prototype.registerNet = function () {
        };
        TwoEightBarStartup.prototype.registerUi = function () {
            ui.register(310 /* TWO_EIGHT_BAR */, twoeightbar.TwoEightBarScreen);
        };
        TwoEightBarStartup.prototype.startup = function () {
            this.moduleProxy = twoeightbar.TwoEightBarProxy.inst;
            this.moduleProxy.setServer(cfg.hallServer, dat.hallServerInfoVO);
            _super.prototype.startup.call(this);
            ui.open(310 /* TWO_EIGHT_BAR */);
        };
        return TwoEightBarStartup;
    }(ssp.ModuleStartup));
    twoeightbar.TwoEightBarStartup = TwoEightBarStartup;
    __reflect(TwoEightBarStartup.prototype, "twoeightbar.TwoEightBarStartup");
})(twoeightbar || (twoeightbar = {}));
//# sourceMappingURL=TwoEightBarStartup.js.map