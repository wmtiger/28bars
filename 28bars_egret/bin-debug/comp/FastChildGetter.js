var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var comp;
(function (comp) {
    var FastChildGetter = (function () {
        function FastChildGetter(component, clickListner, thisObj) {
            this.component = component;
            this.childPathDic = {};
            this.clickListner = clickListner;
            this.clickThisObj = thisObj;
        }
        FastChildGetter.prototype.getChild = function (path) {
            var pathArr = path.split(".");
            var len = pathArr.length;
            var gObject = this.component;
            for (var i = 0; i < len; ++i) {
                gObject = gObject.asCom.getChild(pathArr[i]);
            }
            if (gObject != null) {
                this.childPathDic[gObject.hashCode] = path;
                gObject.addClickListener(this.onClick, this);
            }
            return gObject;
        };
        FastChildGetter.prototype.getPath = function (gobj) {
            return this.childPathDic[gobj.hashCode];
        };
        FastChildGetter.prototype.onClick = function (evt) {
            var target = evt.currentTarget;
            if (this.clickListner != null) {
                this.clickListner.call(this.clickThisObj, target);
            }
        };
        return FastChildGetter;
    }());
    comp.FastChildGetter = FastChildGetter;
    __reflect(FastChildGetter.prototype, "comp.FastChildGetter");
})(comp || (comp = {}));
//# sourceMappingURL=FastChildGetter.js.map