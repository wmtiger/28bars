var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var protovos;
(function (protovos) {
    var UserVO = (function () {
        function UserVO(data) {
            if (data != null) {
                this.constructData = data;
                this.userId = data.userId;
                this.userName = data.userName;
                this.points = data.points == null ? 0 : data.points.toNumber();
                this.vip = data.vip == null ? 0 : data.vip.toNumber();
                this.vipPoint = data.vipPoint == null ? 0 : data.vipPoint.toNumber();
                this.level = data.level == null ? 0 : data.level.toNumber();
                this.levelPoint = data.levelPoint == null ? 0 : data.levelPoint.toNumber();
                this.startTime = data.startTime == null ? 0 : data.startTime.toNumber();
                this.maxWinPoint = data.maxWinPoint == null ? 0 : data.maxWinPoint.toNumber();
                this.winTimes = data.winTimes == null ? 0 : data.winTimes.toNumber();
                this.userDayActiveTime = data.userDayActiveTime == null ? 0 : data.userDayActiveTime.toNumber();
            }
        }
        UserVO.create = function (data) {
            return new UserVO(ssp.getProtobufVO("UserVO", data));
        };
        return UserVO;
    }());
    protovos.UserVO = UserVO;
    __reflect(UserVO.prototype, "protovos.UserVO");
})(protovos || (protovos = {}));
//# sourceMappingURL=UserVO.js.map