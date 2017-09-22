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
var net;
(function (net) {
    var LoginRequest = (function (_super) {
        __extends(LoginRequest, _super);
        function LoginRequest() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LoginRequest.prototype.onReceiveData = function (paramVO) {
            dat.token = this.messageVO.token;
            dat.userVO = new protovos.UserVO(ssp.getProtobufVO("UserVO", paramVO.data[0]));
            dat.hallServerInfoVO = protovos.ServerInfoVO.create(paramVO.data[1]);
            console.log("login success.");
            console.log("userId:" + dat.userVO.userId);
            console.log("token:" + dat.token);
            var userVOStr = utils.buffStr(dat.userVO.constructData.toArrayBuffer());
            var serverInfoVOStr = utils.buffStr(dat.hallServerInfoVO.constructData.toArrayBuffer());
            egret.localStorage.setItem("userVO", userVOStr);
            egret.localStorage.setItem("hallSvr", serverInfoVOStr);
            egret.localStorage.setItem("token", dat.token);
            if (!utils.autoGo())
                mvc.send(mvc.cst.GO_HALL);
        };
        return LoginRequest;
    }(net.ParamVOReader));
    net.LoginRequest = LoginRequest;
    __reflect(LoginRequest.prototype, "net.LoginRequest");
})(net || (net = {}));
//# sourceMappingURL=LoginRequest.js.map