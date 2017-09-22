var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fg;
(function (fg) {
    var avatar;
    (function (avatar) {
        var CAMP;
        (function (CAMP) {
            CAMP[CAMP["NPC"] = 0] = "NPC";
            CAMP[CAMP["DESERT"] = 1] = "DESERT";
            CAMP[CAMP["BRIGAND"] = 2] = "BRIGAND";
            CAMP[CAMP["DARK_KNIGHT"] = 3] = "DARK_KNIGHT";
            CAMP[CAMP["ARMY"] = 4] = "ARMY";
        })(CAMP = avatar.CAMP || (avatar.CAMP = {}));
        /**是否进入了攻击范围 */
        function isInAtkArea(obj1, obj2) {
            var dis = utils.getDistance({ x: obj1.x, y: obj1.y }, { x: obj2.x, y: obj2.y });
            if (dis <= obj1.getProxy().getAtkArea()) {
                return true;
            }
            return false;
        }
        avatar.isInAtkArea = isInAtkArea;
        /**
         * WarriorData
         */
        var WarriorData = (function () {
            function WarriorData() {
                this.id = 1;
                this.speed = 1;
                this.hp = 100;
                this.maxHp = 100;
                this.atk = 6;
                this.atkCd = 1000;
                this.atkArea = 40;
                this.camp = 0;
                this.id = WarriorData.CRT_ID++;
            }
            WarriorData.CRT_ID = 1; // 当前的总id值，一直累加
            return WarriorData;
        }());
        avatar.WarriorData = WarriorData;
        __reflect(WarriorData.prototype, "fg.avatar.WarriorData");
        /**
         * WarriorDataProxy
         */
        var WarriorDataProxy = (function () {
            function WarriorDataProxy() {
            }
            WarriorDataProxy.prototype.init = function () {
                this._data = new WarriorData();
            };
            WarriorDataProxy.prototype.getId = function () {
                return this._data.id;
            };
            WarriorDataProxy.prototype.setSpeed = function (spd) {
                this._data.speed = spd;
            };
            WarriorDataProxy.prototype.getSpeed = function () {
                return this._data.speed;
            };
            WarriorDataProxy.prototype.setHp = function (hp) {
                this._data.hp = hp;
                if (hp <= 0) {
                    this._data.hp = 0;
                    // this.sendNotification('WARRIOR_DEAD', this.getId())
                    mvc.send(avatar.Warrior.WARRIOR_DEAD, this.getId());
                }
            };
            WarriorDataProxy.prototype.getHp = function () {
                return this._data.hp;
            };
            WarriorDataProxy.prototype.addHp = function (dhp) {
                this.setHp(this._data.hp + dhp);
            };
            WarriorDataProxy.prototype.setMaxHp = function (v) {
                this._data.maxHp = v;
            };
            WarriorDataProxy.prototype.getMaxHp = function () {
                return this._data.maxHp;
            };
            WarriorDataProxy.prototype.setAtk = function (atk) {
                this._data.atk = atk;
            };
            WarriorDataProxy.prototype.getAtk = function () {
                return this._data.atk;
            };
            WarriorDataProxy.prototype.addAtk = function (datk) {
                this.setAtk(this._data.atk + datk);
            };
            WarriorDataProxy.prototype.setAtkArea = function (v) {
                this._data.atkArea = v;
            };
            WarriorDataProxy.prototype.getAtkArea = function () {
                return this._data.atkArea;
            };
            WarriorDataProxy.prototype.setCamp = function (c) {
                this._data.camp = c;
            };
            WarriorDataProxy.prototype.getCamp = function () {
                return this._data.camp;
            };
            WarriorDataProxy.prototype.setAtkCd = function (cd) {
                this._data.atkCd = cd;
            };
            WarriorDataProxy.prototype.getAtkCd = function () {
                return this._data.atkCd;
            };
            return WarriorDataProxy;
        }());
        avatar.WarriorDataProxy = WarriorDataProxy;
        __reflect(WarriorDataProxy.prototype, "fg.avatar.WarriorDataProxy");
    })(avatar = fg.avatar || (fg.avatar = {}));
})(fg || (fg = {}));
//# sourceMappingURL=WarriorDataProxy.js.map