var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var protovos;
(function (protovos) {
    var MessageVO = (function () {
        function MessageVO(data) {
            if (data != null) {
                this.constructData = data;
                this.action = data.action;
                this.phase = data.phase;
                this.data = new protovos.ParamVO(data.data);
                this.sendAt = data.sendAt == null ? 0 : data.sendAt.toNumber();
                this.futureId = data.futureId == null ? 0 : data.futureId.toNumber();
                this.clientNumId = data.clientNumId;
                this.name = data.name;
                this.errorCode = data.errorCode;
                this.isEncrypt = data.isEncrypt;
                this.token = data.token;
                this.seqNum = data.seqNum;
            }
        }
        MessageVO.create = function (data) {
            return new MessageVO(ssp.getProtobufVO("MessageVO", data));
        };
        return MessageVO;
    }());
    protovos.MessageVO = MessageVO;
    __reflect(MessageVO.prototype, "protovos.MessageVO");
})(protovos || (protovos = {}));
//# sourceMappingURL=MessageVO.js.map