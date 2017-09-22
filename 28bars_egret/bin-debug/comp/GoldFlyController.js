var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * 奖励的飞入逻辑控制
 */
var utils;
(function (utils) {
    var GoldFlyController = (function () {
        function GoldFlyController() {
            this.images = [];
            this._steps = [];
        }
        /**
         * 中牌后产口金币飞入特效
         * mode = 1 平飞
         * mode = 2 六脉神剑
         * mode = 3 星际航母
         *
         * randomSize 随机大小，随机旋转角度
         * isCenter beizer 是否取两点的中间(视频效果,mode 2)
         */
        GoldFlyController.prototype.bingo = function (startPoint, targetPoint, duration, count) {
            if (duration === void 0) { duration = 1000; }
            if (count === void 0) { count = 30; }
            return __awaiter(this, void 0, void 0, function () {
                var mode, randomSize, isCenter, root, i, beziers, p2, scale, rotation, img, bezier, sleep, aTime;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mode = 3;
                            randomSize = true;
                            isCenter = false;
                            root = fairygui.GRoot.inst;
                            i = 0;
                            beziers = [];
                            p2 = new egret.Point();
                            fairygui.UIPackage.addPackage("effect");
                            for (i = 0; i < count; i++) {
                                scale = Math.floor(randomSize ? Math.random() * 2 : 2) - 1;
                                rotation = randomSize ? Math.random() * 360 : 0;
                                img = fairygui.UIPackage.createObject("Effect", "CoinClip").asMovieClip;
                                img.width = 39;
                                img.height = 39;
                                // img.pivotX = img.width/2;
                                // img.pivotY = img.height/2;
                                root.addChild(img);
                                this.images.push(img);
                                img.rotation = rotation;
                                img.x = startPoint.x;
                                img.y = startPoint.y;
                                img.visible = false;
                                if (mode != 1) {
                                    bezier = new utils.BezierNode(img, new egret.Point(img.x, img.y), p2, targetPoint);
                                    beziers.push(bezier);
                                    if (mode == 2) {
                                        if (p2.x == 0 && p2.y == 0)
                                            p2 = bezier.generatorP2(3, 1, isCenter);
                                    }
                                    else {
                                        bezier.generatorP2(3, 1, isCenter);
                                    }
                                    egret.Tween.get(bezier)
                                        .wait(this._gapDuration * i)
                                        .call(function () {
                                        var args = [];
                                        for (var _i = 0; _i < arguments.length; _i++) {
                                            args[_i] = arguments[_i];
                                        }
                                        args[0].visible = true;
                                    }, this, [img])
                                        .to({ factor: 1 }, duration, egret.Ease.quadOut)
                                        .call(function () {
                                        var args = [];
                                        for (var _i = 0; _i < arguments.length; _i++) {
                                            args[_i] = arguments[_i];
                                        }
                                        args[0].removeFromParent(false);
                                    }, this, [img]);
                                }
                                else {
                                    egret.Tween.get(img)
                                        .wait(this._gapDuration * i)
                                        .set({ visible: true })
                                        .to({ x: targetPoint.x, y: targetPoint.y, rotation: 720 }, duration, egret.Ease.quartIn);
                                }
                            }
                            sleep = function (time) {
                                var _this = this;
                                if (time === void 0) { time = 1000; }
                                return new Promise(function (resolve, reject) {
                                    egret.setTimeout(function () { resolve(time); }, _this, time);
                                });
                            };
                            aTime = this._gapDuration * count + duration;
                            return [4 /*yield*/, sleep(aTime)];
                        case 1:
                            _a.sent();
                            for (i = 0; i < beziers.length; i++) {
                                egret.Tween.removeTweens(beziers[i]);
                            }
                            this._currenOrigin = targetPoint;
                            this.nextStep();
                            return [2 /*return*/];
                    }
                });
            });
        };
        GoldFlyController.prototype.nextStep = function () {
            this._playing = false;
            if (this._steps != null && this._steps.length > 0) {
                var cmds = this._steps.shift();
                var func = this[cmds.shift()];
                func.apply(this, cmds);
            }
        };
        GoldFlyController.prototype.setGap = function (duration) {
            if (this._playing) {
                this._steps.push(["setOrigin", this._gapDuration]);
            }
            else {
                this._gapDuration = duration;
                this.nextStep();
            }
            return this;
        };
        /** target表示起点对象，
         * h表示对其方式，数字为1/2宽度的倍数，-1左对齐，1右对齐，0居中，其他数字为高级用法，也有效不同效果
         * v表示对其方式，数字为1/2高度的倍数，-1左对齐，1右对齐，0居中，其他数字为高级用法，也有效不同效果
         */
        GoldFlyController.prototype.setOrigin = function (target, h, v) {
            if (h === void 0) { h = 0; }
            if (v === void 0) { v = 0; }
            if (this._playing) {
                this._steps.push(["setOrigin", target, h, v]);
            }
            else {
                this._currenOrigin = target.localToGlobal();
                this._currenOrigin.x += (h + 1) * .5 * target.width;
                this._currenOrigin.y += (v + 1) * .5 * target.height;
                this.nextStep();
            }
            return this;
        };
        GoldFlyController.prototype.flyTo = function (end, time, numStars, h, v) {
            if (h === void 0) { h = 0; }
            if (v === void 0) { v = 0; }
            if (this._playing) {
                this._steps.push(["flyTo", end, time, numStars]);
            }
            else {
                var targetOrigin = end.localToGlobal();
                targetOrigin.x += (h + 1) * .5 * end.width;
                targetOrigin.y += (v + 1) * .5 * end.height;
                this.bingo(this._currenOrigin, targetOrigin, time, numStars);
                this._playing = true;
            }
            return this;
        };
        GoldFlyController.prototype.call = function (func, thisObj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (this._playing) {
                this._steps.push(["call", func, thisObj, args]);
            }
            else {
                func.apply(thisObj, args);
                this._playing = true;
                this.nextStep();
            }
            return this;
        };
        GoldFlyController.prototype.wait = function (time) {
            if (this._playing) {
                this._steps.push(["wait", time]);
            }
            else {
                egret.setTimeout(this.nextStep, this, time);
                this._playing = true;
            }
            return this;
        };
        GoldFlyController.prototype.clearAll = function () {
            egret.Tween.removeAllTweens();
            this.images.forEach(function (element) {
                element.removeFromParent();
            });
            this.images = [];
        };
        GoldFlyController.prototype.dispose = function () {
            this.clearAll();
        };
        return GoldFlyController;
    }());
    utils.GoldFlyController = GoldFlyController;
    __reflect(GoldFlyController.prototype, "utils.GoldFlyController");
})(utils || (utils = {}));
//# sourceMappingURL=GoldFlyController.js.map