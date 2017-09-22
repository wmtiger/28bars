var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ssp;
(function (ssp) {
    var ModuleProxy = (function () {
        function ModuleProxy() {
        }
        ModuleProxy.prototype.setServer = function (sspServer, serverInfo) {
            this.sspServer = sspServer;
            if (serverInfo == null) {
                this.serverInfo = this.sspServer.serverInfo;
            }
            else {
                this.sspServer.serverInfo = serverInfo;
                this.serverInfo = serverInfo;
            }
        };
        return ModuleProxy;
    }());
    ssp.ModuleProxy = ModuleProxy;
    __reflect(ModuleProxy.prototype, "ssp.ModuleProxy");
})(ssp || (ssp = {}));
//# sourceMappingURL=ModuleProxy.js.map