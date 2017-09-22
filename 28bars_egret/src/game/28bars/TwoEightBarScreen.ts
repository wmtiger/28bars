module twoeightbar {
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
	}

	export class TwoEightBarScreen extends ui.SspScreen {
		static NAME: string = 'TwoEightBarScreen';
		constructor() {
			super(TwoEightBarScreen.NAME);
			this.fairyPkgName = 'twoeightbar_pkg';
			this.fairyResName = 'Table';
			this.resGroup = ['teb'];// twoeightbar 的缩写
		}

		onInit(): void {
		}

		reset(): void {
		}

		start(): void {
		}

		onClick(target: fairygui.GObject): void {
			// switch (target) {
			// 	case this.btnReady:
			// 		console.log('start');
			// 		this.start();
			// 		break;
			// }
		}
	}
}