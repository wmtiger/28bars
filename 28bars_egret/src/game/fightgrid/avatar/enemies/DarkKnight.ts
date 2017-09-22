module fg.avatar {
	export class DarkKnight extends Warrior{
		public constructor() {
			super();
			this._dbproxy.setCamp(CAMP.DARK_KNIGHT)
		}
		protected initPackSetting() {
			this._fairyPkgName = 'enemies'
			this._fairyResName = 'DarkKnight'
		}

		getInitMediatorName() {
			return 'DarkKnight_' + this._dbproxy.getId();
		}

		initProxy() {
			this._dbproxy = new WarriorDataProxy();
			this._dbproxy.init();
			this._dbproxy.setHp(200);
			this._dbproxy.setMaxHp(200);
			this._dbproxy.setAtk(10);
			this._dbproxy.setAtkCd(2000);
		}

		protected _atk(dir, callback:Function = null) {
			this._playAction(66, 77, 66, callback, dir)
		}

		protected _thron() {
			this._playAction(78, 96, 96, null)
		}
		protected _thronFree() {
			this._playAction(97, 101, 101, null)
		}
		protected _playDead(dir) {
			this._playAction(102, 109, 109, null, dir)
		}
	}
}