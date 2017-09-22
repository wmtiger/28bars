module dat {

    export var token:string; //认证后缓存，用于messagevo连接登录服务器

    export var userVO:protovos.UserVO;

    export var hallServerInfoVO:protovos.ServerInfoVO;

    export var slotServerInfoVO:protovos.ServerInfoVO;

    export function dispose():void {
        egret.localStorage.clear();
        token = null;
        userVO = null;
    }

}