module fg {
	export function getLpsProxy(): FightGridProxy {
		return FightGridProxy.inst;
	}
	export class FightGridProxy extends ssp.ModuleProxy {
		static _inst: FightGridProxy;
		static get inst(): FightGridProxy {
			if (FightGridProxy._inst == null) {
				FightGridProxy._inst = new FightGridProxy();
			}
			return FightGridProxy._inst;
		}

	}

	export class FightGridScreen extends ui.SspScreen {
		static NAME: string = 'FightGridScreen';

		protected _avatarLayer: fairygui.GComponent;
		protected _avatarLayerBounds: egret.Rectangle;
		protected _txt: fairygui.GTextField;

		protected _quadTree: utils.QuadTree;

		constructor() {
			super(FightGridScreen.NAME);
			this.fairyPkgName = 'fightgrid';
			this.fairyResName = 'FightBg';
			this.resGroup = ['fightgrid', 'enemies'];
		}

		protected _initCommonPack() {
			// 不需要加载common
		}

		protected _updateInterval: number = -1;
		startUpdate() {
			this._quadTree = new utils.QuadTree(0, new egret.Rectangle(0, 0, this.view.width, this.view.height));

			this._updateInterval = setInterval(() => {
				let list: utils.IHitArea[] = [];
				list = fg.avatar.layerAvatars[this._avatarLayer.id];
				if (list) {
					let len = list.length;
					
					this._txt.text = '数量：' + len;
					this._quadTree.clear();
					for (let i = 0; i < len; i++) {
						let isInViewport = utils.isInViewport(list[i], this._avatarLayerBounds);
						if (isInViewport) {
							let w = <fg.avatar.Warrior>list[i]
							if (w) w.update();
							this._quadTree.insert(list[i])
						}
					}

					list.forEach(obj => {
						let res = this._quadTree.retrieve(obj);
						res.forEach(tempObj => {
							// tempObj.action();
							if (obj !== tempObj) {
								let wobj = <fg.avatar.Warrior>obj;
								let wtempObj = <fg.avatar.Warrior>tempObj;
								let isHit = fg.avatar.isInAtkArea(wobj, wtempObj)
								// let isHit = utils.isHit(obj, tempObj);
								if (isHit) {
									// 碰撞物体做出操作
									if (wobj.getProxy().getCamp() != wtempObj.getProxy().getCamp()) {
										// wobj.action(wtempObj);
										// wtempObj.action(wobj);
										mvc.send(fg.avatar.ActionCmd.ATK, { atker: wobj, defer: wtempObj });
										mvc.send(fg.avatar.ActionCmd.ATK, { atker: wtempObj, defer: wobj });
									}
									// 修改深度
									if (wobj.y > wtempObj.y) {
										if (this._avatarLayer.getChildIndex(wobj) < this._avatarLayer.getChildIndex(wtempObj)) {
											this._avatarLayer.swapChildren(wobj, wtempObj);
										}
									} else {
										if (this._avatarLayer.getChildIndex(wobj) > this._avatarLayer.getChildIndex(wtempObj)) {
											this._avatarLayer.swapChildren(wobj, wtempObj);
										}
									}
								}
							}
						})
					})
				}
			}, 60)
		}

		onInit(): void {

			this.startUpdate();

			this._avatarLayer = new fairygui.GComponent();
			this.view.addChildAt(this._avatarLayer, 1);
			let vx = this.view.x;
			let vy = this.view.y;
			let vw = this.view.width;
			let vh = this.view.height;
			this._avatarLayerBounds = new egret.Rectangle(vx, vy, vw, vh);

			this._txt = this.view.getChild('txt').asTextField;
			this._txt.text=''

			this.view.addClickListener(this.onClickView, this);
			this.reset();
		}

		onClickView(e: egret.TouchEvent) {
			this.createAvatar2(e.stageX, e.stageY);

		}

		protected _crtIdx = 0;
		protected createAvatar2(x, y) {
			let cls = [fg.avatar.Brigand, fg.avatar.DarkKnight];
			let avatarCls = cls[this._crtIdx++ % 2];
			for (let i = 0; i < 16; i++){
				let b = new avatarCls();
				this._avatarLayer.addChild(b);
				b.setXY(x + (i % 4) * 40, y + Math.floor(i / 4) * 40);
			}
		}

		protected createAvatar(idx) {
			for (let i = 0; i < 16; i++){
				let b = new fg.avatar.Brigand();
				this._avatarLayer.addChild(b);
				b.setXY((idx % 10) * 110 + 100, Math.floor(idx / 10) * 100 + 100);
			}
		}

		protected getp(x, y): egret.Point {
			return new egret.Point(x, y);
		}

		reset(): void {
			this._avatarLayer.removeChildren();
		}

		protected _chkHit() {

		}

		onClick(target: fairygui.GObject): void {
		}

		dispose(): void {
			super.dispose();
			clearInterval(this._updateInterval)
		}
	}
}

