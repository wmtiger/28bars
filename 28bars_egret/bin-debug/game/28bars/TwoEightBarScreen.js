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
var twoeightbar;
(function (twoeightbar) {
    var STATE;
    (function (STATE) {
        STATE[STATE["BET_TIME"] = 0] = "BET_TIME";
        STATE[STATE["DEAL_CARD"] = 1] = "DEAL_CARD";
        STATE[STATE["OPEN_CARD"] = 2] = "OPEN_CARD";
        STATE[STATE["SETTLE"] = 3] = "SETTLE";
        STATE[STATE["RESET"] = 4] = "RESET";
    })(STATE = twoeightbar.STATE || (twoeightbar.STATE = {}));
    function getTwoEightBarProxy() {
        return TwoEightBarProxy.inst;
    }
    twoeightbar.getTwoEightBarProxy = getTwoEightBarProxy;
    var TwoEightBarProxy = (function (_super) {
        __extends(TwoEightBarProxy, _super);
        function TwoEightBarProxy() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.paiku = [];
            _this.bipaiList = ["9,9", "8,8", "7,7", "6,6", "5,5", "4,4", "3,3", "2,2", "1,1",
                "8,2", "8,1", "7,2", "6,3", "5,4", "7,1", "6,2", "5,3", "9,8", "6,1", "5,2", "4,3",
                "9,7", "5,1", "4,2", "9,6", "8,7", "4,1", "3,2", "9,5", "8,6", "3,1", "9,4", "8,5", "7,6", "2,1",
                "9,3", "8,4", "7,5", "9,2", "8,3", "7,4", "6,5", "9,1", "7,3", "6,4"];
            return _this;
        }
        Object.defineProperty(TwoEightBarProxy, "inst", {
            get: function () {
                if (TwoEightBarProxy._inst == null) {
                    TwoEightBarProxy._inst = new TwoEightBarProxy();
                }
                return TwoEightBarProxy._inst;
            },
            enumerable: true,
            configurable: true
        });
        TwoEightBarProxy.prototype.initPaiku = function () {
            this.paiku = mj.getRandomMjs(mj.MjData.TONG);
        };
        TwoEightBarProxy.prototype.getBipaiIdx = function (nums) {
            return this.bipaiList.indexOf(nums);
        };
        TwoEightBarProxy.prototype.getPointStr = function (ps) {
            var bz = ["9,9", "8,8", "7,7", "6,6", "5,5", "4,4", "3,3", "2,2", "1,1"];
            var tg = '8,2';
            if (bz.indexOf(ps) >= 0) {
                return '豹子';
            }
            if (ps == tg) {
                return '天杠';
            }
            var pp = ps.split(',');
            var num = Math.floor(parseInt(pp[0]) + parseInt(pp[1])) % 10;
            return num + '点';
        };
        return TwoEightBarProxy;
    }(ssp.ModuleProxy));
    twoeightbar.TwoEightBarProxy = TwoEightBarProxy;
    __reflect(TwoEightBarProxy.prototype, "twoeightbar.TwoEightBarProxy");
    var TwoEightBarScreen = (function (_super) {
        __extends(TwoEightBarScreen, _super);
        function TwoEightBarScreen() {
            var _this = _super.call(this, TwoEightBarScreen.NAME) || this;
            _this.rewardPoolValue = 0;
            _this.mySelectedBet = 0; // 我选中的下注尺度
            _this.crtState = 4;
            _this._updateInterval = -1;
            _this._mjDealCnt = 0;
            _this._pointOverCnt = 0;
            _this.fairyPkgName = 'twoeightbar_pkg';
            _this.fairyResName = 'Table';
            _this.resGroup = ['teb']; // twoeightbar 的缩写
            return _this;
        }
        TwoEightBarScreen.prototype._initCommonPack = function () {
            // 不需要加载common
        };
        TwoEightBarScreen.prototype.startUpdate = function () {
            this._updateInterval = egret.setInterval(this.onUpdate, this, 60);
        };
        TwoEightBarScreen.prototype.onUpdate = function () {
            this.flushBetTime();
            this.flushRewardPool();
        };
        TwoEightBarScreen.prototype.flushBetTime = function () {
            if (this.crtState == STATE.BET_TIME && this.betTime) {
                var crtTime = utils.getCrtTimeStamp();
                var dt = Math.floor((this.betTimeStamp - crtTime) / 1000);
                if (dt >= 0) {
                    this.betTime.getChild('txt').text = '开始下注......' + dt + '秒';
                    this.betTime.visible = true;
                }
                else {
                    this.betTime.visible = false;
                    this.setState(STATE.DEAL_CARD);
                }
            }
        };
        TwoEightBarScreen.prototype.doBet = function (from, betNum, targetId) {
            if (targetId === void 0) { targetId = 0; }
            if (betNum > 0) {
                if (from >= 0 && from < 8) {
                    // sit中玩家
                    var player = this.players[from];
                    this.flyBet(player.x + 50, player.y + 50, from, betNum, targetId);
                }
                else if (from == 8) {
                    // mine
                    this.flyBet(this.myHead.x + 50, this.myHead.y + 50, from, betNum, targetId);
                }
                else if (from >= 9) {
                    // other
                    this.flyBet(this.btnOther.x + 30, this.btnOther.y + 30, from, betNum, targetId);
                }
                this.rewardPoolValue += this.getBetNum(betNum);
            }
            else {
                // rebuy
                this.clearChipByFrom(from);
            }
        };
        TwoEightBarScreen.prototype.flyBet = function (x, y, from, num, targetId) {
            var tox, toy;
            if (targetId == 0) {
                //中
                tox = 170 + 210 * Math.random();
                toy = 330 + 150 * Math.random();
            }
            else if (targetId == 1) {
                //发
                tox = 460 + 350 * Math.random();
                toy = 410 + 150 * Math.random();
            }
            else if (targetId == 2) {
                //白
                tox = 870 + 210 * Math.random();
                toy = 330 + 150 * Math.random();
            }
            for (var i = 0; i < num; i++) {
                var chip = new twoeightbar.BetChip();
                chip.from = from;
                chip.targetId = targetId;
                this.view.addChild(chip.view);
                this.betChips.push(chip);
                egret.Tween.get(chip.view)
                    .set({ x: x, y: y, scaleX: 0.3, scaleY: 0.3 })
                    .to({ x: tox, y: toy, scaleX: 1, scaleY: 1 }, 300, egret.Ease.sineOut);
            }
        };
        TwoEightBarScreen.prototype.clearChipByFrom = function (from) {
            var len = this.betChips.length;
            for (var i = len - 1; i >= 0; i--) {
                var chip = this.betChips[i];
                if (chip.from === from) {
                    var dc = this.betChips.splice(i, 1)[0];
                    dc.view.removeFromParent();
                }
            }
        };
        TwoEightBarScreen.prototype.flushRewardPool = function () {
            if (STATE.BET_TIME == this.crtState) {
                this.rewardPool.getChild('txt').text = '' + this.rewardPoolValue;
            }
        };
        TwoEightBarScreen.prototype.getBetNum = function (bet) {
            var num = 0;
            if (bet == 1) {
                num = 100;
            }
            else if (bet == 2) {
                num = 1000;
            }
            else if (bet == 3) {
                num = 10000;
            }
            else if (bet == 4) {
                num = 100000;
            }
            else if (bet == 5) {
                num = 1000000;
            }
            return num;
        };
        TwoEightBarScreen.prototype.dealCard = function () {
            var _this = this;
            var _loop_1 = function (i) {
                var mjmv = this_1.mjMvs[i];
                var tox = this_1.mjMvXYs[i].x;
                var toy = this_1.mjMvXYs[i].y;
                setTimeout(function () {
                    egret.Tween.get(mjmv).to({ width: 73, height: 106, x: tox, y: toy }, 200, egret.Ease.sineOut)
                        .call(_this.mjmvDealOver, _this);
                }, 100 * i);
            };
            var this_1 = this;
            for (var i = 0; i < 8; i++) {
                _loop_1(i);
            }
        };
        TwoEightBarScreen.prototype.mjmvDealOver = function () {
            this._mjDealCnt++;
            if (this._mjDealCnt >= this.mjMvs.length) {
                // over
                this.setState(STATE.OPEN_CARD);
            }
        };
        TwoEightBarScreen.prototype.openCard = function () {
            var _this = this;
            var _loop_2 = function () {
                var idx = i;
                setTimeout(function () {
                    _this.openCardByIdx(idx);
                }, 400 * i);
            };
            for (var i = 0; i < 4; i++) {
                _loop_2();
            }
        };
        TwoEightBarScreen.prototype.openCardByIdx = function (idx) {
            var _this = this;
            idx *= 2;
            var mv = this.mjMvs[idx];
            var mv2 = this.mjMvs[idx + 1];
            var mj = this.mjViews[idx];
            var mj2 = this.mjViews[idx + 1];
            var mjd = this.cards[idx];
            var mjd2 = this.cards[idx + 1];
            mv.setPlaySettings(0, -1, 1, 0, function () {
                mv.visible = false;
                mj.visible = true;
                var img = fairygui.UIPackage.createObject(_this.fairyPkgName, "majiang_card_" + mjd.num).asImage;
                mj.removeChildren();
                mj.addChild(img);
            });
            mv.playing = true;
            mv2.setPlaySettings(0, -1, 1, 0, function () {
                mv2.visible = false;
                mj2.visible = true;
                var img = fairygui.UIPackage.createObject(_this.fairyPkgName, "majiang_card_" + mjd2.num).asImage;
                mj2.removeChildren();
                mj2.addChild(img);
                setTimeout(function () {
                    _this.showPoint(idx);
                    _this.pointShowOver();
                }, 200);
            });
            mv2.playing = true;
        };
        TwoEightBarScreen.prototype.showPoint = function (idx) {
            var p = this.mjPoints[Math.floor(idx / 2)];
            var mjd = this.cards[idx];
            var mjd2 = this.cards[idx + 1];
            p.text = '' + getTwoEightBarProxy().getPointStr(mjd.num + ',' + mjd2.num);
            p.visible = true;
        };
        TwoEightBarScreen.prototype.pointShowOver = function () {
            this._pointOverCnt++;
            if (this._pointOverCnt >= this.mjPoints.length) {
                // over
                this.setState(STATE.SETTLE);
            }
        };
        TwoEightBarScreen.prototype.settle = function () {
            var _this = this;
            // 依次判断庄家是否胜利，相同点数，庄家赢
            var dealer = this.getCard(3);
            var card0 = this.getCard(0);
            var card1 = this.getCard(1);
            var card2 = this.getCard(2);
            var dealerIdx = getTwoEightBarProxy().getBipaiIdx(dealer);
            var card0Idx = getTwoEightBarProxy().getBipaiIdx(card0);
            var card1Idx = getTwoEightBarProxy().getBipaiIdx(card1);
            var card2Idx = getTwoEightBarProxy().getBipaiIdx(card2);
            if (dealerIdx <= card0Idx) {
                this.moneyFly(0, 0);
            }
            else {
                this.moneyFly(0, 1);
            }
            if (dealerIdx <= card1Idx) {
                this.moneyFly(1, 0);
            }
            else {
                this.moneyFly(1, 1);
            }
            if (dealerIdx <= card2Idx) {
                this.moneyFly(2, 0);
            }
            else {
                this.moneyFly(2, 1);
            }
            if (this.betChips.length <= 0) {
                setTimeout(function () {
                    _this.setState(STATE.RESET);
                }, 1000);
            }
        };
        TwoEightBarScreen.prototype.getCard = function (idx) {
            idx *= 2;
            var mjd = this.cards[idx];
            var mjd2 = this.cards[idx + 1];
            if (mjd.num >= mjd2.num) {
                return mjd.num + ',' + mjd2.num;
            }
            return mjd2.num + ',' + mjd.num;
        };
        /** from等于之前的targetId; to=0为庄家,to>0则从chip中的from返回 */
        TwoEightBarScreen.prototype.moneyFly = function (from, to) {
            var _this = this;
            var tox, toy;
            if (to == 0) {
                tox = this.dealHead.x + 50;
                toy = this.dealHead.y + 50;
            }
            var len = this.betChips.length;
            var _loop_3 = function () {
                chip = this_2.betChips[i];
                if (chip.targetId === from) {
                    var fc_1 = this_2.betChips.splice(i, 1)[0];
                    if (to > 0) {
                        if (fc_1.from >= 0 && fc_1.from < 8) {
                            var player = this_2.players[from];
                            tox = player.x + 50;
                            toy = player.y + 50;
                        }
                        else if (fc_1.from == 8) {
                            tox = this_2.myHead.x + 50;
                            toy = this_2.myHead.y + 50;
                        }
                        else if (fc_1.from == 9) {
                            tox = this_2.btnOther.x + 30;
                            toy = this_2.btnOther.y + 30;
                        }
                    }
                    egret.Tween.get(fc_1.view).to({ x: tox, y: toy, scaleX: 0.3, scaleY: 0.3 }, 500, egret.Ease.sineOut)
                        .call(function () {
                        fc_1.view.removeFromParent();
                        setTimeout(function () {
                            _this.setState(STATE.RESET);
                        }, 1000);
                    });
                }
            };
            var this_2 = this, chip;
            for (var i = len - 1; i >= 0; i--) {
                _loop_3();
            }
        };
        TwoEightBarScreen.prototype.setState = function (state) {
            this.crtState = state;
            switch (state) {
                case STATE.BET_TIME:
                    break;
                case STATE.DEAL_CARD:
                    this.dealCard();
                    break;
                case STATE.OPEN_CARD:
                    this.openCard();
                    break;
                case STATE.SETTLE:
                    this.settle();
                    break;
                case STATE.RESET:
                    this.reset();
                    break;
                default:
                    break;
            }
        };
        TwoEightBarScreen.prototype.onInit = function () {
            var bg = new fairygui.GImage();
            bg.texture = RES.getRes('majiang_desk_bg_png');
            bg.width = this.view.width;
            bg.height = this.view.height;
            this.view.addChildAt(bg, 0);
            var bg2 = new fairygui.GImage();
            bg2.texture = RES.getRes('majiang_bet_area_bg_png');
            bg2.x = this.view.width - bg2.texture.textureWidth >> 1;
            bg2.y = this.view.height - bg2.texture.textureHeight >> 1;
            this.view.addChildAt(bg2, 1);
            this.betChip0 = this.getChild('betBar.chip0').asButton;
            this.betChip1 = this.getChild('betBar.chip1').asButton;
            this.betChip2 = this.getChild('betBar.chip2').asButton;
            this.betChip3 = this.getChild('betBar.chip3').asButton;
            this.betChip4 = this.getChild('betBar.chip4').asButton;
            this.betRebuy = this.getChild('betBar.rebuy').asButton;
            this.betSelected = this.getChild('betBar.selected').asCom;
            this.mvLightLeft = this.getChild('lightLeft').asMovieClip;
            this.mvLightMiddle = this.getChild('lightMiddle').asMovieClip;
            this.mvLightRight = this.getChild('lightRight').asMovieClip;
            this.betAreaLeft = this.getChild('betAreaLeft').asCom;
            this.betAreaMiddle = this.getChild('betAreaMiddle').asCom;
            this.betAreaRight = this.getChild('betAreaRight').asCom;
            this.betTime = this.getChild('betTime').asCom;
            this.rewardPool = this.getChild('rewardPool').asCom;
            this.dealHead = this.getChild('dealHead').asImage;
            this.myHead = this.getChild('myHead').asCom;
            this.btnOther = this.getChild('btnOther').asButton;
            this.mjViewXYs = [];
            this.mjViews = [];
            for (var i = 0; i < 8; i++) {
                this.mjViews[i] = this.getChild('mj' + i).asCom;
                this.mjViewXYs[i] = new egret.Point(this.mjViews[i].x, this.mjViews[i].y);
            }
            this.mjMvXYs = [];
            this.mjMvs = [];
            for (var i = 0; i < 8; i++) {
                this.mjMvs[i] = this.getChild('mv' + i).asMovieClip;
                this.mjMvXYs[i] = new egret.Point(this.mjMvs[i].x, this.mjMvs[i].y);
            }
            this.mjPoints = [];
            for (var i = 0; i < 4; i++) {
                this.mjPoints[i] = this.getChild('point' + i).asTextField;
            }
            this.players = [];
            for (var i = 0; i < 8; i++) {
                this.players[i] = this.getChild('player' + i).asCom;
            }
            this.betChips = [];
            this.startUpdate();
            this.reset();
        };
        TwoEightBarScreen.prototype.reset = function () {
            getTwoEightBarProxy().initPaiku();
            this.cards = getTwoEightBarProxy().paiku;
            for (var i = 0; i < 8; i++) {
                var mjview = this.mjViews[i];
                mjview.x = this.mjViewXYs[i].x;
                mjview.y = this.mjViewXYs[i].y;
                mjview.visible = false;
            }
            for (var i = 0; i < 8; i++) {
                var mjmv = this.mjMvs[i];
                mjmv.width = 36;
                mjmv.height = 53;
                mjmv.visible = true;
                mjmv.playing = false;
                mjmv.x = 574 + Math.floor(i / 2) * 31;
                mjmv.y = 258 + (i % 2) * 12;
            }
            for (var i = 0; i < 4; i++) {
                this.mjPoints[i].visible = false;
            }
            this.mvLightLeft.visible = false;
            this.mvLightMiddle.visible = false;
            this.mvLightRight.visible = false;
            this.rewardPool.getChild('txt').text = '0';
            for (var i = 0; i < this.betChips.length; i++) {
                var element = this.betChips[i];
                element.view.removeFromParent();
            }
            this.betChips = [];
            this._mjDealCnt = 0;
            this._pointOverCnt = 0;
            this.rewardPoolValue = 0;
            this.start();
        };
        TwoEightBarScreen.prototype.start = function () {
            this.betTimeStamp = utils.getCrtTimeStamp() + 1000 * 8;
            this.setState(STATE.BET_TIME);
        };
        TwoEightBarScreen.prototype.onClick = function (target) {
            switch (target) {
                case this.betChip0:
                    this.mySelectedBet = 0;
                    this.betSelected.x = 5;
                    break;
                case this.betChip1:
                    this.mySelectedBet = 1;
                    this.betSelected.x = 121;
                    break;
                case this.betChip2:
                    this.mySelectedBet = 2;
                    this.betSelected.x = 237;
                    break;
                case this.betChip3:
                    this.mySelectedBet = 3;
                    this.betSelected.x = 353;
                    break;
                case this.betChip4:
                    this.mySelectedBet = 4;
                    this.betSelected.x = 469;
                    break;
                case this.betRebuy:
                    if (STATE.BET_TIME == this.crtState) {
                        this.doBet(8, -1);
                    }
                    break;
                case this.betAreaLeft:
                    if (STATE.BET_TIME == this.crtState) {
                        this.doBet(8, this.mySelectedBet + 1, 0);
                    }
                    break;
                case this.betAreaMiddle:
                    if (STATE.BET_TIME == this.crtState) {
                        this.doBet(8, this.mySelectedBet + 1, 1);
                    }
                    break;
                case this.betAreaRight:
                    if (STATE.BET_TIME == this.crtState) {
                        this.doBet(8, this.mySelectedBet + 1, 2);
                    }
                    break;
            }
        };
        TwoEightBarScreen.NAME = 'TwoEightBarScreen';
        return TwoEightBarScreen;
    }(ui.SspScreen));
    twoeightbar.TwoEightBarScreen = TwoEightBarScreen;
    __reflect(TwoEightBarScreen.prototype, "twoeightbar.TwoEightBarScreen");
})(twoeightbar || (twoeightbar = {}));
//# sourceMappingURL=TwoEightBarScreen.js.map