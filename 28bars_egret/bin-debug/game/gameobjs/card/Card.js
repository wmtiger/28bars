var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var pkcard;
(function (pkcard) {
    var Card = (function () {
        function Card() {
            this.view = fairygui.UIPackage.createObject("luckypksize", "CardFace").asCom;
            this._bg = new fairygui.GImage();
            this.view.addChild(this._bg);
            this._num = new fairygui.GImage();
            this.view.addChild(this._num);
            this._num.setXY(8, 8);
        }
        Object.defineProperty(Card.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (d) {
                this._data = d;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Card.prototype, "view", {
            get: function () {
                return this._view;
            },
            set: function (v) {
                this._view = v;
            },
            enumerable: true,
            configurable: true
        });
        Card.prototype.showFace = function () {
            this._num.visible = true;
            var color = 'BLACK';
            if (this.data.flower == '1' || this.data.flower == '2') {
                color = 'RED';
            }
            this._num.texture = RES.getRes(color + this.data.num + '_png');
            this._bg.texture = RES.getRes('CARD' + this.data.flower + '_png');
        };
        Card.prototype.showBack = function () {
            this._num.visible = false;
            this._bg.texture = RES.getRes('CardBack_big_png');
        };
        return Card;
    }());
    pkcard.Card = Card;
    __reflect(Card.prototype, "pkcard.Card");
    var CardData = (function () {
        function CardData(f, n) {
            if (f === void 0) { f = ''; }
            if (n === void 0) { n = 0; }
            this.id = 0;
            /** 花色: ['0'->'3'] */
            this.flower = '';
            /** 字面: [0-12] */
            this.num = 1;
            this.flower = f;
            this.num = n;
            this.id = CardData.CRT_ID++;
        }
        CardData.CRT_ID = 1; // 当前的总id值，一直累加
        return CardData;
    }());
    pkcard.CardData = CardData;
    __reflect(CardData.prototype, "pkcard.CardData");
})(pkcard || (pkcard = {}));
//# sourceMappingURL=Card.js.map