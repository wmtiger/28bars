module mj {
	export class MjTile implements mj.IMjTile {

		private _view: fairygui.GComponent;

		private _mjdata: mj.MjData;

		public constructor() {
		}

		get mjdata(): mj.MjData {
			return this._mjdata;
		}

		set mjdata(d: mj.MjData) {
			this._mjdata = d;
		}

		get view(): fairygui.GComponent {
			return this._view;
		}

		set view(v: fairygui.GComponent) {
			this._view = v;
		}

		flushTile() {

		}

	}

	export class MjData {

		static WAN: number = 1;
		static TIAO: number = 2;
		static TONG: number = 4;
		static ZI: number = 8;
		static HUA: number = 16;

		static CRT_ID: number = 1;// 当前的总id值，一直累加

		id: number = 0;
		/** 花色: [''->'4'] */
		flower: string = '';
		/** 字面: [1-9] */
		num: number = 1;
		/** 已经被执行的操作 0无 1吃 2碰 3杠/ 4胡 */
		action: number = 0;

		public constructor(f: string = '', n: number = 0, m: number = 0) {
			this.flower = f;
			this.num = n;
			this.action = m;
			this.id = MjData.CRT_ID++;
		}
	}

	export interface IMjTile {
		mjdata: mj.MjData;

		view: fairygui.GComponent;

		flushTile();

	}
}