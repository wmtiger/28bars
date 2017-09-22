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
var fg;
(function (fg) {
    function getLpsProxy() {
        return FightGridProxy.inst;
    }
    fg.getLpsProxy = getLpsProxy;
    var FightGridProxy = (function (_super) {
        __extends(FightGridProxy, _super);
        function FightGridProxy() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(FightGridProxy, "inst", {
            get: function () {
                if (FightGridProxy._inst == null) {
                    FightGridProxy._inst = new FightGridProxy();
                }
                return FightGridProxy._inst;
            },
            enumerable: true,
            configurable: true
        });
        return FightGridProxy;
    }(ssp.ModuleProxy));
    fg.FightGridProxy = FightGridProxy;
    __reflect(FightGridProxy.prototype, "fg.FightGridProxy");
    var FightGridScreen = (function (_super) {
        __extends(FightGridScreen, _super);
        function FightGridScreen() {
            var _this = _super.call(this, FightGridScreen.NAME) || this;
            _this._updateInterval = -1;
            _this._crtIdx = 0;
            _this.fairyPkgName = 'fightgrid';
            _this.fairyResName = 'FightBg';
            _this.resGroup = ['fightgrid', 'enemies'];
            return _this;
        }
        FightGridScreen.prototype._initCommonPack = function () {
            // 不需要加载common
        };
        FightGridScreen.prototype.startUpdate = function () {
            var _this = this;
            this._quadTree = new utils.QuadTree(0, new egret.Rectangle(0, 0, this.view.width, this.view.height));
            this._updateInterval = setInterval(function () {
                var list = [];
                list = fg.avatar.layerAvatars[_this._avatarLayer.id];
                if (list) {
                    var len = list.length;
                    _this._txt.text = '数量：' + len;
                    _this._quadTree.clear();
                    for (var i = 0; i < len; i++) {
                        var isInViewport = utils.isInViewport(list[i], _this._avatarLayerBounds);
                        if (isInViewport) {
                            var w = list[i];
                            if (w)
                                w.update();
                            _this._quadTree.insert(list[i]);
                        }
                    }
                    list.forEach(function (obj) {
                        var res = _this._quadTree.retrieve(obj);
                        res.forEach(function (tempObj) {
                            // tempObj.action();
                            if (obj !== tempObj) {
                                var wobj = obj;
                                var wtempObj = tempObj;
                                var isHit = fg.avatar.isInAtkArea(wobj, wtempObj);
                                // let isHit = utils.isHit(obj, tempObj);
                                if (isHit) {
                                    // 碰撞物体做出操作
                                    if (wobj.getProxy().getCamp() != wtempObj.getProxy().getCamp()) {
                                        // wobj.action(wtempObj);
                                        // wtempObj.action(wobj);
                                        mvc.send(fg.avatar.ActionCmd.ATK, { atker: wobj, defer: wtempObj });
                                        mvc.send(fg.avatar.ActionCmd.ATK, { atker: wtempObj, defer: wobj });
                                    }
                                    // 修改深度
                                    if (wobj.y > wtempObj.y) {
                                        if (_this._avatarLayer.getChildIndex(wobj) < _this._avatarLayer.getChildIndex(wtempObj)) {
                                            _this._avatarLayer.swapChildren(wobj, wtempObj);
                                        }
                                    }
                                    else {
                                        if (_this._avatarLayer.getChildIndex(wobj) > _this._avatarLayer.getChildIndex(wtempObj)) {
                                            _this._avatarLayer.swapChildren(wobj, wtempObj);
                                        }
                                    }
                                }
                            }
                        });
                    });
                }
            }, 60);
        };
        FightGridScreen.prototype.onInit = function () {
            this.startUpdate();
            this._avatarLayer = new fairygui.GComponent();
            this.view.addChildAt(this._avatarLayer, 1);
            var vx = this.view.x;
            var vy = this.view.y;
            var vw = this.view.width;
            var vh = this.view.height;
            this._avatarLayerBounds = new egret.Rectangle(vx, vy, vw, vh);
            this._txt = this.view.getChild('txt').asTextField;
            this._txt.text = '';
            this.view.addClickListener(this.onClickView, this);
            this.reset();
        };
        FightGridScreen.prototype.onClickView = function (e) {
            this.createAvatar2(e.stageX, e.stageY);
        };
        FightGridScreen.prototype.createAvatar2 = function (x, y) {
            var cls = [fg.avatar.Brigand, fg.avatar.DarkKnight];
            var avatarCls = cls[this._crtIdx++ % 2];
            for (var i = 0; i < 16; i++) {
                var b = new avatarCls();
                this._avatarLayer.addChild(b);
                b.setXY(x + (i % 4) * 40, y + Math.floor(i / 4) * 40);
            }
        };
        FightGridScreen.prototype.createAvatar = function (idx) {
            for (var i = 0; i < 16; i++) {
                var b = new fg.avatar.Brigand();
                this._avatarLayer.addChild(b);
                b.setXY((idx % 10) * 110 + 100, Math.floor(idx / 10) * 100 + 100);
            }
        };
        FightGridScreen.prototype.getp = function (x, y) {
            return new egret.Point(x, y);
        };
        FightGridScreen.prototype.reset = function () {
            this._avatarLayer.removeChildren();
        };
        FightGridScreen.prototype._chkHit = function () {
        };
        FightGridScreen.prototype.onClick = function (target) {
        };
        FightGridScreen.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            clearInterval(this._updateInterval);
        };
        FightGridScreen.NAME = 'FightGridScreen';
        return FightGridScreen;
    }(ui.SspScreen));
    fg.FightGridScreen = FightGridScreen;
    __reflect(FightGridScreen.prototype, "fg.FightGridScreen");
})(fg || (fg = {}));
//# sourceMappingURL=FightGridScreen.js.map