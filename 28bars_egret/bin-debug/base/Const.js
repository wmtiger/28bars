var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var cst;
(function (cst) {
    var SvrAct = (function () {
        function SvrAct() {
        }
        SvrAct.LOGIN = 2000000; //账号登录
        SvrAct.HALL_LOGIN = 1; //登录到大厅
        SvrAct.HALL_HEART = 2000001; //领取活跃奖励
        SvrAct.HALL_ACTIVE = 2000002; //领取活跃奖励
        SvrAct.SLOT_LOGIN = 1; //登录到老虎机游戏
        SvrAct.SLOT_PLAYGAME = 9000000; //Slots
        SvrAct.SLOT_FREEGAME = 9000001; //Slots
        SvrAct.SLOT_BOUNS = 9000002; //Slots
        SvrAct.SLOT_JACKPOT = 9000003; //Slots
        return SvrAct;
    }());
    cst.SvrAct = SvrAct;
    __reflect(SvrAct.prototype, "cst.SvrAct");
})(cst || (cst = {}));
//# sourceMappingURL=Const.js.map