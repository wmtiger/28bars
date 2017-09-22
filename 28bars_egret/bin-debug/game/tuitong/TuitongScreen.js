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
var tuitong;
(function (tuitong) {
    function getTuitongProxy() {
        return TuitongProxy.inst;
    }
    tuitong.getTuitongProxy = getTuitongProxy;
    var TuitongProxy = (function (_super) {
        __extends(TuitongProxy, _super);
        function TuitongProxy() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.paiku = [];
            _this.bipaiList = ["9,9", "8,8", "7,7", "6,6", "5,5", "4,4", "3,3", "2,2", "1,1",
                "8,2", "8,1", "7,2", "6,3", "5,4", "7,1", "6,2", "5,3", "9,8", "6,1", "5,2", "4,3",
                "9,7", "5,1", "4,2", "9,6", "8,7", "4,1", "3,2", "9,5", "8,6", "3,1", "9,4", "8,5", "7,6", "2,1",
                "9,3", "8,4", "7,5", "9,2", "8,3", "7,4", "6,5", "9,1", "7,3", "6,4"];
            return _this;
        }
        Object.defineProperty(TuitongProxy, "inst", {
            get: function () {
                if (TuitongProxy._inst == null) {
                    TuitongProxy._inst = new TuitongProxy();
                }
                return TuitongProxy._inst;
            },
            enumerable: true,
            configurable: true
        });
        TuitongProxy.prototype.initPaiku = function () {
            this.paiku = mj.getRandomMjs(mj.MjData.TONG);
        };
        TuitongProxy.prototype.getBipaiIdx = function (nums) {
            return this.bipaiList.indexOf(nums);
        };
        return TuitongProxy;
    }(ssp.ModuleProxy));
    tuitong.TuitongProxy = TuitongProxy;
    __reflect(TuitongProxy.prototype, "tuitong.TuitongProxy");
})(tuitong || (tuitong = {}));
var ui;
(function (ui) {
    var TuitongScreen = (function (_super) {
        __extends(TuitongScreen, _super);
        function TuitongScreen() {
            var _this = _super.call(this, TuitongScreen.NAME) || this;
            _this.winPos = [[493, 140], [770, 254], [493, 370], [220, 254]];
            _this.fairyPkgName = 'tuitong';
            _this.fairyResName = 'Table';
            _this.resGroup = ['tuitong'];
            return _this;
        }
        TuitongScreen.prototype.onInit = function () {
            var bg = new fairygui.GImage();
            bg.texture = RES.getRes('loadingbg_jpg');
            bg.width = this.view.width;
            bg.height = this.view.height;
            this.view.addChildAt(bg, 0);
            this.contLeft = this.getChild('contLeft').asCom;
            this.contUp = this.getChild('contUp').asCom;
            this.contRight = this.getChild('contRight').asCom;
            this.contDown = this.getChild('contDown').asCom;
            this.contents = [this.contUp, this.contRight, this.contDown, this.contLeft];
            this.btnReady = this.getChild('btnReady').asButton;
            this.imgWin = this.getChild('imgWin').asImage;
            this.imgWin.visible = false;
            this.reset();
        };
        TuitongScreen.prototype.reset = function () {
            this.btnReady.visible = true;
            // 初始化牌库
            tuitong.getTuitongProxy().initPaiku();
            this.mjs = [];
        };
        TuitongScreen.prototype.start = function () {
            var _this = this;
            this.imgWin.visible = false;
            this.clearAllContent();
            this.btnReady.visible = false;
            // 随机发牌，每人两张
            this.initMjShow();
            this.initMjShow();
            setTimeout(function () {
                _this.chkResult();
                _this.reset();
            }, 500);
        };
        TuitongScreen.prototype.chkResult = function () {
            var upIdx = tuitong.getTuitongProxy().getBipaiIdx(this.getContentDatas(this.contUp));
            var rightIdx = tuitong.getTuitongProxy().getBipaiIdx(this.getContentDatas(this.contRight));
            var downIdx = tuitong.getTuitongProxy().getBipaiIdx(this.getContentDatas(this.contDown));
            var leftIdx = tuitong.getTuitongProxy().getBipaiIdx(this.getContentDatas(this.contLeft));
            var temp = [{ pos: 0, idx: upIdx }, { pos: 1, idx: rightIdx }, { pos: 2, idx: downIdx }, { pos: 3, idx: leftIdx }];
            temp.sort(function (a, b) { return a.idx - b.idx; });
            var winidx = temp[0].pos;
            var p = this.winPos[winidx];
            this.imgWin.setXY(p[0], p[1]);
            this.imgWin.visible = true;
        };
        TuitongScreen.prototype.getContentDatas = function (cont) {
            var m = this.getMjByView(cont.getChildAt(0).asCom);
            var m2 = this.getMjByView(cont.getChildAt(1).asCom);
            if (m.mjdata.num > m2.mjdata.num) {
                return m.mjdata.num + ',' + m2.mjdata.num;
            }
            return m2.mjdata.num + ',' + m.mjdata.num;
        };
        TuitongScreen.prototype.getMjByView = function (v) {
            for (var i = 0; i < this.mjs.length; i++) {
                var element = this.mjs[i];
                if (element.view === v) {
                    return element;
                }
            }
            return null;
        };
        TuitongScreen.prototype.clearAllContent = function () {
            for (var i = 0; i < this.contents.length; i++) {
                var element = this.contents[i];
                element.removeChildren();
            }
        };
        TuitongScreen.prototype.initMjShow = function () {
            for (var i = 0; i < this.contents.length; i++) {
                var element = this.contents[i];
                var mjdata = tuitong.getTuitongProxy().paiku.pop();
                var mjup = new mj.MjTile_Up();
                mjup.mjdata = mjdata;
                this.mjs.push(mjup);
                mjup.flushTile();
                element.addChild(mjup.view);
                mjup.view.x = element.numChildren * 38;
            }
        };
        TuitongScreen.prototype.onClick = function (target) {
            switch (target) {
                case this.btnReady:
                    console.log('start');
                    this.start();
                    break;
            }
        };
        TuitongScreen.NAME = 'TuitongScreen';
        return TuitongScreen;
    }(ui.SspScreen));
    ui.TuitongScreen = TuitongScreen;
    __reflect(TuitongScreen.prototype, "ui.TuitongScreen");
})(ui || (ui = {}));
//# sourceMappingURL=TuitongScreen.js.map