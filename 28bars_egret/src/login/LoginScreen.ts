module ui {
    export class LoginScreen extends SspScreen {

        static NAME:string = "LoginScreen";

        constructor() {
            super(LoginScreen.NAME);
            this.fairyPkgName = "main";
            this.fairyResName = "UI_login";
            this.resGroup = ["main","template","protobuff","effect"];
        }

        _inputTextInput:fairygui.GTextInput;
        
        onInit():void {
        
            this.view.getController("c_login").selectedIndex = 1;

            this.view.getChild("n7").addClickListener(this.onClickBack,this);
            this.view.getChild("n8").addClickListener(this.onClickBack,this);
            this.view.getChild("n20").asCom.getChild("n21").addClickListener(this.onClickBack,this);
            this.view.getChild("n20").asCom.getChild("combox_address").visible = false;
            this._inputTextInput = this.view.getChild("n20").asCom.getChild("n29").asTextInput;
            this._inputTextInput.text = egret.localStorage.getItem("loginInput");
        }

        private onClickBack(evt: Event): void {
            var name = (<fairygui.GObject><any>(evt.currentTarget)).name;
            // console.log(name);

            if(name=="n7"||name=="n8") {
                this.view.getController("c_login").selectedIndex = 2;
            }
            if(name=="n21") {
                var tfArr = this._inputTextInput.text.split(" ");
                var ip = cfg.getIp(tfArr.length>1 ? tfArr[1] : "100");
                var name = tfArr[0];
                
                if(name==null || name.length<2) {
                    fairygui.GRoot.inst.showTooltips("账号太短了吧？");
                } else {
                    utils.login(name,"",ip);
                    egret.localStorage.setItem("loginInput",this._inputTextInput.text);
                }
            }
        
        }
   

    }
}