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
var ui;
(function (ui) {
    var LoginScreen = (function (_super) {
        __extends(LoginScreen, _super);
        function LoginScreen() {
            var _this = _super.call(this, LoginScreen.NAME) || this;
            _this.fairyPkgName = "main";
            _this.fairyResName = "UI_login";
            _this.resGroup = ["main", "template", "protobuff", "effect"];
            return _this;
        }
        LoginScreen.prototype.onInit = function () {
            this.view.getController("c_login").selectedIndex = 1;
            this.view.getChild("n7").addClickListener(this.onClickBack, this);
            this.view.getChild("n8").addClickListener(this.onClickBack, this);
            this.view.getChild("n20").asCom.getChild("n21").addClickListener(this.onClickBack, this);
            this.view.getChild("n20").asCom.getChild("combox_address").visible = false;
            this._inputTextInput = this.view.getChild("n20").asCom.getChild("n29").asTextInput;
            this._inputTextInput.text = egret.localStorage.getItem("loginInput");
        };
        LoginScreen.prototype.onClickBack = function (evt) {
            var name = (evt.currentTarget).name;
            // console.log(name);
            if (name == "n7" || name == "n8") {
                this.view.getController("c_login").selectedIndex = 2;
            }
            if (name == "n21") {
                var tfArr = this._inputTextInput.text.split(" ");
                var ip = cfg.getIp(tfArr.length > 1 ? tfArr[1] : "100");
                var name = tfArr[0];
                if (name == null || name.length < 2) {
                    fairygui.GRoot.inst.showTooltips("账号太短了吧？");
                }
                else {
                    utils.login(name, "", ip);
                    egret.localStorage.setItem("loginInput", this._inputTextInput.text);
                }
            }
        };
        LoginScreen.NAME = "LoginScreen";
        return LoginScreen;
    }(ui.SspScreen));
    ui.LoginScreen = LoginScreen;
    __reflect(LoginScreen.prototype, "ui.LoginScreen");
})(ui || (ui = {}));
//# sourceMappingURL=LoginScreen.js.map