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
    var avatar;
    (function (avatar) {
        var Warrior = (function (_super) {
            __extends(Warrior, _super);
            function Warrior() {
                var _this = _super.call(this) || this;
                _this._atkCd = 0;
                _this.initProxy();
                // this.showHitArea();
                _this.initHpBar();
                return _this;
            }
            Warrior.prototype.setViewHitRect = function () {
                this.setHitRect(new egret.Rectangle(0, 0, 24, 20));
            };
            // ----mediator start
            Warrior.prototype.initMvc = function () {
                this._mediator = new puremvc.Mediator(this.getInitMediatorName(), this);
                puremvc.Facade.getInstance().registerMediator(this);
                puremvc.Facade.getInstance().registerCommand(avatar.ActionCmd.ATK, avatar.ActionCmd);
                puremvc.Facade.getInstance().registerCommand(avatar.ActionCmd.RUN, avatar.ActionCmd);
                puremvc.Facade.getInstance().registerCommand(avatar.ActionCmd.DEAD, avatar.ActionCmd);
            };
            Warrior.prototype.clearMvc = function () {
                puremvc.Facade.getInstance().removeMediator(this.getInitMediatorName());
                puremvc.Facade.getInstance().removeCommand(avatar.ActionCmd.ATK);
                puremvc.Facade.getInstance().removeCommand(avatar.ActionCmd.RUN);
                puremvc.Facade.getInstance().removeCommand(avatar.ActionCmd.DEAD);
            };
            Warrior.prototype.getInitMediatorName = function () {
                return '';
            };
            Warrior.prototype.getMediatorName = function () {
                return this._mediator.getMediatorName();
            };
            Warrior.prototype.getViewComponent = function () {
                return this._mediator.getViewComponent();
            };
            Warrior.prototype.setViewComponent = function (viewComponent) {
                this._mediator.setViewComponent(viewComponent);
            };
            Warrior.prototype.listNotificationInterests = function () {
                // return this._mediator.listNotificationInterests();
                return [Warrior.WARRIOR_DEAD, Warrior.WARRIOR_HURT, Warrior.WARRIOR_RUN, Warrior.WARRIOR_ATK];
            };
            Warrior.prototype.handleNotification = function (notification) {
                // this._mediator.handleNotification(notification);
                var name = notification.getName();
                var body = notification.getBody();
                switch (name) {
                    case Warrior.WARRIOR_DEAD:
                        if (body === this.getProxy().getId()) {
                            this.dead();
                        }
                        break;
                    case Warrior.WARRIOR_HURT:
                        if (body.target === this) {
                            this._hpBar.setHp(this.getProxy().getHp());
                        }
                        break;
                    case Warrior.WARRIOR_ATK:
                        if (body.target === this) {
                            this.atk();
                        }
                        break;
                    default:
                        break;
                }
            };
            Warrior.prototype.onRegister = function () {
                this._mediator.onRegister();
            };
            Warrior.prototype.onRemove = function () {
                this._mediator.onRemove();
            };
            Warrior.prototype.sendNotification = function (name, body, type) {
                this._mediator.sendNotification(name, body, type);
            };
            // ---- mediator end
            Warrior.prototype.initHpBar = function () {
                this._hpBar = new avatar.HpBar(this._dbproxy.getHp(), 20);
                this.addChild(this._hpBar);
                this._hpBar.setXY(-this._hpBar.getMaxWid() / 2, -26);
            };
            Warrior.prototype.initProxy = function () {
                this._dbproxy = new avatar.WarriorDataProxy();
                this._dbproxy.init();
            };
            Warrior.prototype.getProxy = function () {
                return this._dbproxy;
            };
            Object.defineProperty(Warrior.prototype, "proxy", {
                get: function () {
                    return this._dbproxy;
                },
                enumerable: true,
                configurable: true
            });
            Warrior.prototype.getAtkCd = function () {
                return this._atkCd;
            };
            Warrior.prototype.update = function () {
                if (this.getProxy().getHp() <= 0)
                    return;
                if (!this.target) {
                    this.target = this.searchEnemies();
                    if (this.target) {
                        this.run([{ x: this.target.x, y: this.target.y }]);
                    }
                    else {
                        this._stopRun();
                    }
                }
                else {
                    if (this.target.getProxy().getHp() <= 0) {
                        this.target = null;
                        // this.update();
                    }
                    else {
                    }
                }
                if (this._atkCd > 0) {
                    this._atkCd -= 60;
                }
                else {
                    this._atkCd = 0;
                }
            };
            // protected _updateInterval:number = -1;
            Warrior.prototype.onAddToStageComplete = function () {
                this.initMvc();
                // this._updateInterval = setInterval(()=>{
                // }, 60)
            };
            Warrior.prototype.onremoveFromStageComplete = function () {
                // clearInterval(this._updateInterval)
                this.clearMvc();
            };
            /** 给定路径的移动 */
            Warrior.prototype.run = function (path, endCallback, callbackObj) {
                this._runEndCallback = endCallback;
                this._runCallbackObj = callbackObj;
                this._runPath = path;
                this._state = avatar.STATE.RUN;
                egret.Tween.removeTweens(this);
                this._startRun();
            };
            Warrior.prototype._stopRun = function () {
                egret.Tween.removeTweens(this);
                if (this._dir == avatar.DIR.LEFT) {
                    this.standLeft();
                    if (this._runEndCallback) {
                        console.log('end1');
                        this._runEndCallback.call(this, null);
                    }
                }
                else {
                    this.standRight();
                    if (this._runEndCallback) {
                        console.log('end2');
                        this._runEndCallback.call(this, null);
                    }
                }
                this.target = null;
            };
            Warrior.prototype._startRun = function () {
                var _this = this;
                var path = this._runPath;
                if (path.length <= 0) {
                    this._stopRun();
                    return;
                }
                if (this._state != avatar.STATE.RUN)
                    return;
                var p = path.shift();
                var dx = p.x - this.x;
                var dy = p.y - this.y;
                if (Math.abs(dx) >= Math.abs(dy)) {
                    if (dx >= 0) {
                        this.runRight();
                    }
                    else {
                        this.runLeft();
                    }
                }
                else {
                    if (dy >= 0) {
                        this.runDown();
                    }
                    else {
                        this.runUp();
                    }
                }
                var dt = this._getNeedTime(dx, dy);
                egret.Tween.get(this).to({ x: p.x, y: p.y }, dt)
                    .call(function () {
                    console.log('state', _this._state);
                    if (_this._state == avatar.STATE.RUN) {
                        _this._startRun();
                    }
                });
            };
            Warrior.prototype._getNeedTime = function (dx, dy) {
                return Math.sqrt(dx * dx + dy * dy) / this._dbproxy.getSpeed() * 10;
            };
            // action(target: Warrior) {
            // 	if (this.getProxy().getHp() <= 0) return;
            // 	if (target.getProxy().getCamp() != this.getProxy().getCamp()) {
            // 		if (this._atkCd <= 0) {
            // 			if (target.getProxy().getHp() > 0)
            // 				this.atk(target)
            // 		}
            // 	} else {
            // 		this._stopRun();
            // 	}
            // }
            Warrior.prototype.atk = function (callback) {
                if (callback === void 0) { callback = null; }
                egret.Tween.removeTweens(this);
                if (this._dir == avatar.DIR.LEFT) {
                    this.atkLeft(callback);
                }
                else {
                    this.atkRight(callback);
                }
                this._atkCd = this.getProxy().getAtkCd();
            };
            /**
             * 自动寻找敌人,搜索离自己最近的敌人,先找100范围内,再找200,一直到整个屏幕
             * 但是还没实现上述，先实现全部搜索吧
             */
            Warrior.prototype.searchEnemies = function () {
                var _this = this;
                var list = [];
                list = fg.avatar.layerAvatars[this.parent.id];
                list = list.filter(function (w) { return _this.getProxy().getCamp() != w.getProxy().getCamp() && w.getProxy().getHp() > 0; });
                list.sort(function (a, b) { return utils.getDistance(a, _this) - utils.getDistance(b, _this); });
                var enemy = list.length > 0 ? list[0] : null;
                return enemy;
            };
            Warrior.WARRIOR_DEAD = "WARRIOR_DEAD";
            Warrior.WARRIOR_HURT = "WARRIOR_HURT";
            Warrior.WARRIOR_RUN = "WARRIOR_RUN";
            Warrior.WARRIOR_ATK = "WARRIOR_ATK";
            return Warrior;
        }(avatar.Avatar));
        avatar.Warrior = Warrior;
        __reflect(Warrior.prototype, "fg.avatar.Warrior", ["puremvc.IMediator", "puremvc.INotifier"]);
    })(avatar = fg.avatar || (fg.avatar = {}));
})(fg || (fg = {}));
//# sourceMappingURL=Warrior.js.map