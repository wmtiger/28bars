module fg.avatar {
	export class Atk {
		protected _atker: Warrior;
		protected _defer: Warrior;

		public constructor(atker: Warrior, defer: Warrior) {
			this._atker = atker;
			this._defer = defer;
		}
	}
}