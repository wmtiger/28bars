module fg.avatar {
	export class Warrior extends Avatar implements puremvc.IMediator {
		static WARRIOR_DEAD: string = "WARRIOR_DEAD"
		static WARRIOR_HURT: string = "WARRIOR_HURT"
		static WARRIOR_RUN: string = "WARRIOR_RUN"
		static WARRIOR_ATK: string = "WARRIOR_ATK"

		protected _dbproxy: WarriorDataProxy;
		protected _mediator: puremvc.Mediator;

		protected _hpBar: HpBar;
		protected _atkCd: number = 0;

		target: Warrior;// 目标

		public constructor() {
			super();

			this.initProxy();
			// this.showHitArea();
			this.initHpBar();
		}
		protected setViewHitRect() {
			this.setHitRect(new egret.Rectangle(0, 0, 24, 20))
		}

		// ----mediator start
		initMvc() {
			this._mediator = new puremvc.Mediator(this.getInitMediatorName(), this);
			puremvc.Facade.getInstance().registerMediator(this);

			puremvc.Facade.getInstance().registerCommand(ActionCmd.ATK, ActionCmd);
			puremvc.Facade.getInstance().registerCommand(ActionCmd.RUN, ActionCmd);
			puremvc.Facade.getInstance().registerCommand(ActionCmd.DEAD, ActionCmd);

		}
		clearMvc() {
			puremvc.Facade.getInstance().removeMediator(this.getInitMediatorName());

			puremvc.Facade.getInstance().removeCommand(ActionCmd.ATK)
			puremvc.Facade.getInstance().removeCommand(ActionCmd.RUN)
			puremvc.Facade.getInstance().removeCommand(ActionCmd.DEAD)
		}
		getInitMediatorName() {
			return '';
		}
		getMediatorName(): string {
			return this._mediator.getMediatorName();
		}
		getViewComponent(): any {
			return this._mediator.getViewComponent();
		}
		setViewComponent(viewComponent: any): void {
			this._mediator.setViewComponent(viewComponent);
		}
		listNotificationInterests(): string[] {
			// return this._mediator.listNotificationInterests();
			return [Warrior.WARRIOR_DEAD, Warrior.WARRIOR_HURT, Warrior.WARRIOR_RUN, Warrior.WARRIOR_ATK];
		}
		handleNotification(notification: puremvc.INotification): void {
			// this._mediator.handleNotification(notification);
			let name = notification.getName();
			let body = notification.getBody();

			switch (name) {
				case Warrior.WARRIOR_DEAD:
					if (body === this.getProxy().getId()) {
						this.dead();
					}
					break;
				case Warrior.WARRIOR_HURT:
					if (body.target === this) {
						this._hpBar.setHp(this.getProxy().getHp())
					}
					break;
				case Warrior.WARRIOR_ATK:
					if (body.target === this) {
						this.atk();
					}
					break;

				default:
					break;
			}
		}
		onRegister(): void {
			this._mediator.onRegister();
		}
		onRemove(): void {
			this._mediator.onRemove();
		}
		sendNotification(name: string, body?: any, type?: string): void {
			this._mediator.sendNotification(name, body, type);
		}
		// ---- mediator end

		initHpBar() {
			this._hpBar = new HpBar(this._dbproxy.getHp(), 20);
			this.addChild(this._hpBar)
			this._hpBar.setXY(-this._hpBar.getMaxWid() / 2, -26);
		}

		initProxy() {
			this._dbproxy = new WarriorDataProxy();
			this._dbproxy.init();
		}
		getProxy() {
			return this._dbproxy;
		}
		get proxy() {
			return this._dbproxy;
		}
		getAtkCd(): number{
			return this._atkCd;
		}

		update() {
			if (this.getProxy().getHp() <= 0) return;
			if (!this.target) {
				this.target = this.searchEnemies();
				if (this.target) {
					this.run([{ x: this.target.x, y: this.target.y }]);
				} else {
					this._stopRun();
				}
			} else {
				if (this.target.getProxy().getHp() <= 0) {
					this.target = null;
					// this.update();
				} else {
					
				}
			}

			if (this._atkCd > 0) {
				this._atkCd -= 60;
			} else {
				this._atkCd = 0;
			}
		}

		// protected _updateInterval:number = -1;
		protected onAddToStageComplete() {
			this.initMvc();
			// this._updateInterval = setInterval(()=>{

			// }, 60)
		}
		protected onremoveFromStageComplete() {
			// clearInterval(this._updateInterval)
			this.clearMvc();

		}

		protected _runEndCallback: Function;
		protected _runCallbackObj: any;
		protected _runPath: any[];
		/** 给定路径的移动 */
		run(path: any[], endCallback?: Function, callbackObj?: any) {
			this._runEndCallback = endCallback;
			this._runCallbackObj = callbackObj;
			this._runPath = path;
			this._state = STATE.RUN;

			egret.Tween.removeTweens(this);
			this._startRun();
		}

		protected _stopRun() {
			egret.Tween.removeTweens(this);
			if (this._dir == DIR.LEFT) {
				this.standLeft();
				if (this._runEndCallback) {
					console.log('end1');
					this._runEndCallback.call(this, null);
				}
			} else {
				this.standRight();
				if (this._runEndCallback) {
					console.log('end2');
					this._runEndCallback.call(this, null);
				}
			}
			this.target = null;
		}
		protected _startRun() {
			let path = this._runPath;
			if (path.length <= 0) {
				this._stopRun();
				return;
			}
			if (this._state != STATE.RUN) return;

			let p = path.shift();
			let dx = p.x - this.x;
			let dy = p.y - this.y;
			if (Math.abs(dx) >= Math.abs(dy)) {
				if (dx >= 0) {
					this.runRight();
				} else {
					this.runLeft();
				}
			} else {
				if (dy >= 0) {
					this.runDown();
				} else {
					this.runUp();
				}
			}

			let dt = this._getNeedTime(dx, dy);
			egret.Tween.get(this).to({ x: p.x, y: p.y }, dt)
				.call(() => {
					console.log('state', this._state);
					if (this._state == STATE.RUN) {
						this._startRun();
					}
				});
		}

		protected _getNeedTime(dx, dy) {
			return Math.sqrt(dx * dx + dy * dy) / this._dbproxy.getSpeed() * 10;
		}

		// action(target: Warrior) {
		// 	if (this.getProxy().getHp() <= 0) return;
		// 	if (target.getProxy().getCamp() != this.getProxy().getCamp()) {
		// 		if (this._atkCd <= 0) {
		// 			if (target.getProxy().getHp() > 0)
		// 				this.atk(target)

		// 		}
		// 	} else {
		// 		this._stopRun();
		// 	}
		// }

		atk(callback:Function = null) {
			egret.Tween.removeTweens(this);
			if (this._dir == DIR.LEFT) {
				this.atkLeft(callback);
			} else {
				this.atkRight(callback);
			}
			this._atkCd = this.getProxy().getAtkCd();
		}

		/** 
		 * 自动寻找敌人,搜索离自己最近的敌人,先找100范围内,再找200,一直到整个屏幕
		 * 但是还没实现上述，先实现全部搜索吧
		 */
		searchEnemies() {
			let list: Warrior[] = [];
			list = fg.avatar.layerAvatars[this.parent.id];
			list = list.filter(w => this.getProxy().getCamp() != w.getProxy().getCamp() && w.getProxy().getHp() > 0)
			list.sort((a, b) => utils.getDistance(a, this) - utils.getDistance(b, this));
			let enemy = list.length > 0 ? list[0] : null;
			return enemy;
		}

	}

}