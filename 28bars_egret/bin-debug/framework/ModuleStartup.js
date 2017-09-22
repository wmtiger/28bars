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
var ssp;
(function (ssp) {
    var ModuleStartup = (function (_super) {
        __extends(ModuleStartup, _super);
        function ModuleStartup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ModuleStartup.prototype.execute = function (notification) {
            this.commandName = notification.getName();
            this.openData = notification.getBody();
            this.openType = notification.getType();
            switch (this.openType) {
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
        };
        ModuleStartup.prototype.registerNet = function () {
        };
        ModuleStartup.prototype.registerUi = function () {
        };
        ModuleStartup.prototype.startup = function () {
            if (this.moduleProxy == null) {
                egret.log("moduleProxy未初始化");
                return;
            }
            if (this.moduleProxy.sspServer == null
                || this.moduleProxy.serverInfo == null
                || this.moduleProxy.serverInfo.ip == null
                || this.moduleProxy.serverInfo.ip == "") {
                this.onServerError();
            }
            else {
                if (this.moduleProxy.sspServer.token == null
                    || this.moduleProxy.sspServer.token.length < 1
                    || this.moduleProxy.sspServer.userId == null
                    || this.moduleProxy.sspServer.userId.length < 1) {
                    this.onTokenError();
                }
                else if (this.moduleProxy.sspServer.isConnected) {
                    if (this.moduleProxy.isLogined) {
                        utils.goComplete(this.commandName);
                        this.onLoginSuccess();
                    }
                    else {
                        this.onServerConnected();
                    }
                }
                else {
                    this.moduleProxy.sspServer.connect(this.onServerConnected, this);
                }
            }
        };
        ModuleStartup.prototype.loginModuleServer = function (loginActionId) {
            if (loginActionId === void 0) { loginActionId = 1; }
            net.pvo().to(loginActionId, this.moduleProxy.sspServer);
        };
        ModuleStartup.prototype.onLoginSuccess = function () {
        };
        ModuleStartup.prototype.onTokenError = function () {
        };
        ModuleStartup.prototype.onServerConnected = function () {
        };
        ModuleStartup.prototype.onServerError = function () {
        };
        ModuleStartup.LOGIN_SUCCESS = "LOGIN_SUCCESS";
        ModuleStartup.TOKEN_ERROR = "TOKEN_ERROR";
        ModuleStartup.SERVER_CONNECTED = "SERVER_CONNECTED";
        ModuleStartup.SERVER_ERROR = "SERVER_ERROR";
        return ModuleStartup;
    }(puremvc.SimpleCommand));
    ssp.ModuleStartup = ModuleStartup;
    __reflect(ModuleStartup.prototype, "ssp.ModuleStartup");
})(ssp || (ssp = {}));
//# sourceMappingURL=ModuleStartup.js.map