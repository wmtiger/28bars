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
        avatar.layerAvatars = {}; // {layer: avatars} 存放碰撞需要的物体
        var DIR;
        (function (DIR) {
            DIR[DIR["UP"] = 0] = "UP";
            DIR[DIR["RIGHT"] = 1] = "RIGHT";
            DIR[DIR["DOWN"] = 2] = "DOWN";
            DIR[DIR["LEFT"] = 3] = "LEFT";
        })(DIR = avatar.DIR || (avatar.DIR = {}));
        var STATE;
        (function (STATE) {
            STATE[STATE["STAND"] = 0] = "STAND";
            STATE[STATE["DEAD"] = 1] = "DEAD";
            STATE[STATE["RUN"] = 2] = "RUN";
            STATE[STATE["ATK"] = 3] = "ATK";
            STATE[STATE["THRON"] = 4] = "THRON";
            STATE[STATE["THRON_FREE"] = 5] = "THRON_FREE";
        })(STATE = avatar.STATE || (avatar.STATE = {}));
        var Avatar = (function (_super) {
            __extends(Avatar, _super);
            // hpBar
            function Avatar() {
                var _this = _super.call(this) || this;
                _this._dir = 1; // 方向 0:up 1:right 2:down 3:left
                _this._state = 0; // 状态 0:stand 1:dead 2:run 3:atk 
                _this.initPackSetting();
                _this.initPack();
                _this.view = fairygui.UIPackage.createObject(_this._fairyPkgName, _this._fairyResName).asMovieClip;
                _this.setViewPivot();
                _this.addChild(_this.view);
                _this.standRight();
                _this.setViewHitRect();
                _this.hideHitArea(); // 默认不显示碰撞区域
                _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
                return _this;
            }
            Avatar.prototype.onAddToStage = function (event) {
                this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFormStage, this);
                if (!avatar.layerAvatars[this.parent.id]) {
                    avatar.layerAvatars[this.parent.id] = [];
                }
                avatar.layerAvatars[this.parent.id].push(this);
                this.onAddToStageComplete();
            };
            Avatar.prototype.onRemoveFormStage = function (event) {
                this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFormStage, this);
                for (var key in avatar.layerAvatars) {
                    var idx = avatar.layerAvatars[key].indexOf(this);
                    if (idx > -1) {
                        avatar.layerAvatars[key].splice(idx, 1);
                    }
                }
                this.onremoveFromStageComplete();
            };
            Avatar.prototype.onAddToStageComplete = function () { };
            Avatar.prototype.onremoveFromStageComplete = function () { };
            Avatar.prototype.setViewPivot = function () {
                this.view.setPivot(0.5, 0.8, true);
            };
            Avatar.prototype.setViewHitRect = function () {
                this.setHitRect(new egret.Rectangle(0, 0, 20, 14));
            };
            Avatar.prototype.createHitArea = function () {
                this._hitArea = new fairygui.GGraph();
                this._hitArea.graphics.beginFill(0xffffff, 0.4);
                this._hitArea.graphics.drawRect(0, 0, this._hitRect.width, this._hitRect.height);
                this._hitArea.graphics.endFill();
                this.addChildAt(this._hitArea, 0);
                this._hitArea.setXY(-this._hitRect.width / 2, -this._hitRect.height / 2);
            };
            Avatar.prototype.showHitArea = function () {
                if (!this._hitArea) {
                    this.createHitArea();
                }
                this._hitArea.visible = true;
            };
            Avatar.prototype.hideHitArea = function () {
                if (this._hitArea) {
                    this._hitArea.visible = false;
                }
            };
            Avatar.prototype.initPackSetting = function () {
                this._fairyPkgName = 'enemies';
                this._fairyResName = '';
                console.warn('没有设置avatar的资源包和名字');
            };
            Avatar.prototype.initPack = function () {
                if (avatar.avatarPack == null) {
                    avatar.avatarPack = fairygui.UIPackage.addPackage(this._fairyPkgName);
                }
            };
            Avatar.prototype._playAction = function (start, end, stop, callback, dir) {
                if (dir === void 0) { dir = 1; }
                this.view.scaleX = dir; // 默认为1，反向为-1
                this.view.setPlaySettings(start, end, 1, stop, callback, this);
                this.view.playing = true;
            };
            Avatar.prototype.runRight = function () {
                this._dir = DIR.RIGHT;
                this._state = STATE.RUN;
                this._playRun(1);
            };
            Avatar.prototype._playRun = function (dir) {
                var _this = this;
                this._playAction(0, 21, 21, function () {
                    _this._playRun(dir);
                }, dir);
            };
            Avatar.prototype.runLeft = function () {
                this._dir = DIR.LEFT;
                this._state = STATE.RUN;
                this._playRun(-1);
            };
            Avatar.prototype.runUp = function () {
                this._dir = DIR.UP;
                this._state = STATE.RUN;
                this._runUp();
            };
            Avatar.prototype._runUp = function () {
                this._playAction(22, 43, 43, this.runUp);
            };
            Avatar.prototype.runDown = function () {
                this._dir = DIR.DOWN;
                this._state = STATE.RUN;
                this._runDown();
            };
            Avatar.prototype._runDown = function () {
                this._playAction(44, 65, 65, this.runDown);
            };
            Avatar.prototype.standRight = function () {
                // this._runPath = []
                egret.Tween.removeTweens(this);
                this._state = STATE.STAND;
                this.view.scaleX = 1;
                this._standFrame();
                this.view.playing = false;
            };
            Avatar.prototype._standFrame = function () {
                this.view.frame = 66;
            };
            Avatar.prototype.standLeft = function () {
                this.standRight();
                this.view.scaleX = -1;
            };
            Avatar.prototype.atkRight = function (callback) {
                if (callback === void 0) { callback = null; }
                // this._runPath = []
                egret.Tween.removeTweens(this);
                this._state = STATE.ATK;
                this._atk(1, callback);
            };
            Avatar.prototype._atk = function (dir, callback) {
                if (callback === void 0) { callback = null; }
                this._playAction(66, 78, 66, callback, dir);
            };
            Avatar.prototype.atkLeft = function (callback) {
                if (callback === void 0) { callback = null; }
                // this._runPath = []
                egret.Tween.removeTweens(this);
                this._state = STATE.ATK;
                this._atk(-1, callback);
            };
            /**缠绕 */
            Avatar.prototype.thron = function () {
                egret.Tween.removeTweens(this);
                this._state = STATE.THRON;
                this._thron();
            };
            Avatar.prototype._thron = function () {
                this._playAction(79, 97, 97, null);
            };
            /**缠绕解除 */
            Avatar.prototype.thronFree = function () {
                egret.Tween.removeTweens(this);
                this._state = STATE.THRON_FREE;
                this._thronFree();
            };
            Avatar.prototype._thronFree = function () {
                this._playAction(98, 101, 101, null);
            };
            Avatar.prototype.deadRight = function () {
                // this._runPath = []
                egret.Tween.removeTweens(this);
                this._state = STATE.DEAD;
                this._playDead(-1);
            };
            Avatar.prototype._playDead = function (dir) {
                this._playAction(102, 111, 111, null, dir);
            };
            Avatar.prototype.deadLeft = function () {
                // this._runPath = []
                egret.Tween.removeTweens(this);
                this._state = STATE.DEAD;
                this._playDead(1);
            };
            Avatar.prototype.dead = function () {
                var _this = this;
                egret.Tween.removeTweens(this);
                console.log('dead _dir', this._dir);
                if (this._dir == DIR.LEFT) {
                    this.deadLeft();
                }
                else {
                    this.deadRight();
                }
                console.log('dead', this._state);
                egret.setTimeout(function () {
                    egret.Tween.get(_this.view).to({ alpha: 0 }, 1000).call(function () {
                        _this.removeFromParent();
                    });
                }, this, 1000);
            };
            // IHitArea
            Avatar.prototype.setHitRect = function (rect) {
                this._hitRect = rect;
            };
            Avatar.prototype.getHitRect = function () {
                this._hitRect.x = this.x - this._hitRect.width / 2;
                this._hitRect.y = this.y - this._hitRect.height / 2;
                return this._hitRect;
            };
            return Avatar;
        }(fairygui.GComponent));
        avatar.Avatar = Avatar;
        __reflect(Avatar.prototype, "fg.avatar.Avatar", ["utils.IHitArea"]);
    })(avatar = fg.avatar || (fg.avatar = {}));
})(fg || (fg = {}));
//# sourceMappingURL=Avatar.js.map