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
var ui;
(function (ui) {
    var _screenClassDict = {};
    function register(id, screenClass) {
        _screenClassDict[id] = screenClass;
    }
    ui.register = register;
    var _currentScreen;
    var _willOpenScreen;
    var _loadingScreen;
    function open(id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var ScreenClass = _screenClassDict[id];
        var sspUi = new ScreenClass();
        sspUi.openData = args;
        if (sspUi instanceof SspScreen) {
            if (_currentScreen == sspUi)
                return;
            _willOpenScreen = sspUi;
            if (_loadingScreen == null) {
                _loadingScreen = new fg.FightGridLoadingScreen();
                // _loadingScreen = new LoadingScreen();
            }
            _loadingScreen.load(_willOpenScreen.resGroup, onScreenLoadCompelte, this);
        }
        else if (sspUi instanceof SspWindow) {
            // sspUi.show();
            fairygui.GRoot.inst.showPopup(sspUi);
            sspUi.center();
        }
    }
    ui.open = open;
    function onScreenLoadCompelte() {
        if (_currentScreen != null) {
            _currentScreen.hideUi();
        }
        _currentScreen = _willOpenScreen;
        _willOpenScreen.showUi();
        _willOpenScreen = null;
        _loadingScreen.hideUi();
    }
    var SspScreen = (function (_super) {
        __extends(SspScreen, _super);
        function SspScreen() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SspScreen.prototype.getSound = function (name) {
            return this.uipackage.getItemAssetByName(name);
        };
        SspScreen.prototype._initCommonPack = function () {
            if (cfg.commonPack == null)
                cfg.commonPack = fairygui.UIPackage.addPackage("common");
        };
        SspScreen.prototype.showUi = function () {
            this._initCommonPack();
            this.uipackage = fairygui.UIPackage.addPackage(this.fairyPkgName);
            this.view = fairygui.UIPackage.createObject(this.fairyPkgName, this.fairyResName, this.fairyUserClass).asCom;
            this._fastChildGetter = new comp.FastChildGetter(this.view, this.onClick, this);
            this.setViewComponent(this.view);
            puremvc.Facade.getInstance().registerMediator(this);
            this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
            if (this.parentLayer == null)
                this.parentLayer = ui.fairyLayer;
            this.parentLayer.addChild(this.view);
            this.onInit();
        };
        SspScreen.prototype.onInit = function () {
        };
        SspScreen.prototype.onClick = function (target) {
        };
        SspScreen.prototype.hideUi = function () {
            this.onHide();
            if (this.view != null)
                this.view.removeFromParent();
            puremvc.Facade.getInstance().removeMediator(this.mediatorName);
            this.dispose();
        };
        SspScreen.prototype.onHide = function () {
        };
        SspScreen.prototype.dispose = function () {
        };
        SspScreen.prototype.getChild = function (path) {
            return this._fastChildGetter.getChild(path);
        };
        SspScreen.prototype.getPath = function (gObject) {
            return this._fastChildGetter.getPath(gObject);
        };
        return SspScreen;
    }(puremvc.Mediator));
    ui.SspScreen = SspScreen;
    __reflect(SspScreen.prototype, "ui.SspScreen", ["ui.ISspUi"]);
    var SspWindow = (function (_super) {
        __extends(SspWindow, _super);
        function SspWindow(mdrName, pkgName, resName, userClass) {
            var _this = _super.call(this) || this;
            _this._mediator = new puremvc.Mediator(mdrName);
            _this.pkgName = pkgName;
            _this.resName = resName;
            _this.userClass = userClass;
            _this.modal = true;
            return _this;
        }
        SspWindow.prototype.getSound = function (name) {
            return this.uipackage.getItemAssetByName(name);
        };
        SspWindow.prototype.showUi = function () {
            this.show();
        };
        SspWindow.prototype.hideUi = function () {
        };
        SspWindow.prototype.onInit = function () {
            this.contentPane = fairygui.UIPackage.createObject(this.pkgName, this.resName, this.userClass).asCom;
            this.center();
            this.setPivot(0.5, 0.5);
            this._fastChildGetter = new comp.FastChildGetter(this.contentPane, this.onClick, this);
            puremvc.Facade.getInstance().registerMediator(this);
            this.view = this.contentPane;
            this._mediator.viewComponent = this.contentPane;
        };
        SspWindow.prototype.onClick = function (target) {
        };
        SspWindow.prototype.dispose = function () {
            puremvc.Facade.getInstance().removeMediator(this._mediator.mediatorName);
        };
        SspWindow.prototype.doShowAnimation = function () {
            this.setScale(0.1, 0.1);
            egret.Tween.get(this).set({ alpha: .5 }).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, egret.Ease.backOut).call(this.onShown, this);
        };
        SspWindow.prototype.doHideAnimation = function () {
            egret.Tween.get(this).to({ scaleX: 0.1, scaleY: 0.1, alpha: .5 }, 300, egret.Ease.backIn).call(this.hideImmediately, this);
        };
        SspWindow.prototype.getChild = function (path) {
            return this._fastChildGetter.getChild(path);
        };
        SspWindow.prototype.getPath = function (gObject) {
            return this._fastChildGetter.getPath(gObject);
        };
        SspWindow.prototype.getMediatorName = function () {
            return this._mediator.getMediatorName();
        };
        SspWindow.prototype.getViewComponent = function () {
            return this._mediator.getViewComponent();
        };
        SspWindow.prototype.setViewComponent = function (viewComponent) {
            this._mediator.setViewComponent(viewComponent);
        };
        SspWindow.prototype.listNotificationInterests = function () {
            return this._mediator.listNotificationInterests();
        };
        SspWindow.prototype.handleNotification = function (notification) {
            this._mediator.handleNotification(notification);
        };
        SspWindow.prototype.onRegister = function () {
            this._mediator.onRegister();
        };
        SspWindow.prototype.onRemove = function () {
            this._mediator.onRemove();
        };
        SspWindow.prototype.sendNotification = function (name, body, type) {
            this._mediator.sendNotification(name, body, type);
        };
        return SspWindow;
    }(fairygui.Window));
    ui.SspWindow = SspWindow;
    __reflect(SspWindow.prototype, "ui.SspWindow", ["puremvc.IMediator", "puremvc.INotifier", "ui.ISspUi"]);
})(ui || (ui = {}));
//# sourceMappingURL=UI.js.map