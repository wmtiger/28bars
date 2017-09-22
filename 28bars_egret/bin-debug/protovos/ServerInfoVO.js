var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var protovos;
(function (protovos) {
    var ServerInfoVO = (function () {
        function ServerInfoVO(data) {
            if (data != null) {
                this.constructData = data;
                this.processId = data.processId;
                this.ip = data.ip;
                this.onlineNum = data.onlineNum;
                this.tport = data.tport;
                this.wport = data.wport;
                this.hport = data.hport;
                this.gameId = data.gameId;
                this.modelId = data.modelId;
                this.gameName = data.gameName;
            }
        }
        ServerInfoVO.create = function (data) {
            return new ServerInfoVO(ssp.getProtobufVO("ServerInfoVO", data));
        };
        return ServerInfoVO;
    }());
    protovos.ServerInfoVO = ServerInfoVO;
    __reflect(ServerInfoVO.prototype, "protovos.ServerInfoVO");
})(protovos || (protovos = {}));
//# sourceMappingURL=ServerInfoVO.js.map