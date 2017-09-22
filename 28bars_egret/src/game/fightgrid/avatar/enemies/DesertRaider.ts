module fg.avatar {
	export class DesertRaider extends Warrior {
		public constructor() {
			super();
			this._dbproxy.setCamp(CAMP.DESERT)
		}
		protected initPackSetting() {
			this._fairyPkgName = 'enemies'
			this._fairyResName = 'desertRaider'
		}
		getInitMediatorName() {
			return 'DesertRaider_' + this._dbproxy.getId();
		}

	}
}