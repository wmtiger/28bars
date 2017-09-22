module cfg {

    const loginIplist = ["47.94.47.100", "192.168.138.131"];
    export function getIp(searchStr?: string): string {
        var ipStr = loginIplist[0];
        if (searchStr == null) return ipStr;
        for (var i = 0; i < loginIplist.length; ++i) {
            if (loginIplist[i].lastIndexOf(searchStr) != -1) ipStr = loginIplist[i];
        }
        return ipStr;
    }


    export function registerGoCommands(): void {
        // mvc.regCmd(mvc.cst.GO_LOGIN, ssp.LoginStartup);
        // mvc.regCmd(mvc.cst.GO_HALL,             ssp.HallStartup);
        // mvc.regCmd(mvc.cst.GO_SLOT,             ssp.SlotStartup);
        mvc.regCmd(mvc.cst.GO_TUITONG, tuitong.TuitongStartup);
        // mvc.regCmd(mvc.cst.GO_LUCKY_PK_SIZE, lps.LuckyPkSizeStartup);
        // mvc.regCmd(mvc.cst.GO_FIGHT_GRID, fg.FightGridStartup);
    }


    export function registerNetActions(): void {

        cfg.loginServer = new net.HttpServer();
        cfg.hallServer = new net.WebSocketServer();
        cfg.slotServer = new net.WebSocketServer();

        net.register(cst.SvrAct.LOGIN, cst.svrID.LOGIN, net.LoginRequest);
    }

    export var loadingPack: fairygui.UIPackage;
    export var commonPack: fairygui.UIPackage;

    export function registerScreens(root: egret.DisplayObjectContainer): void {

        fairygui.UIConfig.modalLayerColor = 0;
        fairygui.UIConfig.modalLayerAlpha = 0.5;
        root.stage.addChild(fairygui.GRoot.inst.displayObject);

        ui.fairyLayer = new fairygui.GComponent();
        ui.loadingLayer = new fairygui.GComponent();
        fairygui.GRoot.inst.addChild(ui.fairyLayer);
        fairygui.GRoot.inst.addChild(ui.loadingLayer);


        loadingPack = fairygui.UIPackage.addPackage("loading");



        ui.register(cst.ui.LOADING, fg.FightGridLoadingScreen);
        // ui.register(cst.ui.LOADING, ui.LoadingScreen);
        // ui.register(cst.ui.LOGIN, ui.LoginScreen);


    }


    export function loadLocalStorage(): void {

        dat.token = egret.localStorage.getItem("token");

        try {
            dat.userVO = protovos.UserVO.create(utils.strBuff(egret.localStorage.getItem("userVO")));
        } catch (error) {

        }

        try {
            dat.hallServerInfoVO = protovos.ServerInfoVO.create(utils.strBuff(egret.localStorage.getItem("hallSvr")));
        } catch (error) {

        }

        try {
            dat.slotServerInfoVO = protovos.ServerInfoVO.create(utils.strBuff(egret.localStorage.getItem("slotSvr")));
        } catch (error) {

        }
    }









    export var loginServer: net.HttpServer; //登录服务器
    export var hallServer: net.WebSocketServer; //大厅服务器
    export var slotServer: net.WebSocketServer; //老虎机服务器

    export function dispose(): void {
        loginServer.close();
        loginServer = null;
        hallServer.close();
        hallServer = null;
        slotServer.close();
        slotServer = null;
    }

}