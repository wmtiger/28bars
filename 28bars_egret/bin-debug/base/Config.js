var cfg;
(function (cfg) {
    var loginIplist = ["47.94.47.100", "192.168.138.131"];
    function getIp(searchStr) {
        var ipStr = loginIplist[0];
        if (searchStr == null)
            return ipStr;
        for (var i = 0; i < loginIplist.length; ++i) {
            if (loginIplist[i].lastIndexOf(searchStr) != -1)
                ipStr = loginIplist[i];
        }
        return ipStr;
    }
    cfg.getIp = getIp;
    function registerGoCommands() {
        // mvc.regCmd(mvc.cst.GO_LOGIN, ssp.LoginStartup);
        // mvc.regCmd(mvc.cst.GO_HALL,             ssp.HallStartup);
        // mvc.regCmd(mvc.cst.GO_SLOT,             ssp.SlotStartup);
        // mvc.regCmd(mvc.cst.GO_TUITONG, tuitong.TuitongStartup);
        // mvc.regCmd(mvc.cst.GO_LUCKY_PK_SIZE, lps.LuckyPkSizeStartup);
        // mvc.regCmd(mvc.cst.GO_FIGHT_GRID, fg.FightGridStartup);
        mvc.regCmd(mvc.cst.GO_28_BAR, twoeightbar.TwoEightBarStartup);
    }
    cfg.registerGoCommands = registerGoCommands;
    function registerNetActions() {
        cfg.loginServer = new net.HttpServer();
        cfg.hallServer = new net.WebSocketServer();
        cfg.slotServer = new net.WebSocketServer();
        net.register(cst.SvrAct.LOGIN, 1 /* LOGIN */, net.LoginRequest);
    }
    cfg.registerNetActions = registerNetActions;
    function registerScreens(root) {
        fairygui.UIConfig.modalLayerColor = 0;
        fairygui.UIConfig.modalLayerAlpha = 0.5;
        root.stage.addChild(fairygui.GRoot.inst.displayObject);
        ui.fairyLayer = new fairygui.GComponent();
        ui.loadingLayer = new fairygui.GComponent();
        fairygui.GRoot.inst.addChild(ui.fairyLayer);
        fairygui.GRoot.inst.addChild(ui.loadingLayer);
        cfg.loadingPack = fairygui.UIPackage.addPackage("loading");
        ui.register(0 /* LOADING */, fg.FightGridLoadingScreen);
        // ui.register(cst.ui.LOADING, ui.LoadingScreen);
        // ui.register(cst.ui.LOGIN, ui.LoginScreen);
    }
    cfg.registerScreens = registerScreens;
    function loadLocalStorage() {
        dat.token = egret.localStorage.getItem("token");
        try {
            dat.userVO = protovos.UserVO.create(utils.strBuff(egret.localStorage.getItem("userVO")));
        }
        catch (error) {
        }
        try {
            dat.hallServerInfoVO = protovos.ServerInfoVO.create(utils.strBuff(egret.localStorage.getItem("hallSvr")));
        }
        catch (error) {
        }
        try {
            dat.slotServerInfoVO = protovos.ServerInfoVO.create(utils.strBuff(egret.localStorage.getItem("slotSvr")));
        }
        catch (error) {
        }
    }
    cfg.loadLocalStorage = loadLocalStorage;
    function dispose() {
        cfg.loginServer.close();
        cfg.loginServer = null;
        cfg.hallServer.close();
        cfg.hallServer = null;
        cfg.slotServer.close();
        cfg.slotServer = null;
    }
    cfg.dispose = dispose;
})(cfg || (cfg = {}));
//# sourceMappingURL=Config.js.map