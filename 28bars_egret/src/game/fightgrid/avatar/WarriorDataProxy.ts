module fg.avatar {
	
	export enum CAMP {
		NPC = 0,
		DESERT,
		BRIGAND,
		DARK_KNIGHT,
		ARMY
	}
	/**是否进入了攻击范围 */
	export function isInAtkArea(obj1: Warrior, obj2: Warrior) {
		let dis = utils.getDistance({ x: obj1.x, y: obj1.y }, { x: obj2.x, y: obj2.y });
		if (dis <= obj1.getProxy().getAtkArea()) {
			return true;
		}
		return false;
	}

	/**
	 * WarriorData
	 */
	export class WarriorData {
		static CRT_ID: number = 1;// 当前的总id值，一直累加

		id: number = 1;
		speed: number = 1;
		hp: number = 100;
		maxHp: number = 100;
		atk: number = 6;
		atkCd: number = 1000;
		atkArea: number = 40;

		camp: number = 0;

		constructor() {
			this.id = WarriorData.CRT_ID++;
		}

	}

	/**
	 * WarriorDataProxy
	 */
	export class WarriorDataProxy {
		protected _data: WarriorData;

		constructor() {
		}

		init() {
			this._data = new WarriorData();
		}

		getId(): number {
			return this._data.id;
		}

		setSpeed(spd: number) {
			this._data.speed = spd;
		}
		getSpeed(): number {
			return this._data.speed;
		}

		setHp(hp: number) {
			this._data.hp = hp
			if (hp <= 0) {
				this._data.hp = 0;
				// this.sendNotification('WARRIOR_DEAD', this.getId())
				mvc.send(Warrior.WARRIOR_DEAD, this.getId())
			}
		}
		getHp(): number {
			return this._data.hp;
		}
		addHp(dhp: number) {
			this.setHp(this._data.hp + dhp);
		}

		setMaxHp(v: number) {
			this._data.maxHp = v;
		}
		getMaxHp(): number {
			return this._data.maxHp;
		}

		setAtk(atk: number) {
			this._data.atk = atk;
		}
		getAtk(): number {
			return this._data.atk;
		}
		addAtk(datk: number) {
			this.setAtk(this._data.atk + datk)
		}

		setAtkArea(v: number) {
			this._data.atkArea = v;
		}
		getAtkArea(): number {
			return this._data.atkArea;
		}

		setCamp(c: number) {
			this._data.camp = c;
		}
		getCamp() {
			return this._data.camp;
		}

		setAtkCd(cd: number) {
			this._data.atkCd = cd;
		}
		getAtkCd() {
			return this._data.atkCd;
		}

	}
}