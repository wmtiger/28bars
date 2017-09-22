module tuitong {
	export function getTuitongProxy(): TuitongProxy {
		return TuitongProxy.inst;
	}
	export class TuitongProxy extends ssp.ModuleProxy {
		static _inst: TuitongProxy;
		static get inst(): TuitongProxy {
			if (TuitongProxy._inst == null) {
				TuitongProxy._inst = new TuitongProxy();
			}
			return TuitongProxy._inst;
		}

		paiku: mj.MjData[] = [];
		bipaiList = ["9,9", "8,8", "7,7", "6,6", "5,5", "4,4", "3,3", "2,2", "1,1",
			"8,2", "8,1", "7,2", "6,3", "5,4", "7,1", "6,2", "5,3", "9,8", "6,1", "5,2", "4,3",
			"9,7", "5,1", "4,2", "9,6", "8,7", "4,1", "3,2", "9,5", "8,6", "3,1", "9,4", "8,5", "7,6", "2,1",
			"9,3", "8,4", "7,5", "9,2", "8,3", "7,4", "6,5", "9,1", "7,3", "6,4"];

		initPaiku() {
			this.paiku = mj.getRandomMjs(mj.MjData.TONG);
		}

		getBipaiIdx(nums: string) {
			return this.bipaiList.indexOf(nums);
		}
	}
}


module ui {
	export class TuitongScreen extends SspScreen {
		static NAME: string = 'TuitongScreen';
		constructor() {
			super(TuitongScreen.NAME);
			this.fairyPkgName = 'tuitong';
			this.fairyResName = 'Table';
			this.resGroup = ['tuitong'];
		}

		contLeft: fairygui.GComponent;
		contUp: fairygui.GComponent;
		contRight: fairygui.GComponent;
		contDown: fairygui.GComponent;
		contents: fairygui.GComponent[];
		mjs: mj.MjTile_Up[];

		btnReady: fairygui.GButton;
		imgWin: fairygui.GImage;
		winPos: number[][] = [[493, 140], [770, 254], [493, 370], [220, 254]];

		onInit(): void {
			let bg: fairygui.GImage = new fairygui.GImage();
			bg.texture = RES.getRes('loadingbg_jpg');
			bg.width = this.view.width;
			bg.height = this.view.height;
			this.view.addChildAt(bg, 0);
			this.contLeft = this.getChild('contLeft').asCom;
			this.contUp = this.getChild('contUp').asCom;
			this.contRight = this.getChild('contRight').asCom;
			this.contDown = this.getChild('contDown').asCom;
			this.contents = [this.contUp, this.contRight, this.contDown, this.contLeft];

			this.btnReady = this.getChild('btnReady').asButton;
			this.imgWin = this.getChild('imgWin').asImage;
			this.imgWin.visible = false;

			this.reset();
		}

		reset(): void {
			this.btnReady.visible = true;
			// 初始化牌库
			tuitong.getTuitongProxy().initPaiku();
			this.mjs = [];
		}

		start(): void {
			this.imgWin.visible = false;
			this.clearAllContent();
			this.btnReady.visible = false;
			// 随机发牌，每人两张
			this.initMjShow();
			this.initMjShow();

			setTimeout(() => {
				this.chkResult();
				this.reset();
			}, 500);

		}

		chkResult() {
			let upIdx = tuitong.getTuitongProxy().getBipaiIdx(this.getContentDatas(this.contUp));
			let rightIdx = tuitong.getTuitongProxy().getBipaiIdx(this.getContentDatas(this.contRight));
			let downIdx = tuitong.getTuitongProxy().getBipaiIdx(this.getContentDatas(this.contDown));
			let leftIdx = tuitong.getTuitongProxy().getBipaiIdx(this.getContentDatas(this.contLeft));
			let temp = [{ pos: 0, idx: upIdx }, { pos: 1, idx: rightIdx }, { pos: 2, idx: downIdx }, { pos: 3, idx: leftIdx }];
			temp.sort((a, b) => a.idx - b.idx);
			let winidx = temp[0].pos;
			let p = this.winPos[winidx];
			this.imgWin.setXY(p[0], p[1]);
			this.imgWin.visible = true;
		}

		getContentDatas(cont: fairygui.GComponent) {
			let m = this.getMjByView(cont.getChildAt(0).asCom);
			let m2 = this.getMjByView(cont.getChildAt(1).asCom);
			if (m.mjdata.num > m2.mjdata.num) {
				return m.mjdata.num + ',' + m2.mjdata.num;
			}
			return m2.mjdata.num + ',' + m.mjdata.num;
		}

		getMjByView(v: fairygui.GComponent) {
			for (var i = 0; i < this.mjs.length; i++) {
				var element = this.mjs[i];
				if (element.view === v) {
					return element;
				}
			}
			return null;
		}

		clearAllContent() {
			for (var i = 0; i < this.contents.length; i++) {
				var element = this.contents[i];
				element.removeChildren();
			}
		}

		initMjShow() {
			for (var i = 0; i < this.contents.length; i++) {
				var element = this.contents[i];
				let mjdata = tuitong.getTuitongProxy().paiku.pop();
				let mjup = new mj.MjTile_Up();
				mjup.mjdata = mjdata;
				this.mjs.push(mjup);
				mjup.flushTile();
				element.addChild(mjup.view);
				mjup.view.x = element.numChildren * 38;
			}
		}

		onClick(target: fairygui.GObject): void {
			switch (target) {
				case this.btnReady:
					console.log('start');
					this.start();
					break;
			}
		}

	}
}

