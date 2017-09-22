var dat;
(function (dat) {
    function dispose() {
        egret.localStorage.clear();
        dat.token = null;
        dat.userVO = null;
    }
    dat.dispose = dispose;
})(dat || (dat = {}));
//# sourceMappingURL=Data.js.map