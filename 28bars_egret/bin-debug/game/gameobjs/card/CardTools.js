var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var pkcard;
(function (pkcard) {
    /** 获取随机52张牌 */
    function getRandomDatas() {
        var list = [];
        for (var i = 0; i < 52; i++) {
            var cd = void 0;
            if (i < 13) {
                cd = new pkcard.CardData('2', i);
            }
            else if (i < 26) {
                cd = new pkcard.CardData('3', i % 13);
            }
            else if (i < 39) {
                cd = new pkcard.CardData('1', i % 13);
            }
            else if (i < 52) {
                cd = new pkcard.CardData('0', i % 13);
            }
            list.push(cd);
        }
        utils.upsetArray(list);
        return list;
    }
    pkcard.getRandomDatas = getRandomDatas;
    function getPointByCardNum(c) {
        var p = 1;
        if (c.num < 9) {
            p = c.num + 2;
        }
        else if (c.num >= 9 && c.num < 12) {
            p = 0.5;
        }
        else {
            p = 1;
        }
        return p;
    }
    pkcard.getPointByCardNum = getPointByCardNum;
    var CardTools = (function () {
        function CardTools() {
        }
        return CardTools;
    }());
    pkcard.CardTools = CardTools;
    __reflect(CardTools.prototype, "pkcard.CardTools");
})(pkcard || (pkcard = {}));
//# sourceMappingURL=CardTools.js.map