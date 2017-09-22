module mj {

	/** type=1则是万条筒; 2是字; 3是花; 可以用 1|2|4|8|16 的方式来获取不同的需求 */
	export function getRandomMjs(type: number = 1): MjData[] {
		let mjs = [];
		if (type & MjData.WAN) {
			// 初始化 万 36张
			for (let i = 1; i <= 9; i++) {
				for (let j = 0; j < 4; j++) {
					let d = new MjData('', i, 0);//{ flower: '', num: i, hasMo: 0 };
					mjs.push(d);
				}
			}
		}
		if (type & MjData.TIAO) {
			// 初始化 条 36张
			for (let i = 1; i <= 9; i++) {
				for (let j = 0; j < 4; j++) {
					let d = new MjData('1', i, 0);//{ flower: '1', num: i, hasMo: 0 };
					mjs.push(d);
				}
			}
		}
		if (type & MjData.TONG) {
			// 初始化 筒 36张
			for (let i = 1; i <= 9; i++) {
				for (let j = 0; j < 4; j++) {
					let d = new MjData('2', i, 0);//{ flower: '2', num: i, hasMo: 0 };
					mjs.push(d);
				}
			}
		}
		if (type & MjData.ZI) {
			// 初始化 字 28张
			for (let i = 1; i <= 7; i++) {
				for (let j = 0; j < 4; j++) {
					let d = new MjData('3', i, 0);//{ flower: '3', num: i, hasMo: 0 };
					mjs.push(d);
				}
			}
		}
		if (type & MjData.HUA) {
			// 初始化 花 32张
			for (let i = 1; i <= 8; i++) {
				for (let j = 0; j < 4; j++) {
					let d = new MjData('4', i, 0);//{ flower: '4', num: i, hasMo: 0 };
					mjs.push(d);
				}
			}
		}
		utils.upsetArray(mjs);
		return mjs;
	}
	export class MjTools {

		public constructor() {
		}
	}
}