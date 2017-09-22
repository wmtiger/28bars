module pkcard {
	export class Card {
		private _view: fairygui.GComponent;

		private _data: CardData;

		private _bg: fairygui.GImage;
		private _num: fairygui.GImage;

		public constructor() {
			this.view = fairygui.UIPackage.createObject("luckypksize", "CardFace").asCom
			this._bg = new fairygui.GImage()
			this.view.addChild(this._bg);
			this._num = new fairygui.GImage()
			this.view.addChild(this._num);
			this._num.setXY(8, 8)
		}

		get data(): CardData {
			return this._data;
		}

		set data(d: CardData) {
			this._data = d;
		}

		get view(): fairygui.GComponent {
			return this._view;
		}

		set view(v: fairygui.GComponent) {
			this._view = v;
		}

		showFace() {
			this._num.visible = true;
			let color = 'BLACK'
			if (this.data.flower == '1' || this.data.flower == '2') {
				color = 'RED'
			}
			this._num.texture = RES.getRes(color + this.data.num + '_png');
			this._bg.texture = RES.getRes('CARD' + this.data.flower + '_png');

		}
		showBack() {
			this._num.visible = false;
			this._bg.texture = RES.getRes('CardBack_big_png');
		}
	}

	export class CardData {

		static CRT_ID: number = 1;// 当前的总id值，一直累加

		id: number = 0;
		/** 花色: ['0'->'3'] */
		flower: string = '';
		/** 字面: [0-12] */
		num: number = 1;

		public constructor(f: string = '', n: number = 0) {
			this.flower = f;
			this.num = n;
			this.id = CardData.CRT_ID++;
		}
	}

	export interface ICard {
		data: CardData;

		view: fairygui.GComponent;

		showFace();
		showBack();

	}
}