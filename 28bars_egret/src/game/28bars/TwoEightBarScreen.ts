module twoeightbar {
	export enum STATE {
		BET_TIME = 0,
		DEAL_CARD,
		OPEN_CARD,
		SETTLE,
		RESET
	}
	export function getTwoEightBarProxy(): TwoEightBarProxy {
		return TwoEightBarProxy.inst;
	}
	export class TwoEightBarProxy extends ssp.ModuleProxy {
		static _inst: TwoEightBarProxy;
		static get inst(): TwoEightBarProxy {
			if (TwoEightBarProxy._inst == null) {
				TwoEightBarProxy._inst = new TwoEightBarProxy();
			}
			return TwoEightBarProxy._inst;
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

		getPointStr(ps: string) {
			let bz = ["9,9", "8,8", "7,7", "6,6", "5,5", "4,4", "3,3", "2,2", "1,1"];
			let tg = '8,2';
			if (bz.indexOf(ps) >= 0) {
				return '豹子';
			}
			if (ps == tg) {
				return '天杠';
			}
			let pp = ps.split(',');
			let num = Math.floor(parseInt(pp[0]) + parseInt(pp[1])) % 10;
			return num + '点';
		}
	}

	export class TwoEightBarScreen extends ui.SspScreen {
		static NAME: string = 'TwoEightBarScreen';
		constructor() {
			super(TwoEightBarScreen.NAME);
			this.fairyPkgName = 'twoeightbar_pkg';
			this.fairyResName = 'Table';
			this.resGroup = ['teb'];// twoeightbar 的缩写
		}

		betChip0: fairygui.GButton;
		betChip1: fairygui.GButton;
		betChip2: fairygui.GButton;
		betChip3: fairygui.GButton;
		betChip4: fairygui.GButton;
		betRebuy: fairygui.GButton;

		mvLightLeft: fairygui.GMovieClip;
		mvLightMiddle: fairygui.GMovieClip;
		mvLightRight: fairygui.GMovieClip;

		betAreaLeft: fairygui.GComponent;
		betAreaMiddle: fairygui.GComponent;
		betAreaRight: fairygui.GComponent;

		mjViews: fairygui.GComponent[];
		mjViewXYs: egret.Point[];
		mjMvs: fairygui.GMovieClip[];
		mjMvXYs: egret.Point[];
		mjPoints: fairygui.GTextField[];

		players: fairygui.GComponent[];

		betTime: fairygui.GComponent;
		betTimeStamp: number;
		rewardPool: fairygui.GComponent;

		cards: mj.MjData[];

		betChips: BetChip[];
		mySelectedBet: number = 0;// 我选中的下注尺度

		myHead: fairygui.GComponent;

		crtState: number = 4;

		protected _initCommonPack() {
			// 不需要加载common
		}

		protected _updateInterval: number = -1;
		startUpdate() {
			this._updateInterval = egret.setInterval(this.onUpdate, this, 60);
		}

		onUpdate() {
			this.flushBetTime();
		}

		protected flushBetTime() {
			if (this.crtState == STATE.BET_TIME && this.betTime) {
				let crtTime = utils.getCrtTimeStamp();
				let dt = Math.floor((this.betTimeStamp - crtTime) / 1000);
				if (dt >= 0) {
					this.betTime.getChild('txt').text = '开始下注......' + dt + '秒'
					this.betTime.visible = true;
				} else {
					this.betTime.visible = false;
					this.setState(STATE.DEAL_CARD)
				}
			}
		}
		protected doBet(from: number, betNum: number, targetId: number = 0) {
			if (betNum > 0) {
				if (from >= 0 && from < 8) {
					// sit中玩家
				} else if (from == 8) {
					// mine
					this.flyBet(this.myHead.x + 20, this.myHead.y + 20, targetId)
				} else if (from >= 9) {
					// other
				}
			} else {
				// rebuy
			}
		}
		flyBet(x, y, targetId: number) {
			let tox, toy;
			if (targetId == 0) {
				//中
				tox = 170 + 210 * Math.random();
				toy = 330 + 150 * Math.random();
			}else if (targetId == 1) {
				//发
				tox = 460 + 350 * Math.random();
				toy = 410 + 150 * Math.random();
			}else if (targetId == 2) {
				//白
				tox = 870 + 210 * Math.random();
				toy = 330 + 150 * Math.random();
			}
			let chip = new BetChip();
			this.view.addChild(chip.view);
			this.betChips.push(chip);
			egret.Tween.get(chip.view)
				.set({ x: x, y: y, scaleX: 0.3, scaleY: 0.3 })
				.to({ x:tox, y:toy, scaleX:1, scaleY:1}, 300, egret.Ease.sineOut);
		}

		protected dealCard() {
			for (let i = 0; i < 8; i++) {
				let mjmv = this.mjMvs[i];
				let tox = this.mjMvXYs[i].x;
				let toy = this.mjMvXYs[i].y;
				setTimeout(() => {
					egret.Tween.get(mjmv).to({ width: 73, height: 106, x: tox, y: toy }, 200, egret.Ease.sineOut)
						.call(this.mjmvDealOver, this);
				}, 100 * i);
			}
		}
		protected _mjDealCnt = 0;
		mjmvDealOver() {
			this._mjDealCnt++;
			if (this._mjDealCnt >= this.mjMvs.length) {
				// over
				this.setState(STATE.OPEN_CARD);
			}
		}

		protected openCard() {
			for (var i = 0; i < 4; i++) {
				let idx = i;
				setTimeout(() => {
					this.openCardByIdx(idx);

				}, 400 * i);
			}
		}
		openCardByIdx(idx: number) {
			idx *= 2;
			var mv = this.mjMvs[idx];
			var mv2 = this.mjMvs[idx + 1];
			let mj = this.mjViews[idx];
			let mj2 = this.mjViews[idx + 1];
			let mjd = this.cards[idx];
			let mjd2 = this.cards[idx + 1];

			mv.setPlaySettings(0, -1, 1, 0, () => {
				mv.visible = false;
				mj.visible = true;
				let img = fairygui.UIPackage.createObject(this.fairyPkgName, "majiang_card_" + mjd.num).asImage
				mj.removeChildren()
				mj.addChild(img);
			})
			mv.playing = true;
			mv2.setPlaySettings(0, -1, 1, 0, () => {
				mv2.visible = false;
				mj2.visible = true;
				let img = fairygui.UIPackage.createObject(this.fairyPkgName, "majiang_card_" + mjd2.num).asImage
				mj2.removeChildren()
				mj2.addChild(img);
				setTimeout(() => {
					this.showPoint(idx);
				}, 200);
			})
			mv2.playing = true;
		}
		protected showPoint(idx) {
			let p = this.mjPoints[Math.floor(idx / 2)];
			let mjd = this.cards[idx];
			let mjd2 = this.cards[idx + 1];
			p.text = '' + getTwoEightBarProxy().getPointStr(mjd.num + ',' + mjd2.num);
			p.visible = true;
		}
		protected _pointOverCnt = 0;
		pointShowOver() {
			this._pointOverCnt++;
			if (this._pointOverCnt >= this.mjPoints.length) {
				// over
				this.setState(STATE.SETTLE);
			}
		}

		protected settle() {

		}

		setState(state) {
			this.crtState = state;
			switch (state) {
				case STATE.BET_TIME:

					break;
				case STATE.DEAL_CARD:
					this.dealCard();
					break;
				case STATE.OPEN_CARD:
					this.openCard();
					break;
				case STATE.SETTLE:
					this.settle();
					break;
				case STATE.RESET:
					this.reset();
					break;

				default:
					break;
			}
		}

		onInit(): void {

			let bg: fairygui.GImage = new fairygui.GImage();
			bg.texture = RES.getRes('majiang_desk_bg_png');
			bg.width = this.view.width;
			bg.height = this.view.height;
			this.view.addChildAt(bg, 0);
			let bg2: fairygui.GImage = new fairygui.GImage();
			bg2.texture = RES.getRes('majiang_bet_area_bg_png');
			bg2.x = this.view.width - bg2.texture.textureWidth >> 1;
			bg2.y = this.view.height - bg2.texture.textureHeight >> 1;
			this.view.addChildAt(bg2, 1);

			this.betChip0 = this.getChild('betBar.chip0').asButton;
			this.betChip1 = this.getChild('betBar.chip1').asButton;
			this.betChip2 = this.getChild('betBar.chip2').asButton;
			this.betChip3 = this.getChild('betBar.chip3').asButton;
			this.betChip4 = this.getChild('betBar.chip4').asButton;
			this.betRebuy = this.getChild('betBar.rebuy').asButton;

			this.mvLightLeft = this.getChild('lightLeft').asMovieClip;
			this.mvLightMiddle = this.getChild('lightMiddle').asMovieClip;
			this.mvLightRight = this.getChild('lightRight').asMovieClip;

			this.betAreaLeft = this.getChild('betAreaLeft').asCom;
			this.betAreaMiddle = this.getChild('betAreaMiddle').asCom;
			this.betAreaRight = this.getChild('betAreaRight').asCom;

			this.betTime = this.getChild('betTime').asCom;
			this.rewardPool = this.getChild('rewardPool').asCom;

			this.myHead = this.getChild('myHead').asCom;

			this.mjViewXYs = [];
			this.mjViews = [];
			for (let i = 0; i < 8; i++) {
				this.mjViews[i] = this.getChild('mj' + i).asCom;
				this.mjViewXYs[i] = new egret.Point(this.mjViews[i].x, this.mjViews[i].y)
			}

			this.mjMvXYs = [];
			this.mjMvs = [];
			for (let i = 0; i < 8; i++) {
				this.mjMvs[i] = this.getChild('mv' + i).asMovieClip;
				this.mjMvXYs[i] = new egret.Point(this.mjMvs[i].x, this.mjMvs[i].y)
			}

			this.mjPoints = [];
			for (let i = 0; i < 4; i++) {
				this.mjPoints[i] = this.getChild('point' + i).asTextField;
			}

			this.players = [];
			for (let i = 0; i < 8; i++) {
				this.players[i] = this.getChild('player' + i).asCom;
			}

			this.betChips = [];

			this.startUpdate();
			this.reset();
		}

		reset(): void {
			getTwoEightBarProxy().initPaiku()
			this.cards = getTwoEightBarProxy().paiku;

			for (let i = 0; i < 8; i++) {
				let mjview = this.mjViews[i];
				mjview.x = this.mjViewXYs[i].x;
				mjview.y = this.mjViewXYs[i].y;
				mjview.visible = false;
			}

			for (let i = 0; i < 8; i++) {
				let mjmv = this.mjMvs[i];
				mjmv.width = 36;
				mjmv.height = 53;
				mjmv.visible = true;
				mjmv.x = 574 + Math.floor(i / 2) * 31;
				mjmv.y = 258 + (i % 2) * 12;
			}

			for (let i = 0; i < 4; i++) {
				this.mjPoints[i].visible = false;
			}

			this.mvLightLeft.visible = false;
			this.mvLightMiddle.visible = false;
			this.mvLightRight.visible = false;

			this.rewardPool.getChild('txt').text = '0';

			for (let i = 0; i < this.betChips.length; i++) {
				var element = this.betChips[i];
				element.view.removeFromParent();
			}
			this.betChips = [];

			this.start()
		}

		start(): void {
			this.betTimeStamp = utils.getCrtTimeStamp() + 1000 * 3;
			this.setState(STATE.BET_TIME)
		}

		onClick(target: fairygui.GObject): void {
			switch (target) {
				case this.betChip0:
					this.mySelectedBet = 0;
					break;
				case this.betChip1:
					this.mySelectedBet = 1;
					break;
				case this.betChip2:
					this.mySelectedBet = 2;
					break;
				case this.betChip3:
					this.mySelectedBet = 3;
					break;
				case this.betChip4:
					this.mySelectedBet = 4;
					break;
				case this.betRebuy:
					this.doBet(8, -1);
					break;
				case this.betAreaLeft:
					this.doBet(8, this.mySelectedBet + 1, 0);
					break;
				case this.betAreaMiddle:
					this.doBet(8, this.mySelectedBet + 1, 1);
					break;
				case this.betAreaRight:
					this.doBet(8, this.mySelectedBet + 1, 2);
					break;
			}
		}
	}
}