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
var lps;
(function (lps) {
    function getLpsProxy() {
        return LuckyPkSizeProxy.inst;
    }
    lps.getLpsProxy = getLpsProxy;
    var LuckyPkSizeProxy = (function (_super) {
        __extends(LuckyPkSizeProxy, _super);
        function LuckyPkSizeProxy() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.cards = [];
            return _this;
        }
        Object.defineProperty(LuckyPkSizeProxy, "inst", {
            get: function () {
                if (LuckyPkSizeProxy._inst == null) {
                    LuckyPkSizeProxy._inst = new LuckyPkSizeProxy();
                }
                return LuckyPkSizeProxy._inst;
            },
            enumerable: true,
            configurable: true
        });
        LuckyPkSizeProxy.prototype.createCards = function () {
            this.cards = pkcard.getRandomDatas();
        };
        return LuckyPkSizeProxy;
    }(ssp.ModuleProxy));
    lps.LuckyPkSizeProxy = LuckyPkSizeProxy;
    __reflect(LuckyPkSizeProxy.prototype, "lps.LuckyPkSizeProxy");
    var LuckyPkSizeScreen = (function (_super) {
        __extends(LuckyPkSizeScreen, _super);
        function LuckyPkSizeScreen() {
            var _this = _super.call(this, LuckyPkSizeScreen.NAME) || this;
            _this.fairyPkgName = 'luckypksize';
            _this.fairyResName = 'Table';
            _this.resGroup = ['luckypksize'];
            return _this;
        }
        LuckyPkSizeScreen.prototype.onInit = function () {
            var bg = new fairygui.GImage();
            bg.texture = RES.getRes('bg_png');
            bg.width = this.view.width;
            bg.height = this.view.height;
            this.view.addChildAt(bg, 0);
            this.contCards = this.getChild('contCard').asCom;
            this.contMyCards = this.getChild('contSelected').asCom;
            this.btnYaopai = this.getChild('btnYaopai').asButton;
            this.btnReward = this.getChild('btnReward').asButton;
            this.btnStart = this.getChild('btnStart').asButton;
            this.txtPoint = this.getChild('txtPoint').asTextField;
            this.imgLose = this.getChild('imgLose').asImage;
            this.imgWin = this.getChild('imgWin').asImage;
            this.reset();
        };
        LuckyPkSizeScreen.prototype.reset = function () {
            this.btnYaopai.visible = false;
            this.btnReward.visible = false;
            this.imgLose.visible = false;
            this.imgWin.visible = false;
            this.btnStart.visible = true;
            // 初始化牌库
            lps.getLpsProxy().createCards();
            this.allCards = [];
            this.myCards = [];
            this.clearAllContent();
            this.txtPoint.text = '';
        };
        LuckyPkSizeScreen.prototype.start = function () {
            this.btnStart.visible = false;
            this.dealCard();
        };
        LuckyPkSizeScreen.prototype.dealCard = function () {
            var _this = this;
            if (lps.getLpsProxy().cards.length <= 0) {
                console.log('deal over');
                this.btnYaopai.visible = true;
                this.btnReward.visible = true;
                return;
            }
            var c = new pkcard.Card();
            c.data = lps.getLpsProxy().cards.pop();
            c.showBack();
            this.allCards.push(c);
            this.contCards.addChild(c.view);
            c.view.setXY((this.contCards.numChildren - 1) % 26 * 30, Math.floor((this.contCards.numChildren - 1) / 26) * 120);
            setTimeout(function () {
                _this.dealCard();
            }, 10);
        };
        LuckyPkSizeScreen.prototype.yaopai = function () {
            if (this.myCards.length >= 4) {
                return;
            }
            var c = this.allCards.pop();
            this.myCards.push(c);
            this.contMyCards.addChild(c.view);
            c.view.setXY((this.contMyCards.numChildren - 1) * 90, 0);
            c.showFace();
            this.chkResult();
        };
        LuckyPkSizeScreen.prototype.reward = function () {
            this.reset();
        };
        LuckyPkSizeScreen.prototype.chkResult = function () {
            var _this = this;
            var p = 0;
            for (var i = 0; i < this.myCards.length; i++) {
                var element = this.myCards[i];
                p += pkcard.getPointByCardNum(element.data);
            }
            this.txtPoint.text = p + '点';
            if (p > 10.5) {
                this.imgLose.visible = true;
                this.btnYaopai.visible = false;
                this.btnReward.visible = false;
                setTimeout(function () {
                    _this.reset();
                }, 1000);
                this.txtPoint.text = p + '点, 爆掉啦';
            }
        };
        LuckyPkSizeScreen.prototype.clearAllContent = function () {
            this.contCards.removeChildren();
            this.contMyCards.removeChildren();
        };
        LuckyPkSizeScreen.prototype.onClick = function (target) {
            switch (target) {
                case this.btnStart:
                    console.log('start');
                    this.start();
                    break;
                case this.btnYaopai:
                    console.log('yaopai');
                    this.yaopai();
                    break;
                case this.btnReward:
                    console.log('reward');
                    this.reward();
                    break;
            }
        };
        LuckyPkSizeScreen.NAME = 'LuckyPkSizeScreen';
        return LuckyPkSizeScreen;
    }(ui.SspScreen));
    lps.LuckyPkSizeScreen = LuckyPkSizeScreen;
    __reflect(LuckyPkSizeScreen.prototype, "lps.LuckyPkSizeScreen");
})(lps || (lps = {}));
//# sourceMappingURL=LuckyPkSizeScreen.js.map