module fg.avatar {
	export class DesertArcher extends Warrior {
		public constructor() {
			super();
			this._dbproxy.setCamp(CAMP.DESERT)
		}
		protected initPackSetting() {
			this._fairyPkgName = 'enemies'
			this._fairyResName = 'desertArcher'
		}
		getInitMediatorName() {
			return 'DesertArcher_' + this._dbproxy.getId();
		}

	}
}