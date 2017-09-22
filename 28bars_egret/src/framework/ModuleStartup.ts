module ssp {

    export class ModuleStartup extends puremvc.SimpleCommand {

        static LOGIN_SUCCESS:string = "LOGIN_SUCCESS";
        static TOKEN_ERROR:string = "TOKEN_ERROR";
        static SERVER_CONNECTED:string = "SERVER_CONNECTED";
        static SERVER_ERROR:string = "SERVER_ERROR";
        
        commandName:string;
        openData:any;
        openType:any;
        moduleProxy:ModuleProxy;


        execute(notification: puremvc.INotification): void {
            this.commandName = notification.getName();
            this.openData = notification.getBody();
            this.openType = notification.getType();
            switch(this.openType) {
                case ModuleStartup.LOGIN_SUCCESS:
                    utils.goComplete(this.commandName);
                    this.onLoginSuccess();
                    return;
                case ModuleStartup.TOKEN_ERROR:
                    this.onTokenError();
                    return;
                case ModuleStartup.SERVER_CONNECTED:
                    this.onServerConnected();
                    return;
                case ModuleStartup.SERVER_ERROR:
                    this.onServerError();
                    return;
                default:
                    this.registerNet();
                    this.registerUi();
                    this.startup();
                    return;
            }
        }

        registerNet():void {

        }

        registerUi():void {

        }

        startup():void {
            if (this.moduleProxy == null) {
                egret.log("moduleProxy未初始化");
                return;
            }
            if (this.moduleProxy.sspServer == null
            || this.moduleProxy.serverInfo == null
            || this.moduleProxy.serverInfo.ip == null
            || this.moduleProxy.serverInfo.ip == "") {
                this.onServerError();
            } else {
                if (this.moduleProxy.sspServer.token == null
                || this.moduleProxy.sspServer.token.length < 1
                || this.moduleProxy.sspServer.userId == null
                || this.moduleProxy.sspServer.userId.length < 1) {
                    this.onTokenError();

                } else if (this.moduleProxy.sspServer.isConnected) {
                    if (this.moduleProxy.isLogined) {
                        utils.goComplete(this.commandName);
                        this.onLoginSuccess();
                    } else {
                        this.onServerConnected();
                    }
                    
                } else {
                    this.moduleProxy.sspServer.connect(this.onServerConnected,this);
                }

            }
        }

        loginModuleServer(loginActionId:number=1):void {
            net.pvo().to(loginActionId,this.moduleProxy.sspServer);
        }

        onLoginSuccess():void {

        }

        onTokenError():void {

        }

        onServerConnected():void {

        }

        onServerError():void {
            
        }


    }

}