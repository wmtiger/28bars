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
    var LoginStartup = (function (_super) {
        __extends(LoginStartup, _super);
        function LoginStartup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LoginStartup.prototype.execute = function (notification) {
            if (utils.autoLogin()) {
                console.log("auto login");
            }
            else
                ui.open(10 /* LOGIN */);
        };
        return LoginStartup;
    }(puremvc.SimpleCommand));
    ssp.LoginStartup = LoginStartup;
    __reflect(LoginStartup.prototype, "ssp.LoginStartup");
})(ssp || (ssp = {}));
//# sourceMappingURL=LoginStartup.js.map