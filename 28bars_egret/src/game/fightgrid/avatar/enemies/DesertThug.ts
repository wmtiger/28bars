module fg.avatar {
	export class DesertThug extends Warrior {
		public constructor() {
			super();
			this._dbproxy.setCamp(CAMP.DESERT)
		}
		protected initPackSetting() {
			this._fairyPkgName = 'enemies'
			this._fairyResName = 'desertThug'
		}
		getInitMediatorName() {
			return 'DesertThug_' + this._dbproxy.getId();
		}

	}
}