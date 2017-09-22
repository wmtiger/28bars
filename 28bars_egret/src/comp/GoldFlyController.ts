/**
 * 奖励的飞入逻辑控制
 */
module utils {

	export class GoldFlyController  {

		images:fairygui.GMovieClip[] = [];

		/**
		 * 中牌后产口金币飞入特效
		 * mode = 1 平飞
		 * mode = 2 六脉神剑
		 * mode = 3 星际航母
		 * 
		 * randomSize 随机大小，随机旋转角度
		 * isCenter beizer 是否取两点的中间(视频效果,mode 2)
		 */
		async bingo(startPoint:egret.Point, targetPoint:egret.Point,
					duration:number = 1000, count:number = 30) {

			var mode = 3;
			var randomSize = true;
			var isCenter = false;

			let root = fairygui.GRoot.inst;
			
			let i:number = 0;

			let beziers:utils.BezierNode[] = [];
			let p2:egret.Point = new egret.Point();

            fairygui.UIPackage.addPackage("effect");
            

			for(i = 0; i < count; i++) {
				let scale:number = Math.floor(randomSize ? Math.random() * 2 : 2) - 1;
				let rotation:number = randomSize ? Math.random() * 360 : 0;

				let img = fairygui.UIPackage.createObject("Effect", "CoinClip").asMovieClip;
				img.width = 39;
				img.height = 39;
				// img.pivotX = img.width/2;
				// img.pivotY = img.height/2;

				root.addChild(img);
				this.images.push(img);

				img.rotation = rotation;
				img.x = startPoint.x;
				img.y = startPoint.y;
				img.visible = false;
				
				if(mode != 1) {
					let bezier:utils.BezierNode = new utils.BezierNode(img,new egret.Point(img.x,img.y),p2,targetPoint);
					beziers.push(bezier);
					if(mode == 2) 	{
						if(p2.x == 0 && p2.y == 0) p2 = bezier.generatorP2(3,1,isCenter);
					}
					else {
						bezier.generatorP2(3,1,isCenter);
					}

					egret.Tween.get(bezier)
						.wait(this._gapDuration * i)
						.call((...args)=>{
							args[0].visible = true;
						},this,[img])
						.to({factor:1},duration,egret.Ease.quadOut)
						.call((...args)=>{
							args[0].removeFromParent(false);
						},this,[img]);
				}
				else {
					egret.Tween.get(img)
						.wait(this._gapDuration * i)
						.set({visible:true})
						.to({x:targetPoint.x,y:targetPoint.y,rotation:720},duration,egret.Ease.quartIn)
				}
			}

			var sleep = function(time:number = 1000) {
				return new Promise((resolve,reject)=>{
					egret.setTimeout(()=>{resolve(time)},this,time);
				})
			}
			
			let aTime:number = this._gapDuration * count + duration;
			await sleep(aTime);

			for(i = 0; i < beziers.length; i++) {
				egret.Tween.removeTweens(beziers[i]);
			}

			this._currenOrigin = targetPoint;
			this.nextStep();
		}


		private _steps:any[] = [];
		private _playing:boolean;
		private _currenOrigin:egret.Point;
		private nextStep():void {
			this._playing = false;
			if (this._steps!=null && this._steps.length>0) {
				var cmds:any[] = this._steps.shift();
				var func:Function = this[cmds.shift()];
				func.apply(this,cmds);
			}
		}

		private _gapDuration
		setGap(duration:number):GoldFlyController {
			if (this._playing) {
				this._steps.push(["setOrigin",this._gapDuration]);
			} else {
				this._gapDuration = duration;
				this.nextStep();
			}
			return this;
		}

		/** target表示起点对象，
		 * h表示对其方式，数字为1/2宽度的倍数，-1左对齐，1右对齐，0居中，其他数字为高级用法，也有效不同效果
		 * v表示对其方式，数字为1/2高度的倍数，-1左对齐，1右对齐，0居中，其他数字为高级用法，也有效不同效果
		 */
		setOrigin(target:fairygui.GObject,h:number=0,v:number=0):GoldFlyController {
			if (this._playing) {
				this._steps.push(["setOrigin",target,h,v]);
			} else {
				this._currenOrigin = target.localToGlobal();
				this._currenOrigin.x += (h+1)*.5*target.width;
				this._currenOrigin.y += (v+1)*.5*target.height;
				this.nextStep();
			}
			return this;
		}

		flyTo(end:fairygui.GObject, time:number, numStars:number, h:number=0, v:number=0):GoldFlyController {
			if (this._playing) {
				this._steps.push(["flyTo",end,time,numStars]);
			} else {
				var targetOrigin = end.localToGlobal();
				targetOrigin.x += (h+1)*.5*end.width;
				targetOrigin.y += (v+1)*.5*end.height;
				this.bingo(this._currenOrigin, targetOrigin, time, numStars);
				this._playing = true;
			}
			return this;
		}

		call(func:Function, thisObj:any, ...args):GoldFlyController {
			if (this._playing) {
				this._steps.push(["call", func, thisObj, args]);
			} else {
				func.apply(thisObj,args);
				this._playing = true;
				this.nextStep();
			}
			return this;
		}

		wait(time:number):GoldFlyController {
			if (this._playing) {
				this._steps.push(["wait", time]);
			} else {
				egret.setTimeout(this.nextStep,this,time);
				this._playing = true;
			}
			return this;
		}



		

		clearAll() {
			egret.Tween.removeAllTweens();
			this.images.forEach(element=>{
				element.removeFromParent();
			})
			this.images = [];
		}

		dispose():void {
			this.clearAll();
		}
	}
}