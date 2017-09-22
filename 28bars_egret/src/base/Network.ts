module net {

    export function getRecvAction(modelId:any, action:any):string {
        return "recv:" + modelId + "-" + action;
    }

    export function getSendAction(modelId:any, action:any):string {
        return "send:" + modelId + "-" + action;
    }

    export function register(netAction:number, serverModelId:number, recvReader?:any, sendServer?:any):void {
        puremvc.Facade.getInstance().registerCommand(net.getRecvAction(serverModelId,netAction),recvReader);
    }


    var _clientStartInServerTime:number;
    export function getSvrTime():number {
        return _clientStartInServerTime + egret.getTimer();
    }
    export function getSvrDate():Date {
        return new Date(_clientStartInServerTime);
    }

    export class SspServer {

        _requestReaderClassDict:any = {};
        _onceListener:any;//函数或ParamVOReader子类
        
        serverInfo:protovos.ServerInfoVO;

        get userId():string {return dat.userVO == null ? "" : dat.userVO.userId;}
        get token():string {return dat.token == null ? "" : dat.token;}
        get isConnected():boolean{return false;}
        
        connect(listener?:Function, thisObj?:any):void {}

        send(bytes:egret.ByteArray):void{}

        recv(bytes:egret.ByteArray):void {
            var len = bytes.readInt();
            var recvMessageBytes = new egret.ByteArray();
            bytes.readBytes(recvMessageBytes,0,len);
            var recvMessageVO = protovos.MessageVO.create(recvMessageBytes.buffer);
            if(recvMessageVO.sendAt > 0) {
                _clientStartInServerTime = recvMessageVO.sendAt - egret.getTimer();
            }
            egret.log("recv: "+this.serverInfo.modelId+"-"+recvMessageVO.action);

            // 1、 响应一次性注册的回调，一般在发包前注册回调，回调只响应一次，即失效。
            if(this._onceListener!=null) {
                if(this._onceListener instanceof Function) {
                    this._onceListener(recvMessageVO.data);
                } else if (this._onceListener instanceof ParamVOReader) {
                    this._onceListener.messageVO = recvMessageVO;
                    this._onceListener.paramVO = recvMessageVO.data;
                    this._onceListener.onReceiveData(recvMessageVO.data);
                }
                this._onceListener=null;
            }

            // 2、响应使用管理器预先在网络模块注册过的处理器，处理回调。
            this.getRequest(recvMessageVO).onReceiveData(recvMessageVO.data);

            // 3、发布MVC消息，可出发任何时候注册的Command或Mediator
            var notificationId = getRecvAction(this.serverInfo.modelId, recvMessageVO.action);
            puremvc.Facade.getInstance().sendNotification(notificationId, recvMessageVO);
        }

        addOnceListener(listener?:any, action?:number):void {
            this._onceListener = listener;
        }

        regRequest(action:number, readerClass:any):void {
            this._requestReaderClassDict[action] = readerClass;
        }

        getRequest(recvMessageVO:protovos.MessageVO):ParamVOReader {
            var action = recvMessageVO.action;
            var ReaderClass = this._requestReaderClassDict[action];
            if (ReaderClass == null) return new ParamVOReader();
            var reader = <ParamVOReader>new ReaderClass();
            reader.messageVO = recvMessageVO;
            reader.paramVO = recvMessageVO.data;
            return reader;
        }
    }

    export class HttpServer extends SspServer {

        _httpRequest:egret.HttpRequest;
        _listener:Function;
        
        constructor() {
            super();
            this._httpRequest = new egret.HttpRequest();
            this._httpRequest.responseType = egret.HttpResponseType.ARRAY_BUFFER;
            this._httpRequest.addEventListener(egret.Event.COMPLETE,this.onPostComplete,this);
            this._httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onPostIOError,this);
            this._httpRequest.addEventListener(egret.ProgressEvent.PROGRESS,this.onPostProgress,this);
        }

        private onPostIOError(event:egret.IOErrorEvent):void {
            egret.log("post error : " + event);
        }

        private onPostProgress(event:egret.ProgressEvent):void {
            egret.log("post progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
        }

        private onPostComplete(event:egret.ProgressEvent):void {
            this.recv(new egret.ByteArray(this._httpRequest.response));
        }


        get isConnected():boolean {
            return true;
        }
        connect(listener?:Function, thisObj?:any):void {
            listener.apply(thisObj);
        }


        send(bytes:egret.ByteArray):void {
            var url = "http://" + this.serverInfo.ip + ":" + this.serverInfo.hport;
            this._httpRequest.open(url,egret.HttpMethod.POST);
            this._httpRequest.send(bytes.buffer);
        }

        close():void {

        }

    }

    export class WebSocketServer extends SspServer {

        _webSocket:egret.WebSocket;
        _onConnectSuccess:Function;
        _onConnectSuccessThisObj:any;

        constructor() {
            super();
            this._webSocket = new egret.WebSocket();
            this._webSocket.type = egret.WebSocket.TYPE_BINARY;
            this._webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this._webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this._webSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this._webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        }

        connect(listener?:Function, thisObj?:any):void {
            this._webSocket.connect(this.serverInfo.ip, this.serverInfo.wport);
            this._onConnectSuccess = listener;
            this._onConnectSuccessThisObj = thisObj;
        }

        get isConnected():boolean {
            return this._webSocket.connected;
        }

        private onSocketOpen(event:egret.Event):void {
            egret.log("WebSocketOpen");
            if(this._onConnectSuccess!=null) {
                this._onConnectSuccess.apply(this._onConnectSuccessThisObj);
                this._onConnectSuccess = null;
            }
        }

        _heartTime:number = 0;
        _heartIntervalId:number = -1;
        _heartNotificationName:string = "";
        _heartNotificationNameIsAction:boolean;
        setHeart(step:number, heartNotificationName:string="", isAction?:boolean):void {
            if (step > 0) {
                this._heartNotificationName = heartNotificationName;
                if(this._heartIntervalId != -1) {
                    egret.clearInterval(this._heartIntervalId);
                }
                this._heartTime = step;
                this._heartNotificationName = heartNotificationName;
                this._heartNotificationNameIsAction = isAction;
                this._heartIntervalId = egret.setInterval(this.heartStep,this,this._heartTime);
            } else {
                this.clearHeart();
            }
        }
        clearHeart():void {
            if (this._heartIntervalId!=-1) {
                egret.clearInterval(this._heartIntervalId);
                this._heartIntervalId = -1;
            }
        }

        private heartStep():void {
            if (this._heartTime <= 0) {
                this.clearHeart();
                return;
            }
            if(mvc.has(this._heartNotificationName)) {
                mvc.send(this._heartNotificationName);
            } else {
                if(this._heartNotificationNameIsAction) {
                    pvo().to(parseInt(this._heartNotificationName),this);
                } 
            }
        }


        private onReceiveMessage(event:egret.Event):void {
            var bytes:egret.ByteArray = new egret.ByteArray();
            this._webSocket.readBytes(bytes);
            this.recv(bytes);
        }

        private onSocketClose():void {
            egret.log("WebSocketClose");
        }

        private onSocketError():void {
            egret.log("WebSocketError");
        }


        send(bytes:egret.ByteArray, listener?:Function) {
            this._webSocket.writeBytes(bytes);
            this._webSocket.flush();
        }

        close():void {
            this._webSocket.close();
        }
    }

    export class ParamVOReader extends puremvc.SimpleCommand {
        messageVO:protovos.MessageVO;
        paramVO:protovos.ParamVO;
        action:string;
        execute(notification: puremvc.INotification):void {
            this.action = notification.getName();
            this.messageVO = notification.getBody();
            this.paramVO = this.messageVO.data;
            if(this.messageVO.errorCode != 0 && this.messageVO.errorCode != null) {
                //继承onReceiveError，处理细节后返回true，否则调用统一处理函数
                if (!this.onReceiveError(this.messageVO.errorCode)) {
                    egret.log("action:"+this.messageVO.action+", error:"+this.messageVO.errorCode);
                }
            } else {
                this.onReceiveData(this.paramVO);
            }
        }
        onReceiveError(errorCode:number):boolean {return false;} //抽象函数，继承实现错误解析
        onReceiveData(paramVO:protovos.ParamVO):void {} //抽象函数，继承实现解析方法
    }

    export function pvo():ParamVoWriter { return new ParamVoWriter(); }

    export class ParamVoWriter extends puremvc.SimpleCommand{

        paramVO:any; //这是通过创建器创建的VO，不是自定义的VO;

        /** 添加 longValues*/
        l(...args): ParamVoWriter {
            if(this.paramVO==null)this.paramVO=ssp.getProtobufVO("ParamVO");
            var len: number = args.length;
            for (var i: number = 0; i < len; ++i) {
                this.paramVO.longValues[i] = dcodeIO.Long.fromNumber(args[i]);
            }
            return this;
        }

        /** 添加 intValues*/
        i(...args): ParamVoWriter {
            if(this.paramVO==null)this.paramVO=ssp.getProtobufVO("ParamVO");
            this.paramVO.intValues = args;
            return this;
        }

        /** 添加 strValues*/
        s(...args): ParamVoWriter {
            if(this.paramVO==null)this.paramVO=ssp.getProtobufVO("ParamVO");
            this.paramVO.strValues = args;
            return this;
        }

        /** 添加 data*/
        d(...args): ParamVoWriter {
            if(this.paramVO==null)this.paramVO=ssp.getProtobufVO("ParamVO");
            this.paramVO.data = args;
            return this;
        }

        to(action:number, server:SspServer, listener?:any, reaction?:number):void {
            var messagevo = ssp.getProtobufVO("MessageVO");
            messagevo.phase = 1;
            messagevo.action = action;
            messagevo.clientNumId = server.userId;
            messagevo.token = server.token;
            messagevo.data = this.paramVO||ssp.getProtobufVO("ParamVO");
            var messagebuf:ArrayBuffer = messagevo.toArrayBuffer(); 
            var sendBuffer = new egret.ByteArray();
            sendBuffer.writeInt(messagebuf.byteLength);
            sendBuffer.writeBytes(new egret.ByteArray(messagebuf));
            if(listener!=null) server.addOnceListener(listener,reaction);
            server.send(sendBuffer);
            egret.log("send: "+server.serverInfo.modelId+"-"+action);
            
        }

    }
}