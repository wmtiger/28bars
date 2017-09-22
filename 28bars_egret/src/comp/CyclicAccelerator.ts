module utils {

    export class CyclicAcceleratorState {
        static STAY:string = "stay";
        static UPSPEED:string = "upspeed";
        static FULLSPEED:string = "fullspeed";
        static BREAKING:string = "breaking";
    }

    export class CyclicAcceleratorEvent extends egret.Event {
        static START:string = "start";
        static FULLSPEED:string = "fullspeed";
        static BREAK:string = "break";
        static OUT:string = "out";
        static BUFF_START:string = "buff_start";
        static STOP:string = "stop";
        
        accelerator:utils.CyclicAccelerator;
        constructor(type:string, accelerator:any){
            super(type,false,false,accelerator);
            this.accelerator = accelerator;
        }
    }

    export class AcceleratorBuff {
        id:number; //buff的唯一id
        acc:number; //buff的加速度
        speed:number; //buff的速度
        startTime:number; //buff的启动时间
        endTime:number; //buff的结束时间

        _startEventDispatched:boolean; //是否促发过start事件
    }

    export class CyclicAccelerator extends egret.EventDispatcher {

        _coordinate:number = 0; //坐标

        _targetCoor:number = -1; //目标坐标

        _acceleration:number = .0015; //加速度

        _breakTime:number = 800; //全速制动时间

        _currentSpeed:number = 0; //当前速度

        _topSpeed:number = 1.6; //最高速度

        _bufflist:AcceleratorBuff[] = [];
        
        _currentIndex:number = 0;

        _lastIndex:number = 0;

        id:number = 0; //序号（无内置功能，仅为标记用）

        isFirst:boolean; //是否为第一个（无内置功能，仅为标记用）

        isLast:boolean; //是否为最后一个（无内置功能，仅为标记用）

        gap:number = 0; //元素间距(首尾边距为1/2 gap)

        areaSize:number; //观察区域

        itemSize:number; //元素尺寸

        numItems:number; //元素个数

        _itemParam:string; //绑定的元素属性

        _items:any[]; //绑定的元素数组

        _state:string = CyclicAcceleratorState.STAY;

        _updateListener:Function;
        _listenerThisObj:any;
        _listenerParamObj:any;

        constructor(id:number,isFirst?:boolean,isLast?:boolean) {
            super();
            this.id = id;
            this.isFirst = isFirst;
            this.isLast = isLast;
        }

        public setSize(areaSize:number, itemSize:number):CyclicAccelerator {
            this.areaSize = areaSize;
            this.itemSize = itemSize;
            this.numItems = Math.floor(this.areaSize / this.itemSize) + 1;
            return this;
        }

        public setItem(param:string, ...args):CyclicAccelerator {
            this._itemParam = param;
            this._items = args;
            return this;
        }

        public addItem(item:any):CyclicAccelerator {
            if (this._items == null) this._items = [];
            this._items.push(item);
            return this;
        }

        public getItem(index:number):any {
            if (this._items == null) return null;
            if (index>=this._items.length) return null;
            return this._items[index];
        }

        /** 监听函数会促发，新更新的ICON项，第二个参数为序号，第三个参数会最后一个的序号，0表示未知 */
        public setUpdate(listener:Function, thisObj:any, param:any):CyclicAccelerator {
            this._updateListener = listener;
            this._listenerThisObj = thisObj;
            this._listenerParamObj = param;
            return this;
        }


        _startTime:number = 0;

        _timerId:number = -1;

        _outEventDispatched:boolean;

        public reset():void {
            this._startTime = egret.getTimer();
            this._outEventDispatched = false;
            this._currentIndex = 0;
            this._lastIndex = 0;
            this._targetCoor = -1;
            this._bufflist = [];
            this.step();
        }

        public setSpeedBuff(speed:number,delay:number=0):void {
            var buff = this.getSpeedBuff(1);
            if (buff == null) {
                buff = new AcceleratorBuff();
                buff.id = 1; //暂时只有一个BUFF，所以不管理ID，直接写死就好
                buff.acc = this._acceleration;
                buff.speed = speed;
                buff.startTime = egret.getTimer() + delay;
                buff.endTime = -1;
                this._bufflist.push(buff);
            }
        }

        getSpeedBuff(id:number):AcceleratorBuff{
            var len = this._bufflist.length;
            for (var i=0; i<len; ++i) {
                var buff = this._bufflist[i];
                if (buff.id = id) return buff;
            }
            return null;
        }

        public start():void {
            this.reset();
            if (this._timerId == -1) {
                this._timerId = egret.setInterval(this.step,this,16);
            }
            this._state = CyclicAcceleratorState.UPSPEED;
            this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.START));
        }

        public stop():void {
            this._lastIndex = this._currentIndex + this.numItems;
            // var tarCoor = this._coordinate + this.gapSize * this.numItems;
            this._targetCoor = this._lastIndex * this.gapSize;
            var bt = this._breakTime * Math.sqrt(Math.sqrt(this._topSpeed / this._currentSpeed));
            egret.Tween.get(this).to({_coordinate:this._targetCoor},bt,egret.Ease.getBackOut(1.5)).call(this.over,this);
            this._state = CyclicAcceleratorState.BREAKING;
            this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.BREAK));
        }


        public over():void {
            if (this._timerId != -1) {
                egret.clearInterval(this._timerId);
                this._timerId = -1;
            }
            this._state = CyclicAcceleratorState.STAY;
            this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.STOP));
        }

        step():void {
            if (this._state != CyclicAcceleratorState.BREAKING) {
                this.physical();
                if (this._state == CyclicAcceleratorState.UPSPEED
                && this._currentSpeed>=this._topSpeed) {
                    this._state = CyclicAcceleratorState.FULLSPEED;
                    this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.FULLSPEED));
                }
            }
            if (!this._outEventDispatched && this._targetCoor!=-1 && this._coordinate > this._targetCoor) {
                this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.OUT));
                this._outEventDispatched = true;
            }
            this.update();
        }

        physical():void {
            var now = egret.getTimer();
            var t = now - this._startTime;
            var a = this._acceleration;
            var u = this._topSpeed;

            this._currentSpeed = utils.physical_u(t,a,u);
            this._coordinate = utils.physical_s(t,a,u);

            var len = this._bufflist.length;
            for (var i=0; i<len; ++i) {
                var buff = this._bufflist[i];
                var time = now-buff.startTime;
                if (time > 0) {
                    this._coordinate += utils.physical_s(time,buff.acc,buff.speed);
                    if(!buff._startEventDispatched) {
                        this.dispatchEvent(new egret.Event(CyclicAcceleratorEvent.BUFF_START,false,false,buff));
                        buff._startEventDispatched = true;
                    }
                }
            }
        }





        get gapSize():number {return this.itemSize + this.gap; }

        blurFilter = new egret.BlurFilter(0,3);

        update():void {
            var index = Math.floor(this._coordinate / (this.gapSize));
            while (index > this._currentIndex) {
                var item = this._items.pop();
                if(this._updateListener!=null) {
                    this._updateListener.call(this._listenerThisObj,item,index,this._lastIndex,this._listenerParamObj);
                }
                this._items.unshift(item);
                ++this._currentIndex;
            }
            var c = (this._coordinate % this.gapSize) - this.gapSize;
            for (var i=0; i<this.numItems; ++i) {
                this._items[i][this._itemParam] = c + this.gapSize * i + this.gap / 2;
                //测试功能+++
                // var blurItem:fairygui.GComponent = this._items[i];
                // if(this._state == CyclicAcceleratorState.FULLSPEED) {
                //     if (blurItem.filters==null||blurItem.filters.length==0) {
                //         blurItem.filters = [this.blurFilter];
                //     }
                // } else {
                //     blurItem.filters = null;
                // }
                //测试功能---
            }
        }



    }
}