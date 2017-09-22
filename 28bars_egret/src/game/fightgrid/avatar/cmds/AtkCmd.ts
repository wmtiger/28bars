module fg.avatar {
	export class ActionCmd extends puremvc.SimpleCommand {

		static RUN: string = 'RUN';
		static ATK: string = 'ATK';
		static DEAD: string = 'DEAD';

		public constructor() {
			super();
		}

		execute(notification: puremvc.INotification) {
			let name = notification.getName();
			let body = notification.getBody();

			switch (name) {
				case ActionCmd.RUN:
					this.sendNotification(Warrior.WARRIOR_RUN, body)
					break;
				case ActionCmd.ATK:
					let atker: Warrior = body.atker;
					let defer: Warrior = body.defer;
					if (atker.getAtkCd() <= 0) {
						if (defer.getProxy().getHp() > 0) {
							setTimeout(() => {
								defer.getProxy().addHp(-atker.getProxy().getAtk());
								mvc.send(Warrior.WARRIOR_HURT, { target: defer });
							}, 200);
							mvc.send(Warrior.WARRIOR_ATK, { target: atker });
						}
					}
					// this.sendNotification(Warrior.WARRIOR_ATK, body)
					break;
				case ActionCmd.DEAD:
					let target: Warrior = body.target;
					mvc.send(Warrior.WARRIOR_DEAD, target.getProxy().getId());
					break;

				default:
					break;
			}
		}
	}
}