module fg.avatar {
	export class DesertScorpion extends Warrior {
		public constructor() {
			super();
			this._dbproxy.setCamp(CAMP.DESERT)
			this._dbproxy.setAtkCd(2000);
			this._dbproxy.setAtk(13);
		}
		protected initPackSetting() {
			this._fairyPkgName = 'enemies'
			this._fairyResName = 'scorpion'
		}
		getInitMediatorName() {
			return 'DesertScorpion_' + this._dbproxy.getId();
		}
	}
}