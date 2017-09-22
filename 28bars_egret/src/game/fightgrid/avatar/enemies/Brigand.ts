module fg.avatar {
	export class Brigand extends Warrior {
		public constructor() {
			super();
			this._dbproxy.setCamp(CAMP.BRIGAND)
		}
		protected initPackSetting() {
			this._fairyPkgName = 'enemies'
			this._fairyResName = 'brigand'
		}
		protected setViewPivot() {
			this.view.setPivot(0.6, 0.8, true);
		}
		getInitMediatorName() {
			return 'Brigand_' + this._dbproxy.getId();
			// egret.setTimeout()
		}
	}
}