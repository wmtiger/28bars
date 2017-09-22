var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var mvc;
(function (mvc) {
    var cst = (function () {
        function cst() {
        }
        cst.UI_UPDATE_ALL_POINTS = "UI_UPDATE_ALL_POINTS";
        cst.GO_LOGIN = "GO_LOGIN";
        cst.GO_HALL = "GO_HALL";
        cst.GO_SLOT = "GO_SLOT";
        cst.GO_FLIP = "GO_FLIP";
        cst.GO_TUITONG = "GO_TUITONG";
        cst.GO_LUCKY_PK_SIZE = "GO_LUCKY_PK_SIZE";
        cst.GO_FIGHT_GRID = "GO_FIGHT_GRID";
        return cst;
    }());
    mvc.cst = cst;
    __reflect(cst.prototype, "mvc.cst");
    function send(name, body, type) {
        puremvc.Facade.getInstance().sendNotification(name, body, type);
    }
    mvc.send = send;
    function has(name) {
        return puremvc.Facade.getInstance().hasCommand(name)
            || puremvc.Facade.getInstance().hasMediator(name)
            || puremvc.Facade.getInstance().hasProxy(name);
    }
    mvc.has = has;
    function regCmd(notificationName, commandClassRef) {
        puremvc.Facade.getInstance().registerCommand(notificationName, commandClassRef);
    }
    mvc.regCmd = regCmd;
})(mvc || (mvc = {}));
//# sourceMappingURL=Mvc.js.map