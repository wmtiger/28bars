fairygui.GLoader.prototype["applyColor"] = function () {
    var cfm = this.getColorMatrix();
    var matrix = cfm.matrix;
    matrix[0] = ((this._color >> 16) & 0xFF) / 255;
    matrix[6] = ((this._color >> 8) & 0xFF) / 255;
    matrix[12] = (this._color & 0xFF) / 255;
    cfm.matrix = matrix;
};

fairygui.GLoader.prototype["getColorMatrix"] = function () {
    if (this._matrix)
        return this._matrix;
    if (this._content) {
        var filters = this._content.filters;
        if (filters) {
            for (var i = 0; i < filters.length; i++) {
                if (egret.is(filters[i], "egret.ColorMatrixFilter")) {
                    this._matrix = filters[i];
                    return this._matrix;
                }
            }
        }
    }
    var cmf = new egret.ColorMatrixFilter();
    this._matrix = cmf;
    filters = filters || [];
    filters.push(cmf);
    this._content.filters = filters;
    return cmf;
};


module fairygui {

	/// <summary>
	/// 长按手势。当按下一定时间后(duration)，派发onAction，如果once为false，则间隔duration时间持续派发onAction，直到手指释放。
	/// </summary>
    export class LongPressGesture extends egret.EventDispatcher {
        /// <summary>
		/// 
		/// </summary>
		host:GObject;

		/// <summary>
		/// 当手指按下时派发该事件。
		/// </summary>
		static BEGIN:string = "onLongPressBegin";
		/// <summary>
		/// 手指离开屏幕时派发该事件。
		/// </summary>
		static END:string = "onLongPressEnd";
		/// <summary>
		/// 当手指按下后一段时间后派发该事件。并且在手指离开前按一定周期派发该事件。
		/// </summary>
		static ACTION:string = "onLongPressAction";

		/// <summary>
		/// 第一次派发事件的触发时间。单位秒
		/// </summary>
		trigger:number;

		/// <summary>
		/// 派发onAction事件的时间间隔。单位秒。
		/// </summary>
		interval:number;

		/// <summary>
		/// 如果为真，则onAction再一次按下释放过程只派发一次。如果为假，则每隔duration时间派发一次。
		/// </summary>
		justonce:boolean;

		/// <summary>
		/// 手指按住后，移动超出此半径范围则手势停止。
		/// </summary>
		holdRangeRadius:number;

		_startPoint:egret.Point;
		_started:boolean;
        _timerId:number;

		public static TRIGGER:number = 1.5;
		public static INTERVAL:number = 1;

		constructor(host:GObject) {
			super();
			this.host = host;
			this.trigger = LongPressGesture.TRIGGER;
			this.interval = LongPressGesture.INTERVAL;
			this.holdRangeRadius = 50;
            this._timerId = -1;
			this.enable(true);
		}

		public dispose():void {
			this.enable(false);
			this.host = null;
		}

		public enable(value:boolean):void {
			if (value) {
				this.host.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.__touchBegin,this);
				this.host.addEventListener(egret.TouchEvent.TOUCH_END,this.__touchEnd,this);
			}
			else {
                this.host.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.__touchBegin,this);
				this.host.removeEventListener(egret.TouchEvent.TOUCH_END,this.__touchEnd,this);
                egret.clearTimeout(this._timerId);
                GRoot.inst.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.__timer, this);
			}
		}

		public cancel():void {
            GRoot.inst.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.__timer, this);
            egret.clearTimeout(this._timerId);
			this._started = false;
		}

		__touchBegin(event:egret.TouchEvent):void {
			this._startPoint = new egret.Point(event.stageX,event.stageY);
			this._started = false;
            this._timerId = egret.setTimeout(this.__timer,this,this.trigger*1000);
            GRoot.inst.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.__timer, this);
		}

		__timer(param:any):void {
            if (param instanceof egret.TouchEvent) {
                var pt:egret.Point = new egret.Point(param.stageX,param.stageY);
                if (Math.pow(pt.x - this._startPoint.x, 2) + Math.pow(pt.y - this._startPoint.y, 2) > Math.pow(this.holdRangeRadius, 2))
                {
                    this.cancel();
                }
				return;
            }
			if (!this._started)
			{
				this._started = true;
				this.dispatchEvent(new egret.Event(LongPressGesture.BEGIN));

                if (!this.justonce)
					this._timerId = egret.setTimeout(this.__timer,this,this.interval*1000);
			}

			this.dispatchEvent(new egret.Event(LongPressGesture.ACTION));
		}

		__touchEnd(event:egret.Event):void {
            egret.clearTimeout(this._timerId);
			GRoot.inst.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.__timer, this);

			if (this._started)
			{
				this._started = false;
				this.dispatchEvent(new egret.Event(LongPressGesture.END));
			}
		}
    }

}