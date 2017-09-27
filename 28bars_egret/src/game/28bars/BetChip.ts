module twoeightbar {
	export class BetChip {
		view: fairygui.GComponent;
		from: number = -1;
		targetId: number = -1;

		public constructor() {
			this.view = fairygui.UIPackage.createObject("twoeightbar_pkg", "BetChip").asCom;
			this.view.touchable = false;
		}


	}
}