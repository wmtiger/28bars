module net {
    export class LoginRequest extends ParamVOReader {

        
        onReceiveData(paramVO:protovos.ParamVO):void {
            dat.token = this.messageVO.token;
            dat.userVO = new protovos.UserVO(ssp.getProtobufVO("UserVO",paramVO.data[0]));
            dat.hallServerInfoVO = protovos.ServerInfoVO.create(paramVO.data[1]);

            console.log("login success.");
            console.log("userId:"+dat.userVO.userId);
            console.log("token:"+dat.token);

            var userVOStr = utils.buffStr(dat.userVO.constructData.toArrayBuffer());
            var serverInfoVOStr = utils.buffStr(dat.hallServerInfoVO.constructData.toArrayBuffer());
            egret.localStorage.setItem("userVO", userVOStr);
            egret.localStorage.setItem("hallSvr", serverInfoVOStr);
            egret.localStorage.setItem("token", dat.token);

            if (!utils.autoGo()) mvc.send(mvc.cst.GO_HALL);

        }
    }
}