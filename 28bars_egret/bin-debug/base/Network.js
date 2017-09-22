var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var net;
(function (net) {
    function getRecvAction(modelId, action) {
        return "recv:" + modelId + "-" + action;
    }
    net.getRecvAction = getRecvAction;
    function getSendAction(modelId, action) {
        return "send:" + modelId + "-" + action;
    }
    net.getSendAction = getSendAction;
    function register(netAction, serverModelId, recvReader, sendServer) {
        puremvc.Facade.getInstance().registerCommand(net.getRecvAction(serverModelId, netAction), recvReader);
    }
    net.register = register;
    var _clientStartInServerTime;
    function getSvrTime() {
        return _clientStartInServerTime + egret.getTimer();
    }
    net.getSvrTime = getSvrTime;
    function getSvrDate() {
        return new Date(_clientStartInServerTime);
    }
    net.getSvrDate = getSvrDate;
    var SspServer = (function () {
        function SspServer() {
            this._requestReaderClassDict = {};
        }
        Object.defineProperty(SspServer.prototype, "userId", {
            get: function () { return dat.userVO == null ? "" : dat.userVO.userId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SspServer.prototype, "token", {
            get: function () { return dat.token == null ? "" : dat.token; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SspServer.prototype, "isConnected", {
            get: function () { return false; },
            enumerable: true,
            configurable: true
        });
        SspServer.prototype.connect = function (listener, thisObj) { };
        SspServer.prototype.send = function (bytes) { };
        SspServer.prototype.recv = function (bytes) {
            var len = bytes.readInt();
            var recvMessageBytes = new egret.ByteArray();
            bytes.readBytes(recvMessageBytes, 0, len);
            var recvMessageVO = protovos.MessageVO.create(recvMessageBytes.buffer);
            if (recvMessageVO.sendAt > 0) {
                _clientStartInServerTime = recvMessageVO.sendAt - egret.getTimer();
            }
            egret.log("recv: " + this.serverInfo.modelId + "-" + recvMessageVO.action);
            // 1、 响应一次性注册的回调，一般在发包前注册回调，回调只响应一次，即失效。
            if (this._onceListener != null) {
                if (this._onceListener instanceof Function) {
                    this._onceListener(recvMessageVO.data);
                }
                else if (this._onceListener instanceof ParamVOReader) {
                    this._onceListener.messageVO = recvMessageVO;
                    this._onceListener.paramVO = recvMessageVO.data;
                    this._onceListener.onReceiveData(recvMessageVO.data);
                }
                this._onceListener = null;
            }
            // 2、响应使用管理器预先在网络模块注册过的处理器，处理回调。
            this.getRequest(recvMessageVO).onReceiveData(recvMessageVO.data);
            // 3、发布MVC消息，可出发任何时候注册的Command或Mediator
            var notificationId = getRecvAction(this.serverInfo.modelId, recvMessageVO.action);
            puremvc.Facade.getInstance().sendNotification(notificationId, recvMessageVO);
        };
        SspServer.prototype.addOnceListener = function (listener, action) {
            this._onceListener = listener;
        };
        SspServer.prototype.regRequest = function (action, readerClass) {
            this._requestReaderClassDict[action] = readerClass;
        };
        SspServer.prototype.getRequest = function (recvMessageVO) {
            var action = recvMessageVO.action;
            var ReaderClass = this._requestReaderClassDict[action];
            if (ReaderClass == null)
                return new ParamVOReader();
            var reader = new ReaderClass();
            reader.messageVO = recvMessageVO;
            reader.paramVO = recvMessageVO.data;
            return reader;
        };
        return SspServer;
    }());
    net.SspServer = SspServer;
    __reflect(SspServer.prototype, "net.SspServer");
    var HttpServer = (function (_super) {
        __extends(HttpServer, _super);
        function HttpServer() {
            var _this = _super.call(this) || this;
            _this._httpRequest = new egret.HttpRequest();
            _this._httpRequest.responseType = egret.HttpResponseType.ARRAY_BUFFER;
            _this._httpRequest.addEventListener(egret.Event.COMPLETE, _this.onPostComplete, _this);
            _this._httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR, _this.onPostIOError, _this);
            _this._httpRequest.addEventListener(egret.ProgressEvent.PROGRESS, _this.onPostProgress, _this);
            return _this;
        }
        HttpServer.prototype.onPostIOError = function (event) {
            egret.log("post error : " + event);
        };
        HttpServer.prototype.onPostProgress = function (event) {
            egret.log("post progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
        };
        HttpServer.prototype.onPostComplete = function (event) {
            this.recv(new egret.ByteArray(this._httpRequest.response));
        };
        Object.defineProperty(HttpServer.prototype, "isConnected", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        HttpServer.prototype.connect = function (listener, thisObj) {
            listener.apply(thisObj);
        };
        HttpServer.prototype.send = function (bytes) {
            var url = "http://" + this.serverInfo.ip + ":" + this.serverInfo.hport;
            this._httpRequest.open(url, egret.HttpMethod.POST);
            this._httpRequest.send(bytes.buffer);
        };
        HttpServer.prototype.close = function () {
        };
        return HttpServer;
    }(SspServer));
    net.HttpServer = HttpServer;
    __reflect(HttpServer.prototype, "net.HttpServer");
    var WebSocketServer = (function (_super) {
        __extends(WebSocketServer, _super);
        function WebSocketServer() {
            var _this = _super.call(this) || this;
            _this._heartTime = 0;
            _this._heartIntervalId = -1;
            _this._heartNotificationName = "";
            _this._webSocket = new egret.WebSocket();
            _this._webSocket.type = egret.WebSocket.TYPE_BINARY;
            _this._webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, _this.onReceiveMessage, _this);
            _this._webSocket.addEventListener(egret.Event.CONNECT, _this.onSocketOpen, _this);
            _this._webSocket.addEventListener(egret.Event.CLOSE, _this.onSocketClose, _this);
            _this._webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, _this.onSocketError, _this);
            return _this;
        }
        WebSocketServer.prototype.connect = function (listener, thisObj) {
            this._webSocket.connect(this.serverInfo.ip, this.serverInfo.wport);
            this._onConnectSuccess = listener;
            this._onConnectSuccessThisObj = thisObj;
        };
        Object.defineProperty(WebSocketServer.prototype, "isConnected", {
            get: function () {
                return this._webSocket.connected;
            },
            enumerable: true,
            configurable: true
        });
        WebSocketServer.prototype.onSocketOpen = function (event) {
            egret.log("WebSocketOpen");
            if (this._onConnectSuccess != null) {
                this._onConnectSuccess.apply(this._onConnectSuccessThisObj);
                this._onConnectSuccess = null;
            }
        };
        WebSocketServer.prototype.setHeart = function (step, heartNotificationName, isAction) {
            if (heartNotificationName === void 0) { heartNotificationName = ""; }
            if (step > 0) {
                this._heartNotificationName = heartNotificationName;
                if (this._heartIntervalId != -1) {
                    egret.clearInterval(this._heartIntervalId);
                }
                this._heartTime = step;
                this._heartNotificationName = heartNotificationName;
                this._heartNotificationNameIsAction = isAction;
                this._heartIntervalId = egret.setInterval(this.heartStep, this, this._heartTime);
            }
            else {
                this.clearHeart();
            }
        };
        WebSocketServer.prototype.clearHeart = function () {
            if (this._heartIntervalId != -1) {
                egret.clearInterval(this._heartIntervalId);
                this._heartIntervalId = -1;
            }
        };
        WebSocketServer.prototype.heartStep = function () {
            if (this._heartTime <= 0) {
                this.clearHeart();
                return;
            }
            if (mvc.has(this._heartNotificationName)) {
                mvc.send(this._heartNotificationName);
            }
            else {
                if (this._heartNotificationNameIsAction) {
                    pvo().to(parseInt(this._heartNotificationName), this);
                }
            }
        };
        WebSocketServer.prototype.onReceiveMessage = function (event) {
            var bytes = new egret.ByteArray();
            this._webSocket.readBytes(bytes);
            this.recv(bytes);
        };
        WebSocketServer.prototype.onSocketClose = function () {
            egret.log("WebSocketClose");
        };
        WebSocketServer.prototype.onSocketError = function () {
            egret.log("WebSocketError");
        };
        WebSocketServer.prototype.send = function (bytes, listener) {
            this._webSocket.writeBytes(bytes);
            this._webSocket.flush();
        };
        WebSocketServer.prototype.close = function () {
            this._webSocket.close();
        };
        return WebSocketServer;
    }(SspServer));
    net.WebSocketServer = WebSocketServer;
    __reflect(WebSocketServer.prototype, "net.WebSocketServer");
    var ParamVOReader = (function (_super) {
        __extends(ParamVOReader, _super);
        function ParamVOReader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ParamVOReader.prototype.execute = function (notification) {
            this.action = notification.getName();
            this.messageVO = notification.getBody();
            this.paramVO = this.messageVO.data;
            if (this.messageVO.errorCode != 0 && this.messageVO.errorCode != null) {
                //继承onReceiveError，处理细节后返回true，否则调用统一处理函数
                if (!this.onReceiveError(this.messageVO.errorCode)) {
                    egret.log("action:" + this.messageVO.action + ", error:" + this.messageVO.errorCode);
                }
            }
            else {
                this.onReceiveData(this.paramVO);
            }
        };
        ParamVOReader.prototype.onReceiveError = function (errorCode) { return false; }; //抽象函数，继承实现错误解析
        ParamVOReader.prototype.onReceiveData = function (paramVO) { }; //抽象函数，继承实现解析方法
        return ParamVOReader;
    }(puremvc.SimpleCommand));
    net.ParamVOReader = ParamVOReader;
    __reflect(ParamVOReader.prototype, "net.ParamVOReader");
    function pvo() { return new ParamVoWriter(); }
    net.pvo = pvo;
    var ParamVoWriter = (function (_super) {
        __extends(ParamVoWriter, _super);
        function ParamVoWriter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** 添加 longValues*/
        ParamVoWriter.prototype.l = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.paramVO == null)
                this.paramVO = ssp.getProtobufVO("ParamVO");
            var len = args.length;
            for (var i = 0; i < len; ++i) {
                this.paramVO.longValues[i] = dcodeIO.Long.fromNumber(args[i]);
            }
            return this;
        };
        /** 添加 intValues*/
        ParamVoWriter.prototype.i = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.paramVO == null)
                this.paramVO = ssp.getProtobufVO("ParamVO");
            this.paramVO.intValues = args;
            return this;
        };
        /** 添加 strValues*/
        ParamVoWriter.prototype.s = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.paramVO == null)
                this.paramVO = ssp.getProtobufVO("ParamVO");
            this.paramVO.strValues = args;
            return this;
        };
        /** 添加 data*/
        ParamVoWriter.prototype.d = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.paramVO == null)
                this.paramVO = ssp.getProtobufVO("ParamVO");
            this.paramVO.data = args;
            return this;
        };
        ParamVoWriter.prototype.to = function (action, server, listener, reaction) {
            var messagevo = ssp.getProtobufVO("MessageVO");
            messagevo.phase = 1;
            messagevo.action = action;
            messagevo.clientNumId = server.userId;
            messagevo.token = server.token;
            messagevo.data = this.paramVO || ssp.getProtobufVO("ParamVO");
            var messagebuf = messagevo.toArrayBuffer();
            var sendBuffer = new egret.ByteArray();
            sendBuffer.writeInt(messagebuf.byteLength);
            sendBuffer.writeBytes(new egret.ByteArray(messagebuf));
            if (listener != null)
                server.addOnceListener(listener, reaction);
            server.send(sendBuffer);
            egret.log("send: " + server.serverInfo.modelId + "-" + action);
        };
        return ParamVoWriter;
    }(puremvc.SimpleCommand));
    net.ParamVoWriter = ParamVoWriter;
    __reflect(ParamVoWriter.prototype, "net.ParamVoWriter");
})(net || (net = {}));
//# sourceMappingURL=Network.js.map