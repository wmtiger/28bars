var utils;
(function (utils) {
    /** 如果启动参数go包含内容，则尝试跳转，如果有同名模块，则返回true，没有返回false */
    function autoGo() {
        var cmdStr = getGoCommandStr();
        if (puremvc.Facade.getInstance().hasCommand(cmdStr)) {
            puremvc.Facade.getInstance().sendNotification(cmdStr);
            return true;
        }
        else
            return false;
    }
    utils.autoGo = autoGo;
    function goComplete(cmdStr) {
        if (getGoCommandStr() == cmdStr)
            utils.urlObj.go = null;
    }
    utils.goComplete = goComplete;
    function getGoCommandStr() {
        return "GO_" + String(utils.getURLObj("go")).toUpperCase();
    }
    function autoLogin() {
        var username = utils.getURLObj("un");
        var password = "no"; //utils.getURLObj("ps");
        var ip = utils.getURLObj("ip");
        if (username != null && username.length > 1 && password != null && password.length > 1) {
            if (ip == null || ip.length < 1)
                ip = cfg.getIp();
            login(username, password, ip);
            utils.getURLObj().un = null;
            utils.getURLObj().ps = null;
            utils.getURLObj().ip = null;
            return true;
        }
        return false;
    }
    utils.autoLogin = autoLogin;
    function login(name, password, ip) {
        cfg.loginServer = new net.HttpServer();
        cfg.loginServer.serverInfo = new protovos.ServerInfoVO({ ip: ip, hport: 5000, modelId: 1 });
        egret.log("loign: " + ip + ":" + cfg.loginServer.serverInfo.hport);
        net.pvo().s("10000000", name, "0", "0", "0").to(cst.SvrAct.LOGIN, cfg.loginServer);
    }
    utils.login = login;
})(utils || (utils = {}));
//# sourceMappingURL=StartupUtils.js.map