module fg.avatar {

	export var avatarPack: fairygui.UIPackage;

	export var layerAvatars: Object = {};// {layer: avatars} 存放碰撞需要的物体

	export enum DIR {
		UP = 0,
		RIGHT,
		DOWN,
		LEFT
	}

	export enum STATE {
		STAND = 0,
		DEAD,
		RUN,
		ATK,
		THRON,
		THRON_FREE
	}

	export class Avatar extends fairygui.GComponent implements utils.IHitArea {
		protected _fairyResName: string;
		protected _fairyPkgName: string;
		protected _dir: number = 1;// 方向 0:up 1:right 2:down 3:left
		protected _state: number = 0;// 状态 0:stand 1:dead 2:run 3:atk 
		protected _hitRect: egret.Rectangle;
		protected _hitArea: fairygui.GGraph;

		view: fairygui.GMovieClip;
		// hpBar
		public constructor() {
			super();
			this.initPackSetting();
			this.initPack();
			this.view = fairygui.UIPackage.createObject(this._fairyPkgName, this._fairyResName).asMovieClip;
			this.setViewPivot();
			this.addChild(this.view);
			this.standRight();
			this.setViewHitRect()
			this.hideHitArea();// 默认不显示碰撞区域
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		}
		private onAddToStage(event: egret.Event) {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFormStage, this);
			if (!layerAvatars[this.parent.id]) {
				layerAvatars[this.parent.id] = []
			}
			layerAvatars[this.parent.id].push(this);
			this.onAddToStageComplete();
		}
		private onRemoveFormStage(event: egret.Event) {
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFormStage, this);
			for (let key in layerAvatars) {
				let idx = layerAvatars[key].indexOf(this);
				if (idx > -1) {
					layerAvatars[key].splice(idx, 1);
				}
			}
			this.onremoveFromStageComplete();
		}
		protected onAddToStageComplete() { }
		protected onremoveFromStageComplete() { }
		protected setViewPivot() {
			this.view.setPivot(0.5, 0.8, true);
		}
		protected setViewHitRect() {
			this.setHitRect(new egret.Rectangle(0, 0, 20, 14))
		}

		protected createHitArea() {
			this._hitArea = new fairygui.GGraph()
			this._hitArea.graphics.beginFill(0xffffff, 0.4);
			this._hitArea.graphics.drawRect(0, 0, this._hitRect.width, this._hitRect.height);
			this._hitArea.graphics.endFill();
			this.addChildAt(this._hitArea, 0);
			this._hitArea.setXY(-this._hitRect.width / 2, -this._hitRect.height / 2)
		}
		showHitArea() {
			if (!this._hitArea) {
				this.createHitArea();
			}
			this._hitArea.visible = true;
		}
		hideHitArea() {
			if (this._hitArea) {
				this._hitArea.visible = false;
			}
		}
		protected initPackSetting() {
			this._fairyPkgName = 'enemies'
			this._fairyResName = ''
			console.warn('没有设置avatar的资源包和名字')
		}
		protected initPack() {
			if (avatarPack == null) {
				avatarPack = fairygui.UIPackage.addPackage(this._fairyPkgName);
			}
		}

		protected _playAction(start, end, stop, callback, dir: number = 1) {
			this.view.scaleX = dir;// 默认为1，反向为-1
			this.view.setPlaySettings(start, end, 1, stop, callback, this);
			this.view.playing = true;
		}
		runRight() {
			this._dir = DIR.RIGHT;
			this._state = STATE.RUN;
			this._playRun(1);
		}
		protected _playRun(dir) {
			this._playAction(0, 21, 21, () => {
				this._playRun(dir)
			}, dir)
		}
		runLeft() {
			this._dir = DIR.LEFT;
			this._state = STATE.RUN;
			this._playRun(-1);
		}
		runUp() {
			this._dir = DIR.UP;
			this._state = STATE.RUN;
			this._runUp();
		}
		protected _runUp() {
			this._playAction(22, 43, 43, this.runUp)
		}
		runDown() {
			this._dir = DIR.DOWN;
			this._state = STATE.RUN;
			this._runDown();
		}
		protected _runDown() {
			this._playAction(44, 65, 65, this.runDown)
		}
		standRight() {
			// this._runPath = []
			egret.Tween.removeTweens(this);
			this._state = STATE.STAND;
			this.view.scaleX = 1;
			this._standFrame();
			this.view.playing = false;
		}
		protected _standFrame() {
			this.view.frame = 66;
		}
		standLeft() {
			this.standRight();
			this.view.scaleX = -1;
		}
		atkRight(callback: Function = null) {
			// this._runPath = []
			egret.Tween.removeTweens(this);
			this._state = STATE.ATK;
			this._atk(1, callback);
		}
		protected _atk(dir, callback: Function = null) {
			this._playAction(66, 78, 66, callback, dir)
		}
		atkLeft(callback: Function = null) {
			// this._runPath = []
			egret.Tween.removeTweens(this);
			this._state = STATE.ATK;
			this._atk(-1, callback)
		}
		/**缠绕 */
		thron() {
			egret.Tween.removeTweens(this);
			this._state = STATE.THRON;
			this._thron();
		}
		protected _thron() {
			this._playAction(79, 97, 97, null)
		}
		/**缠绕解除 */
		thronFree() {
			egret.Tween.removeTweens(this);
			this._state = STATE.THRON_FREE;
			this._thronFree();
		}
		protected _thronFree() {
			this._playAction(98, 101, 101, null)
		}

		deadRight() {
			// this._runPath = []
			egret.Tween.removeTweens(this);
			this._state = STATE.DEAD;
			this._playDead(-1);
		}
		protected _playDead(dir) {
			this._playAction(102, 111, 111, null, dir)
		}
		deadLeft() {
			// this._runPath = []
			egret.Tween.removeTweens(this);
			this._state = STATE.DEAD;
			this._playDead(1);
		}

		dead() {
			egret.Tween.removeTweens(this);
			console.log('dead _dir', this._dir);
			if (this._dir == DIR.LEFT) {
				this.deadLeft()
			} else {
				this.deadRight();
			}
			console.log('dead', this._state);
			egret.setTimeout(() => {
				egret.Tween.get(this.view).to({ alpha: 0 }, 1000).call(() => {
					this.removeFromParent();
				})
			}, this, 1000)
		}

		// IHitArea
		setHitRect(rect: egret.Rectangle) {
			this._hitRect = rect;
		}
		getHitRect(): egret.Rectangle {
			this._hitRect.x = this.x - this._hitRect.width / 2;
			this._hitRect.y = this.y - this._hitRect.height / 2;
			return this._hitRect;
		}
	}

	export interface IAvatar {
		// run(path: any[]);

		deadRight();
		deadLeft();
		dead();

		atkLeft();
		atkRight();

		standRight();
		standLeft();

		runDown();
		runUp();
		runLeft();
		runRight();
	}

}