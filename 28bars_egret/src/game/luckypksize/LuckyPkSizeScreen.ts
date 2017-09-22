module lps {
	export function getLpsProxy(): LuckyPkSizeProxy {
		return LuckyPkSizeProxy.inst;
	}
	export class LuckyPkSizeProxy extends ssp.ModuleProxy {
		static _inst: LuckyPkSizeProxy;
		static get inst(): LuckyPkSizeProxy {
			if (LuckyPkSizeProxy._inst == null) {
				LuckyPkSizeProxy._inst = new LuckyPkSizeProxy();
			}
			return LuckyPkSizeProxy._inst;
		}

		cards: pkcard.CardData[] = [];

		createCards() {
			this.cards = pkcard.getRandomDatas();
		}
	}

	export class LuckyPkSizeScreen extends ui.SspScreen {
		static NAME: string = 'LuckyPkSizeScreen';
		constructor() {
			super(LuckyPkSizeScreen.NAME);
			this.fairyPkgName = 'luckypksize';
			this.fairyResName = 'Table';
			this.resGroup = ['luckypksize'];
		}

		contCards: fairygui.GComponent;
		contMyCards: fairygui.GComponent;
		allCards: pkcard.Card[];
		myCards: pkcard.Card[];

		btnYaopai: fairygui.GButton;
		btnReward: fairygui.GButton;
		btnStart: fairygui.GButton;

		txtPoint: fairygui.GTextField;
		imgLose: fairygui.GImage;
		imgWin: fairygui.GImage;


		onInit(): void {
			let bg: fairygui.GImage = new fairygui.GImage();
			bg.texture = RES.getRes('bg_png');
			bg.width = this.view.width;
			bg.height = this.view.height;
			this.view.addChildAt(bg, 0);
			this.contCards = this.getChild('contCard').asCom;
			this.contMyCards = this.getChild('contSelected').asCom;

			this.btnYaopai = this.getChild('btnYaopai').asButton;
			this.btnReward = this.getChild('btnReward').asButton;
			this.btnStart = this.getChild('btnStart').asButton;

			this.txtPoint = this.getChild('txtPoint').asTextField;
			this.imgLose = this.getChild('imgLose').asImage;
			this.imgWin = this.getChild('imgWin').asImage;

			this.reset();
		}

		reset(): void {
			this.btnYaopai.visible = false;
			this.btnReward.visible = false;
			this.imgLose.visible = false;
			this.imgWin.visible = false;
			this.btnStart.visible = true;
			// 初始化牌库
			lps.getLpsProxy().createCards();
			this.allCards = [];
			this.myCards = [];
			this.clearAllContent();
			this.txtPoint.text = ''
		}

		start(): void {
			this.btnStart.visible = false;
			this.dealCard();

		}

		dealCard() {
			if (lps.getLpsProxy().cards.length <= 0) {
				console.log('deal over');
				this.btnYaopai.visible = true;
				this.btnReward.visible = true;
				return;
			}
			let c = new pkcard.Card();
			c.data = lps.getLpsProxy().cards.pop();
			c.showBack();
			this.allCards.push(c);
			this.contCards.addChild(c.view);
			c.view.setXY((this.contCards.numChildren - 1) % 26 * 30, Math.floor((this.contCards.numChildren - 1) / 26) * 120)
			setTimeout(() => {
				this.dealCard()
			}, 10);
		}

		yaopai() {
			if (this.myCards.length >= 4) {
				return;
			}
			let c = this.allCards.pop();

			this.myCards.push(c);
			this.contMyCards.addChild(c.view)
			c.view.setXY((this.contMyCards.numChildren - 1) * 90, 0);
			c.showFace();

			this.chkResult();
		}

		reward() {
			this.reset();
		}

		chkResult() {
			let p = 0;
			for (var i = 0; i < this.myCards.length; i++) {
				var element = this.myCards[i];
				p += pkcard.getPointByCardNum(element.data);
			}
			this.txtPoint.text = p + '点'

			if (p > 10.5) {
				this.imgLose.visible = true;
				this.btnYaopai.visible = false;
				this.btnReward.visible = false;
				setTimeout(() => {
					this.reset();
				}, 1000);

				this.txtPoint.text = p + '点, 爆掉啦'
			}
		}


		clearAllContent() {
			this.contCards.removeChildren();
			this.contMyCards.removeChildren();
		}

		onClick(target: fairygui.GObject): void {
			switch (target) {
				case this.btnStart:
					console.log('start');
					this.start();
					break;
				case this.btnYaopai:
					console.log('yaopai');
					this.yaopai();
					break;
				case this.btnReward:
					console.log('reward');
					this.reward();
					break;
			}
		}

	}
}

