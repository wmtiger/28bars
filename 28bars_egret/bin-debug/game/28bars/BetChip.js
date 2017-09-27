var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var twoeightbar;
(function (twoeightbar) {
    var BetChip = (function () {
        function BetChip() {
            this.from = -1;
            this.targetId = -1;
            this.view = fairygui.UIPackage.createObject("twoeightbar_pkg", "BetChip").asCom;
            this.view.touchable = false;
        }
        return BetChip;
    }());
    twoeightbar.BetChip = BetChip;
    __reflect(BetChip.prototype, "twoeightbar.BetChip");
})(twoeightbar || (twoeightbar = {}));
//# sourceMappingURL=BetChip.js.map