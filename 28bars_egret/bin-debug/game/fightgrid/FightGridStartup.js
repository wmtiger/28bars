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
var fg;
(function (fg) {
    var FightGridStartup = (function (_super) {
        __extends(FightGridStartup, _super);
        function FightGridStartup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FightGridStartup.prototype.registerNet = function () {
        };
        FightGridStartup.prototype.registerUi = function () {
            ui.register(340 /* FIGHT_GRID */, fg.FightGridScreen);
        };
        FightGridStartup.prototype.startup = function () {
            this.moduleProxy = fg.FightGridProxy.inst;
            this.moduleProxy.setServer(cfg.hallServer, dat.hallServerInfoVO);
            _super.prototype.startup.call(this);
            ui.open(340 /* FIGHT_GRID */);
        };
        return FightGridStartup;
    }(ssp.ModuleStartup));
    fg.FightGridStartup = FightGridStartup;
    __reflect(FightGridStartup.prototype, "fg.FightGridStartup");
})(fg || (fg = {}));
//# sourceMappingURL=FightGridStartup.js.map