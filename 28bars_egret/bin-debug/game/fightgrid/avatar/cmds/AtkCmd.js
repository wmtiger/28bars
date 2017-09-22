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
        var ActionCmd = (function (_super) {
            __extends(ActionCmd, _super);
            function ActionCmd() {
                return _super.call(this) || this;
            }
            ActionCmd.prototype.execute = function (notification) {
                var name = notification.getName();
                var body = notification.getBody();
                switch (name) {
                    case ActionCmd.RUN:
                        this.sendNotification(avatar.Warrior.WARRIOR_RUN, body);
                        break;
                    case ActionCmd.ATK:
                        var atker_1 = body.atker;
                        var defer_1 = body.defer;
                        if (atker_1.getAtkCd() <= 0) {
                            if (defer_1.getProxy().getHp() > 0) {
                                setTimeout(function () {
                                    defer_1.getProxy().addHp(-atker_1.getProxy().getAtk());
                                    mvc.send(avatar.Warrior.WARRIOR_HURT, { target: defer_1 });
                                }, 200);
                                mvc.send(avatar.Warrior.WARRIOR_ATK, { target: atker_1 });
                            }
                        }
                        // this.sendNotification(Warrior.WARRIOR_ATK, body)
                        break;
                    case ActionCmd.DEAD:
                        var target = body.target;
                        mvc.send(avatar.Warrior.WARRIOR_DEAD, target.getProxy().getId());
                        break;
                    default:
                        break;
                }
            };
            ActionCmd.RUN = 'RUN';
            ActionCmd.ATK = 'ATK';
            ActionCmd.DEAD = 'DEAD';
            return ActionCmd;
        }(puremvc.SimpleCommand));
        avatar.ActionCmd = ActionCmd;
        __reflect(ActionCmd.prototype, "fg.avatar.ActionCmd");
    })(avatar = fg.avatar || (fg.avatar = {}));
})(fg || (fg = {}));
//# sourceMappingURL=AtkCmd.js.map