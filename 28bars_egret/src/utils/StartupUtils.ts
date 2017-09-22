 module utils {
    /** 如果启动参数go包含内容，则尝试跳转，如果有同名模块，则返回true，没有返回false */
    export function autoGo():boolean {
        var cmdStr:string = getGoCommandStr();
        if (puremvc.Facade.getInstance().hasCommand(cmdStr)){
            puremvc.Facade.getInstance().sendNotification(cmdStr);
            return true;
        } else return false; 
    }

    export function goComplete(cmdStr:string):void {
        if (getGoCommandStr() == cmdStr) urlObj.go = null;
    }

    function getGoCommandStr():string {
        return "GO_"+String(utils.getURLObj("go")).toUpperCase();
    }

    export function autoLogin():boolean {
        var username:string = utils.getURLObj("un");
        var password:string = "no";//utils.getURLObj("ps");
        var ip:string = utils.getURLObj("ip");
        if(username!=null && username.length>1 && password!=null && password.length>1) {
            if (ip==null||ip.length<1) ip = cfg.getIp();
            login(username,password,ip);
            utils.getURLObj().un = null;
            utils.getURLObj().ps = null;
            utils.getURLObj().ip = null;
            return true;
        }
        return false;
    }

    export function login(name:string, password:string, ip?:string):void {
        cfg.loginServer = new net.HttpServer();
        cfg.loginServer.serverInfo = new protovos.ServerInfoVO({ip:ip,hport:5000,modelId:1});
        egret.log("loign: "+ip+":"+cfg.loginServer.serverInfo.hport);
        net.pvo().s("10000000",name,"0","0","0").to(cst.SvrAct.LOGIN,cfg.loginServer);

    }
 }