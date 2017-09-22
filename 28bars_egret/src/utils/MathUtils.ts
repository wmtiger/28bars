module utils {

	//随机一个a~b的整数，包含a和b
	export function random(a: number, b: number): number {
		return Math.floor(Math.random() * (b - a + 1)) + a;
	}

	export function upsetArray(array: any[]): void {
		var len = array.length;
		for (var i = 0; i < len; ++i) {
			var r = Math.floor(Math.random() * len);
			var t = array[i];
			array[i] = array[r];
			array[r] = t; //随机交换所有牌
		}
	}

	export function getDistance(p1:any, p2:any) {
		let w = p1.x > p2.x ? p1.x - p2.x : p2.x - p1.x;
		let h = p1.y > p2.y ? p1.y - p2.y : p2.y - p1.y;
		return Math.sqrt(w * w + h * h);
	}

	export function average(...args): number {
		var len = args.length;
		for (var i = 0, s = 0; i < len; ++i) {
			if (args[i] instanceof Array) {
				s += average.apply(this, args[i]);
			} else {
				s += args[i];
			}
		}
		return s / len;
	}

	/** 计算位移距离 */
	export function physical_s(t: number, a: number, u: number): number {
		return a * t > u ? u * u / 2 / a + u * (t - u / a) : a * t * t / 2;
	}

	/** 计算当前速度 */
	export function physical_u(t: number, a: number, u: number): number {
		return a * t > u ? u : a * t;
	}

	export class BezierNode {

		p1: egret.Point;
		p2: egret.Point;
		p3: egret.Point;
		tar: any;
		t: number = 0;  //它是从0到1的闭区间。

		public constructor(target: any, pt1: egret.Point, pt2: egret.Point, pt3: egret.Point) {
			if (target == null) return;
			if (pt1 == null) return;
			if (pt2 == null) return;
			if (pt3 == null) return;
			this.p1 = pt1; this.p2 = pt2; this.p3 = pt3;
			this.tar = target;
		}

		/**
		 * 随机生成p2
		 */
		generatorP2(scaleX: number = 1, scaleY: number = 1, isCenter: boolean = false): egret.Point {
			let vx: number = this.p3.x - this.p1.x;
			let vy: number = this.p3.y - this.p1.y;

			let flagX: number = Math.floor(Math.random() * 100 % 2) == 0 ? -1 : 1;
			let flagY: number = Math.floor(Math.random() * 100 % 2) == 0 ? -1 : 1;

			let tx: number = Math.abs(vx * scaleX) * Math.random() * flagX;
			let ty: number = Math.abs(vy * scaleY) * Math.random() * flagY;

			if (isCenter) {
				tx = vx / 2;
				ty = tx * flagY;
			}

			this.p2 = new egret.Point(this.p1.x + tx, this.p1.y + ty);
			return this.p2;
		}

		/**设置参数T */
		set factor(value: number) {
			this.t = value;
			this.tar.x = (1 - value) * (1 - value) * this.p1.x + 2 * value * (1 - value) * this.p2.x + value * value * this.p3.x;
			this.tar.y = (1 - value) * (1 - value) * this.p1.y + 2 * value * (1 - value) * this.p2.y + value * value * this.p3.y;
		}

		get factor(): number {
			return this.t;
		}

	}
}