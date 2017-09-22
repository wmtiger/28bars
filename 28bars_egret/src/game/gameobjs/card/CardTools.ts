module pkcard {

	/** 获取随机52张牌 */
	export function getRandomDatas(): CardData[] {
		let list: CardData[] = [];
		for (var i = 0; i < 52; i++) {
			let cd;
			if (i < 13) {
				cd = new CardData('2', i);
			} else if (i < 26) {
				cd = new CardData('3', i % 13);
			} else if (i < 39) {
				cd = new CardData('1', i % 13);
			} else if (i < 52) {
				cd = new CardData('0', i % 13);
			}
			list.push(cd);
		}
		utils.upsetArray(list);
		return list;
	}

	export function getPointByCardNum(c: CardData) {
		let p = 1;
		if (c.num < 9) {
			p = c.num + 2;
		} else if (c.num >= 9 && c.num < 12) {
			p = 0.5;
		} else {
			p = 1;
		}
		return p;
	}
	export class CardTools {
		public constructor() {
		}
	}
}