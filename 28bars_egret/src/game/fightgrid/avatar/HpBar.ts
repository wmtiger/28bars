module fg.avatar {
	export class HpBar extends fairygui.GComponent{
		protected _barbg: fairygui.GGraph;
		protected _bar: fairygui.GGraph;

		protected _maxWid = 30;
		protected _hei = 2;
		protected _maxHp = 100;
		protected _crtHp = 100;

		public constructor(maxHp:number, maxWid:number = 30) {
			super();
			this._maxWid = maxWid;
			this._barbg = new fairygui.GGraph();
			this._barbg.graphics.beginFill(0xff0000);
			this._barbg.graphics.drawRect(0, 0, this._maxWid, this._hei);
			this._barbg.graphics.endFill();
			this.addChild(this._barbg)
			
			this._bar = new fairygui.GGraph();
			this._bar.graphics.beginFill(0x00ff00);
			this._bar.graphics.drawRect(0, 0, this._maxWid, this._hei);
			this._bar.graphics.endFill();
			this.addChild(this._bar)

			this.initMaxHp(maxHp);
		}

		initMaxHp(v:number) {
			this.setMaxHp(v);
			this._crtHp = v;
		}

		setMaxWid(v:number) {
			this._maxWid = v;
			this._barbg.graphics.clear()
			this._barbg.graphics.beginFill(0xff0000);
			this._barbg.graphics.drawRect(0, 0, this._maxWid, this._hei);
			this._barbg.graphics.endFill();
			this.setHp(this._crtHp);
		}

		getMaxWid() {
			return this._maxWid;
		}

		setMaxHp(v:number) {
			this._maxHp = v
		}

		setHp(v:number) {
			this._crtHp = v;

			let bwidth = this._maxWid * (this._crtHp / this._maxHp);
			this._bar.graphics.clear()
			this._bar.graphics.beginFill(0x00ff00);
			this._bar.graphics.drawRect(0, 0, bwidth, this._hei);
			this._bar.graphics.endFill();
		}
	}
}