var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var protovos;
(function (protovos) {
    var ParamVO = (function () {
        function ParamVO(data) {
            if (data === void 0) { data = null; }
            this.strValues = [];
            this.intValues = [];
            this.longValues = [];
            this.data = [];
            if (data != null) {
                this.constructData = data;
                var i = 0;
                var len = 0;
                this.strValues = [];
                len = data.strValues.length;
                for (i = 0; i < len; i++) {
                    this.strValues[i] = data.strValues[i];
                }
                this.intValues = [];
                len = data.intValues.length;
                for (i = 0; i < len; i++) {
                    this.intValues[i] = data.intValues[i];
                }
                this.longValues = [];
                len = data.longValues.length;
                for (i = 0; i < len; i++) {
                    this.longValues[i] = data.longValues[i] == null ? 0 : data.longValues[i].toNumber();
                }
                this.data = [];
                len = data.data.length;
                for (i = 0; i < len; i++) {
                    this.data[i] = data.data[i];
                }
            }
        }
        ParamVO.create = function (data) {
            return new ParamVO(ssp.getProtobufVO("ParamVO").decode(data));
        };
        return ParamVO;
    }());
    protovos.ParamVO = ParamVO;
    __reflect(ParamVO.prototype, "protovos.ParamVO");
})(protovos || (protovos = {}));
//# sourceMappingURL=ParamVO.js.map