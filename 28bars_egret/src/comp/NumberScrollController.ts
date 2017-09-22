/**
 * 数字滚动逻辑控制处理
 */
module utils {
	
	export class NumberScrollController extends egret.EventDispatcher {

		numberUI:any;

		//动画没有播完的时候获取的最新的值
		private nowValue:number = 0;
		//是否播放数字滚动效果
		isAnimation: boolean;		

		duration:number = 1000;

		formatFlag:number;

		private numberValue:number = 0;
		public constructor(ui:any, moneyFormat:number=utils.NTSF_K, isAnimation:boolean=true) {
			super();
			this.numberUI = ui;
			this.formatFlag = moneyFormat;
			this.isAnimation = isAnimation;
			this.value = this.nowValue;
		}

		set value(val:number){
			let newValue = val;
			if(newValue != this.numberValue && this.isAnimation) {
				this.setValueAsAnimation(newValue);
			} 
			else {
				this.setValue(newValue);
			}
		}

		get value():number {
			return this.numberValue;
		}

		setValueAsAnimation(newValue:number):void {
			//动画没有播完的时候获取的最新的值
			this.nowValue = newValue;
			//let duration:number = 300;//Math.abs(newValue - this.numberValue) / 300;
			egret.Tween.removeTweens(this);
			egret.Tween.get(this,{onChange:this.onChange,onChangeObj:this})
				.to({$value:newValue},this.duration,egret.Ease.quartOut)
				.call(()=>{
					this.renderData(newValue,this.formatFlag)
					this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
				})
		}

		setValue(newValue:number):void {
			this.numberValue = this.nowValue = newValue;
			this.renderData(newValue,this.formatFlag);
		}





		private renderData(val:number,format?:number):void {
			val = Math.floor(val);
			if(this.numberUI != null) {
				this.numberUI.text = utils.numberFormat(val,format);
			}
		}

		private onChange():void {
			this.renderData(this.numberValue,this.formatFlag);
		}

		private set $value(val:number) {
			this.numberValue = val;
		}

		private get $value() {
			return this.numberValue;
		}

		dispose():void {
			egret.Tween.removeTweens(this);
		}
	}
}