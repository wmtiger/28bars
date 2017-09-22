var utils;
(function (utils) {
    function getURL() {
        return window.location.href.split('?')[0];
    }
    utils.getURL = getURL;
    function getURLObj(param) {
        if (utils.urlObj == null) {
            utils.urlObj = {};
            if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                var query = location.search.substring(1); //获取查询串 
                var pairs = query.split("&"); //在&处断开 
                for (var i = 0; i < pairs.length; i++) {
                    var pos = pairs[i].indexOf('='); //查找name=value 
                    if (pos == -1) {
                        continue;
                    }
                    var argname = pairs[i].substring(0, pos); //提取name 
                    var value = pairs[i].substring(pos + 1); //提取value 
                    utils.urlObj[argname] = value; //存为属性 
                }
            }
        }
        return param != null ? utils.urlObj[param] : utils.urlObj;
    }
    utils.getURLObj = getURLObj;
})(utils || (utils = {}));
//# sourceMappingURL=WebUtils.js.map