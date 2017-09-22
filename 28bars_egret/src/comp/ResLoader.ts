/**
 * RES 资源加载
 */
module utils {
	
	export class ResLoader extends egret.EventDispatcher {


        _groupNames:string[];
        _groupProgress:number[];
        _startTime:number;

        loadGroups(...args):void {
            if (args.length==1 && args[0] instanceof Array) args = args[0];
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this._groupNames = args;
            this._groupProgress = [];
            var len = args.length;
            for (var i=0; i<len; ++i) {
                this._groupProgress[i] = 0;
                RES.loadGroup(args[i],i*-1);
            }
            this._startTime = egret.getTimer();
        }



        _virturlIntervalId:number = -1;
        _virturlTimeout:number = -1;

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
        private onResourceLoadComplete(event:RES.ResourceEvent):void {
            var index = this._groupNames.indexOf(event.groupName);
            if (index!=-1) this._groupProgress[index] = 1;

            if (utils.average(this._groupProgress) == 1) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);

                var delayTime = egret.getTimer() - this._startTime - this.showTime;
                if (delayTime > 0) {
                    this.dispatchEvent(new egret.Event("complete"));
                } else {
                    this._virturlIntervalId = egret.setInterval(this.dispatchEvent,this,80,new egret.Event("loading"));
                    this._virturlTimeout = egret.setTimeout(this.dispatchEvent,this,-delayTime,new egret.Event("complete"));
                }
            }
        }

    
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onResourceLoadError(event:RES.ResourceEvent):void {
            //TODO
            console.warn("Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //Ignore the loading failed projects
            // this.onResourceLoadComplete(event);
        }


        /**
         * preload资源组加载进度
         * Loading process of preload resource group
         */
        private onResourceProgress(event:RES.ResourceEvent):void {
            var index = this._groupNames.indexOf(event.groupName);
            if (index!=-1) {
                // console.log(event.groupName+">>"+event.itemsLoaded+"/"+event.itemsTotal);
                this._groupProgress[index] = event.itemsLoaded/event.itemsTotal;
                this.dispatchEvent(new egret.Event("loading"));
            }
        }


        showTime:number = 2000;
        public get progress():number {
            var t = egret.getTimer() - this._startTime; //实际运行的时间
            var pt = t / this.showTime; //理论匀速的时间
            var pi = utils.average(this._groupProgress);
            // console.log("pt:"+pt+" pi:"+pi);
            return pt < pi ? pt : pi;
        }

    }
}