module utils {
	// export class QuadTreeUtils {
	// 	public constructor() {
	// 	}
	// }
	export function isHit(obj1: IHitArea, obj2: IHitArea) {
		let rect1 = obj1.getHitRect();
		let rect2 = obj2.getHitRect();
		let left = rect1.x < rect2.x ? rect1 : rect2;
		let right = rect1.x >= rect2.x ? rect1 : rect2;
		if (left.x + left.width >= right.x) {
			if (left.y < right.y) {
				if (left.y + left.height >= right.y) {
					return true;
				}
			} else {
				if (right.y + right.height >= left.y) {
					return true;
				}
			}
		}
		return false;
	}
	export function isInViewport(obj: IHitArea, viewportRect: egret.Rectangle) {
		let objRect = obj.getHitRect();
		if (objRect.x + objRect.width > viewportRect.x &&
			objRect.y + objRect.height > viewportRect.y &&
			objRect.x < viewportRect.x + viewportRect.width &&
			objRect.y < viewportRect.y + viewportRect.height) {
				return true;
		}
		return false;
	}
	export interface IHitArea {
		setHitRect(rect: egret.Rectangle);
		getHitRect(): egret.Rectangle;
		// action();
	}
	/**QuadTree */
	export class QuadTree {
		static MAX_LEVEL = 5;// 往下最大的扩展层级
		static MAX_CHILDREN = 10;// 每个层级最大的物体数量

		level = 0;
		objs: IHitArea[];
		rect: egret.Rectangle;
		nodes: QuadTree[];

		public constructor(lv: number, rect: egret.Rectangle) {
			this.level = lv;
			this.objs = [];
			this.rect = rect;
			this.nodes = [];
		}
		/** 清理当前所有的字节点 */
		clear() {
			this.objs = [];
			this.nodes.forEach(n => n.clear());
			this.nodes = [];
		}
		/**将当前子节点均分成4块 */
		split() {
			let dw = this.rect.width / 2;
			let dh = this.rect.height / 2;

			let x = this.rect.x;
			let y = this.rect.y;

			this.nodes[0] = new QuadTree(this.level + 1, new egret.Rectangle(x + dw, y, dw, dh));// 右上
			this.nodes[1] = new QuadTree(this.level + 1, new egret.Rectangle(x + dw, y + dh, dw, dh));// 右下
			this.nodes[2] = new QuadTree(this.level + 1, new egret.Rectangle(x, y + dh, dw, dh));// 左下
			this.nodes[3] = new QuadTree(this.level + 1, new egret.Rectangle(x, y, dw, dh));// 左上
		}
		/** 判断物体属于哪个节点 在线上为父节点，返回-1 */
		getIdx(objRect: egret.Rectangle) {
			// let objRect = obj.getHitRect();
			let idx = -1;

			let isUp = objRect.y + objRect.height < this.rect.height / 2;// 完全属于上面象限
			let isDown = objRect.y > this.rect.height / 2;// 完全属于下面象限
			let isLeft = objRect.x + objRect.width < this.rect.width / 2;// 完全属于左边象限
			let isRight = objRect.x > this.rect.width / 2;// 完全属于右面象限
			let isHorLine = !isUp && !isDown;
			let isVerLine = !isLeft && !isRight;

			if (isUp && isRight) {
				idx = 0;
			} else if (isDown && isRight) {
				idx = 1;
			} else if (isDown && isLeft) {
				idx = 2;
			} else if (isUp && isLeft) {
				idx = 3;
			}
			return idx;
		}
		/** 插入节点 */
		insert(obj: IHitArea) {
			if (this.nodes.length > 0) {
				let idx = this.getIdx(obj.getHitRect());
				if (idx > -1) {
					this.nodes[idx].insert(obj);
					return;
				}
			}

			this.objs.push(obj);
			if (this.objs.length > QuadTree.MAX_CHILDREN && this.level < QuadTree.MAX_LEVEL) {
				if (this.nodes.length <= 0) {
					this.split();
				}
				let objsIdx = this.objs.length - 1;
				while (objsIdx > 0) {
					let tempObj = this.objs[objsIdx];
					let tidx = this.getIdx(tempObj.getHitRect());
					if (tidx > -1) {
						this.nodes[tidx].insert(tempObj);
						this.objs.splice(this.objs.indexOf(tempObj), 1);
					}
					objsIdx--;

				}
			}
		}
		/** 获取碰撞列表 */
		retrieve(obj: IHitArea) {
			let result: IHitArea[] = [];

			if (this.nodes.length > 0) {
				let idx = this.getIdx(obj.getHitRect());
				if (idx > -1) {
					result = result.concat(this.nodes[idx].retrieve(obj));
				} else {
					let arr = this.cut(obj.getHitRect());
					for (let i = 0; i < arr.length; i++) {
						result = result.concat(this.nodes[arr[i]].retrieve(obj));
					}
				}
			}
			result = result.concat(this.objs)
			return result;
		}
		protected _isUp(objRect: egret.Rectangle) {
			return objRect.y + objRect.height > this.rect.y &&
				objRect.y + objRect.height < this.rect.height / 2;// 完全属于上面象限
		}
		protected _isDown(objRect: egret.Rectangle) {
			return objRect.y + objRect.height < this.rect.y + this.rect.height &&
				objRect.y > this.rect.height / 2;// 完全属于上面象限
		}
		/** 分割矩形，如果矩形在象限线上，就将他所在的所有象限都包括进去计算 */
		cut(objRect: egret.Rectangle) {
			let arr = [];
			let isUp = objRect.y + objRect.height < this.rect.height / 2;// 完全属于上面象限
			let isDown = objRect.y > this.rect.height / 2;// 完全属于下面象限
			let isLeft = objRect.x + objRect.width < this.rect.width / 2;// 完全属于左边象限
			let isRight = objRect.x > this.rect.width / 2;// 完全属于右面象限
			let isHorLine = !isUp && !isDown;
			let isVerLine = !isLeft && !isRight;
			if (isHorLine && !isVerLine) {
				if (isLeft) {
					arr = [2, 3];
				} else {
					arr = [0, 1]
				}
			} else if (!isHorLine && isVerLine) {
				if (isUp) {
					arr = [0, 3];
				} else {
					arr = [2, 1]
				}
			} else if (isHorLine && isVerLine) {
				arr = [0, 1, 2, 3];
			}
			return arr;
		}
		/** 是否在当前节点区域中 */
		isInner(objRect: egret.Rectangle) {
			let isOutRight = objRect.x > this.rect.x + this.rect.width
			let isOutLeft = objRect.x + objRect.width < this.rect.x;
			let isOutDown = objRect.y > this.rect.y + this.rect.height
			let isOutUp = objRect.y + objRect.height < this.rect.y;
			if (isOutUp && isOutDown && isOutLeft && isOutRight) {
				return false;
			}
			return true;
		}

		refresh(root:QuadTree) {
			let len = this.objs.length;
			for (let i = len - 1; i >= 0; i--) {
				let obj = this.objs[i];
				let idx = this.getIdx(obj.getHitRect());
				let isInner = this.isInner(obj.getHitRect());
				if(isInner){
					if(this.nodes.length > 0){
						this.nodes[idx].insert(this.objs.splice(i, 1)[0])
					}
				}else{
					root.insert(this.objs.splice(i, 1)[0])
				}
			}

			for (let i = 0; i < this.nodes.length; i++) {
				let nt = this.nodes[i];
				nt.refresh(root);
			}
		}
	}
}