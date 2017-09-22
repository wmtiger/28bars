module mj {
	export class MjTile_Up extends MjTile{
		private _content: fairygui.GComponent;
		private _img: fairygui.GImage;
		public constructor() {
			super();
			this.view = fairygui.UIPackage.createObject("tuitong", "TileUp").asCom
			this._content = this.view.getChild('content').asCom
			this._img = new fairygui.GImage()
			this._content.addChild(this._img); 
		}

		flushTile() {
			if (this.mjdata) {
				this._img.texture = RES.getRes('tile_meUp_' + this.mjdata.flower + this.mjdata.num + '_png');
				let x = this._content.initWidth - this._img.texture.textureWidth >> 1;
				this._img.scaleY = 0.9;
				let y = this._content.initHeight - this._img.texture.textureHeight * 0.9 >> 1;
				this._img.setXY(x, y)
			}
		}

	}
}